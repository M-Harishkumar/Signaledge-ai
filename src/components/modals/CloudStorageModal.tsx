import React, { useState } from 'react';
import { Cloud, Check, RefreshCw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export interface CloudStorageModalProps {
  onClose: () => void;
}

export const CloudStorageModal: React.FC<CloudStorageModalProps> = ({ onClose }) => {
  const [googleDriveConnected, setGoogleDriveConnected] = useState(true);
  const [s3BackupEnabled, setS3BackupEnabled] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleTriggerSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F3F4F6] font-display">Cloud Redundancy & Dual-Write</h2>
            <p className="text-xs text-[#9CA3AF]">Zero-Lock-in Research Portability</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <p className="text-[#9CA3AF]">
          SignalEdge OS automatically mirrors all your financial models, dossiers, and screener alerts to your personal cloud storage.
        </p>

        {/* Cloud Providers */}
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-[#161F30] border border-[#1F293D] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold font-mono">
                GD
              </div>
              <div>
                <span className="font-semibold text-[#F3F4F6] block">Google Drive Sync</span>
                <span className="text-[11px] text-[#6B7280]">Folder: /SignalEdge-Research/</span>
              </div>
            </div>
            <button
              onClick={() => setGoogleDriveConnected(!googleDriveConnected)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold cursor-pointer ${
                googleDriveConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1'
                  : 'bg-[#1E293B] text-[#9CA3AF]'
              }`}
            >
              {googleDriveConnected ? <Check className="w-3 h-3" /> : null}
              {googleDriveConnected ? 'Connected' : 'Connect'}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-[#161F30] border border-[#1F293D] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold font-mono">
                S3
              </div>
              <div>
                <span className="font-semibold text-[#F3F4F6] block">AWS S3 / Cloudflare R2</span>
                <span className="text-[11px] text-[#6B7280]">Dual-write cold backup</span>
              </div>
            </div>
            <button
              onClick={() => setS3BackupEnabled(!s3BackupEnabled)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold cursor-pointer ${
                s3BackupEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1'
                  : 'bg-[#1E293B] text-[#9CA3AF]'
              }`}
            >
              {s3BackupEnabled ? <Check className="w-3 h-3" /> : null}
              {s3BackupEnabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-[#1F293D] flex items-center justify-between">
          <span className="text-[11px] text-[#6B7280] font-mono">Last synced: Today 08:30 IST</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleTriggerSync} isLoading={syncing}>
              <RefreshCw className="w-3 h-3 mr-1" /> Force Sync Now
            </Button>
            <Button size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
