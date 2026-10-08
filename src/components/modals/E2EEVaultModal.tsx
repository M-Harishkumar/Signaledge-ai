import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export interface E2EEVaultModalProps {
  isUnlocked: boolean;
  onUnlockVault: (passphrase: string) => Promise<boolean>;
  onLockVault: () => void;
  onClose: () => void;
}

export const E2EEVaultModal: React.FC<E2EEVaultModalProps> = ({
  isUnlocked,
  onUnlockVault,
  onLockVault,
  onClose,
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase) {
      setError('Please enter your vault passphrase.');
      return;
    }
    setLoading(true);
    setError('');
    const success = await onUnlockVault(passphrase);
    setLoading(false);
    if (success) {
      onClose();
    } else {
      setError('Invalid passphrase. Please verify and try again.');
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F3F4F6] font-display">Local Session Privacy Lock</h2>
            <p className="text-xs text-[#9CA3AF]">Client-Side Passphrase Protection</p>
          </div>
        </div>
      }
    >
      {isUnlocked ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F3F4F6]">Vault is Currently Unlocked</h3>
            <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs mx-auto">
              Your confidential theses, custom valuations, and portfolio weights are decrypted locally in memory.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="danger" size="sm" onClick={onLockVault}>
              Lock Vault Now
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="p-3 rounded-lg bg-[#161F30] border border-[#1F293D] text-xs text-[#9CA3AF] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your keys never leave your browser. Passphrase derives AES-GCM master key using 600,000 PBKDF2 iterations.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#F3F4F6] block mb-1.5 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-[#9CA3AF]" />
              Master Vault Passphrase
            </label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter your confidential passphrase..."
              className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl px-3.5 py-2.5 text-xs text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500/50"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#6B7280]">Default demo pass: any string</span>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={loading}>
                Unlock Vault
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
