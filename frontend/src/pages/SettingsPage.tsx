import React, { useState } from 'react';
import { User, Shield, LogOut, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/core/api/client';
import { Button } from '@/components/ui/button';

export const SettingsPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (!oldPassword || !newPassword) {
      setPwdMsg({ type: 'error', text: 'Please fill in both current and new passwords.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPwdMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    setPwdLoading(true);
    try {
      const res = await apiClient.post('/settings/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPwdMsg({ type: 'success', text: res.data.message || 'Password updated successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to change password.';
      setPwdMsg({ type: 'error', text: msg });
    } finally {
      setPwdLoading(false);
    }
  };

  const userName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User' : 'User';
  const userEmail = user?.email || 'N/A';
  const userRole = user?.role || 'Customer';

  return (
    <div className="space-y-8 pb-12 w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your account profile and security settings.
        </p>
      </div>

      {/* 1. PROFILE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
            <p className="text-xs text-slate-500">Authenticated user credentials and system role</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</div>
            <div className="text-base font-bold text-slate-900">{userName}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</div>
            <div className="text-base font-bold text-slate-900 truncate">{userEmail}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Role</div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 mt-0.5">
              <Shield className="w-3 h-3" />
              {userRole}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECURITY SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Security</h2>
            <p className="text-xs text-slate-500">Update account password or end active session</p>
          </div>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <h3 className="text-sm font-bold text-slate-800">Change Password</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                placeholder="Min 8 chars"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {pwdMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              pwdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {pwdMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {pwdMsg.text}
            </div>
          )}

          <Button
            type="submit"
            disabled={pwdLoading}
            className="bg-[#0F766E] hover:bg-[#0F766E]/90 text-white font-bold text-sm h-10 px-6 rounded-xl"
          >
            {pwdLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...</> : 'Update Password'}
          </Button>
        </form>

        <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900">Account Session</div>
            <div className="text-xs text-slate-500">Sign out of FraudShield AI on this device</div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold text-xs h-10 px-4 rounded-xl flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
