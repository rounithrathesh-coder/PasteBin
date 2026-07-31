import React, { useState } from 'react';
import { usePastes } from '../../context/PasteContext';
import { AccountWidgets } from './AccountWidgets';

export const AccountView: React.FC = () => {
  const { showToast } = usePastes();

  const [name, setName] = useState('Rounith Arrun Rathesh');
  const [username, setUsername] = useState('rounithrathesh');
  const [email, setEmail] = useState('rounith.rathesh@example.com');
  const [bio, setBio] = useState('Senior Full Stack Developer & DevOps Engineer.');

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile information updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      showToast('Please fill in password fields.');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('New passwords do not match!');
      return;
    }
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    showToast('Password changed successfully!');
  };

  const handleExportData = () => {
    showToast('Exporting snippets package (JSON & Markdown)...');
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1 border-b border-outline-variant/40 pb-5">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">account_circle</span>
              Account &amp; Security Settings
            </h1>
            <p className="text-sm text-on-surface-variant">
              Manage your personal profile, credentials, security sessions, and account preferences.
            </p>
          </div>

          {/* 1. Public Profile Settings */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/50 pb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">person</span>
              Public Profile
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-outline">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-outline">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-outline">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary pr-20"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Verified
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-outline">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:brightness-110 transition-all shadow-sm"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>

          {/* 2. Security & Password Change */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/50 pb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-base">lock</span>
              Password &amp; Authentication
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-outline">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-outline">New Password</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-outline">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-base">security</span>
                  <span className="text-on-surface font-medium">Two-Factor Authentication (2FA)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Enabled
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-container-high border border-outline-variant/60 text-xs font-semibold text-on-surface transition-colors"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* 3. Export Data & Danger Zone */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/50 pb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-base">download</span>
              Data Management &amp; Export
            </h3>

            <div className="flex items-center justify-between text-xs font-mono">
              <div>
                <div className="font-bold text-on-surface">Export Snippets Archive</div>
                <div className="text-outline text-[11px]">Download all your snippets, metadata, and history in a ZIP bundle.</div>
              </div>

              <button
                onClick={handleExportData}
                className="px-3.5 py-2 rounded-lg border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">download</span> Export Archive
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-base">warning</span>
              Danger Zone
            </h3>

            <div className="flex items-center justify-between text-xs font-mono">
              <div>
                <div className="font-bold text-on-surface">Delete Account</div>
                <div className="text-outline text-[11px]">Permanently delete your account and all associated snippets.</div>
              </div>

              <button
                onClick={() => setDeleteModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span> Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar Widgets */}
      <aside className="w-80 border-l border-outline-variant/60 shrink-0 overflow-y-auto custom-scrollbar bg-surface-container-lowest p-5 space-y-6">
        <AccountWidgets />
      </aside>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400 border-b border-outline-variant/50 pb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Delete Account Permanently</h3>
                <p className="text-xs text-outline font-mono">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you want to delete account <strong className="text-on-surface">@rounithrathesh</strong>? All public and private code snippets, API keys, and personal storage will be permanently wiped.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-outline-variant/60 text-xs font-mono text-outline hover:text-on-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  showToast('Account deletion request submitted.');
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
