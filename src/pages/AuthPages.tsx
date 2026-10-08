import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Key, Lock, Mail, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { api } from '../services/api';

export type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

export interface AuthPagesProps {
  mode: AuthMode;
  onSuccess: (email: string) => void;
  onSwitchMode: (mode: AuthMode) => void;
  onBackToHome: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  mode,
  onSuccess,
  onSwitchMode,
  onBackToHome,
}) => {
  const [email, setEmail] = useState('investor@signaledge.in');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Aravind Kumar');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (mode === 'LOGIN') {
        const res = await api.login(email, password);
        onSuccess(res.user.email);
      } else if (mode === 'SIGNUP') {
        const res = await api.signup(email, password, fullName);
        onSuccess(res.user.email);
      } else if (mode === 'FORGOT_PASSWORD') {
        const res = await api.forgotPassword(email);
        setSuccessMessage(res.message);
        if (res.resetToken) {
          setResetToken(res.resetToken);
          setTimeout(() => onSwitchMode('RESET_PASSWORD'), 1800);
        }
      } else if (mode === 'RESET_PASSWORD') {
        await api.resetPassword(resetToken, newPassword);
        setSuccessMessage('Your password has been reset successfully. Please log in.');
        setTimeout(() => onSwitchMode('LOGIN'), 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#E5E7EB] flex flex-col justify-center items-center p-6 selection:bg-emerald-500 selection:text-black">
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to SignalEdge
      </button>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-sm glow-emerald">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#F3F4F6] font-display">
            {mode === 'LOGIN' && 'Sign In to Your Workstation'}
            {mode === 'SIGNUP' && 'Create Your Workstation'}
            {mode === 'FORGOT_PASSWORD' && 'Reset Your Password'}
            {mode === 'RESET_PASSWORD' && 'Set New Password'}
          </h1>
          <p className="text-xs text-[#9CA3AF]">
            {mode === 'LOGIN' && 'Pre-recognition Indian equity intelligence & multi-agent simulations.'}
            {mode === 'SIGNUP' && 'Access institutional research desks and 8-layer fundamental audits.'}
            {mode === 'FORGOT_PASSWORD' && 'Enter your registered email to receive a recovery link.'}
            {mode === 'RESET_PASSWORD' && 'Choose a strong password with at least 8 characters.'}
          </p>
        </div>

        <Card variant="elevated">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'SIGNUP' && (
              <div>
                <label className="font-semibold text-[#F3F4F6] block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Aravind Kumar"
                    className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl pl-9 pr-3 py-2.5 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500/50 font-sans"
                    required
                  />
                </div>
              </div>
            )}

            {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'FORGOT_PASSWORD') && (
              <div>
                <label className="font-semibold text-[#F3F4F6] block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@signaledge.in"
                    className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl pl-9 pr-3 py-2.5 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500/50 font-sans"
                    required
                  />
                </div>
              </div>
            )}

            {(mode === 'LOGIN' || mode === 'SIGNUP') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-[#F3F4F6]">Password</label>
                  {mode === 'LOGIN' && (
                    <button
                      type="button"
                      onClick={() => onSwitchMode('FORGOT_PASSWORD')}
                      className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl pl-9 pr-3 py-2.5 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500/50 font-sans"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            )}

            {mode === 'RESET_PASSWORD' && (
              <>
                <div>
                  <label className="font-semibold text-[#F3F4F6] block mb-1">Reset Token</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="Paste reset token here..."
                      className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl pl-9 pr-3 py-2.5 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500/50 font-mono text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#F3F4F6] block mb-1">New Password (8+ characters)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password..."
                      className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl pl-9 pr-3 py-2.5 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500/50 font-sans"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full font-semibold" size="md" isLoading={isLoading}>
              {mode === 'LOGIN' && 'Sign In'}
              {mode === 'SIGNUP' && 'Create Account & Continue'}
              {mode === 'FORGOT_PASSWORD' && 'Send Recovery Instructions'}
              {mode === 'RESET_PASSWORD' && 'Set New Password'}
            </Button>
          </form>

          {/* Bottom Switcher */}
          <div className="pt-4 mt-4 border-t border-[#1F293D] text-center text-xs text-[#9CA3AF]">
            {mode === 'LOGIN' && (
              <span>
                Don't have an account?{' '}
                <button
                  onClick={() => onSwitchMode('SIGNUP')}
                  className="text-emerald-400 font-semibold hover:underline cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </span>
            )}
            {mode === 'SIGNUP' && (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => onSwitchMode('LOGIN')}
                  className="text-emerald-400 font-semibold hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </span>
            )}
            {(mode === 'FORGOT_PASSWORD' || mode === 'RESET_PASSWORD') && (
              <button
                onClick={() => onSwitchMode('LOGIN')}
                className="text-emerald-400 font-semibold hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
