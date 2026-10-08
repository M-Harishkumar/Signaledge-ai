import crypto from 'crypto';
import { db, StoredUser } from '../db/database';

export interface AuthResponse {
  user: {
    user_id: string;
    email: string;
    display_name: string;
    role: string;
    onboarding_completed: boolean;
    created_at: string;
  };
  token: string;
}

export class AuthService {
  public static sanitizeUser(user: StoredUser) {
    const { password_hash, password_salt, reset_token, reset_token_expires, ...safe } = user;
    return safe;
  }

  public static async register(params: {
    email: string;
    password: string;
    displayName: string;
  }): Promise<AuthResponse> {
    const email = params.email.trim().toLowerCase();

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!params.password || params.password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    if (!params.displayName || params.displayName.trim().length < 2) {
      throw new Error('Please provide your full name.');
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const user = db.createUser({
      email,
      passwordPlain: params.password,
      displayName: params.displayName.trim(),
    });

    const session = db.createSession(user.user_id);

    return {
      user: this.sanitizeUser(user),
      token: session.token,
    };
  }

  public static async login(params: { email: string; password: string }): Promise<AuthResponse> {
    const email = params.email.trim().toLowerCase();
    const user = db.getUserByEmail(email);

    if (!user) {
      throw new Error('No account found with this email address.');
    }

    const isValid = db.verifyPassword(user, params.password);
    if (!isValid) {
      throw new Error('Incorrect password. Please try again.');
    }

    const session = db.createSession(user.user_id);

    return {
      user: this.sanitizeUser(user),
      token: session.token,
    };
  }

  public static async logout(token: string): Promise<void> {
    db.deleteSession(token);
  }

  public static async generatePasswordReset(email: string): Promise<{ resetToken: string; message: string }> {
    const user = db.getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return {
        resetToken: '',
        message: 'If an account exists with this email, password reset instructions have been generated.',
      };
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    db.updateUser(user.user_id, {
      reset_token: resetToken,
      reset_token_expires: expires,
    });

    return {
      resetToken,
      message: 'Password reset token generated. Use the reset form to set a new password.',
    };
  }

  public static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    const allUsers = (db as any).schema?.users as StoredUser[];
    const targetUser = allUsers.find(
      (u) => u.reset_token === token && u.reset_token_expires && new Date(u.reset_token_expires).getTime() > Date.now()
    );

    if (!targetUser) {
      throw new Error('Invalid or expired password reset link.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(newPassword, salt, 10000, 64, 'sha512').toString('hex');

    db.updateUser(targetUser.user_id, {
      password_hash: hash,
      password_salt: salt,
      reset_token: undefined,
      reset_token_expires: undefined,
    });

    return true;
  }
}
