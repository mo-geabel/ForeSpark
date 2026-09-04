import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  MoveLeftIcon,
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  PauseCircle,
  PlayCircle,
  Trash2,
  Search,
  RefreshCw,
  AlertTriangle,
  Lock,
  FileText,
  Save,
  Eye,
  RotateCcw,
  Settings,
  Phone,
} from 'lucide-react';

interface ManagedUser {
  _id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  isPaused: boolean;
  date?: string;
}

interface SummaryData {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  activeUsers: number;
  pausedUsers: number;
}

export default function AdminPanel() {
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  // Navigation tab: 'users' vs 'policies' vs 'settings'
  const [adminSection, setAdminSection] = useState<'users' | 'policies' | 'settings'>('users');

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    activeUsers: 0,
    pausedUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user' | 'paused'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dynamic Policies state
  const [policyTitle, setPolicyTitle] = useState('Terms of Service & Privacy Policy');
  const [policyContent, setPolicyContent] = useState('');
  const [policyRequireAcceptance, setPolicyRequireAcceptance] = useState(true);
  const [policyLastUpdated, setPolicyLastUpdated] = useState('');
  const [policyUpdatedBy, setPolicyUpdatedBy] = useState('');
  const [policySaving, setPolicySaving] = useState(false);
  const [showPolicyPreviewModal, setShowPolicyPreviewModal] = useState(false);

  // Admin Profile state
  const [adminFullName, setAdminFullName] = useState(currentUser?.fullName || '');
  const [adminPhone, setAdminPhone] = useState(currentUser?.phoneNumber || '');
  const [adminSaving, setAdminSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setAdminFullName(currentUser.fullName || '');
      setAdminPhone(currentUser.phoneNumber || '');
    }
  }, [currentUser]);

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminFullName.trim()) {
      showNotification('error', 'Full Name cannot be empty.');
      return;
    }

    setAdminSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
          'Authorization': `Bearer ${token || ''}`,
          'x-user-email': currentUser?.email || '',
        },
        body: JSON.stringify({
          fullName: adminFullName.trim(),
          phoneNumber: adminPhone.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        updateUser({
          fullName: data.user.fullName,
          phoneNumber: data.user.phoneNumber,
        });
        showNotification('success', 'Admin profile details updated successfully!');
      } else {
        showNotification('error', data.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Server error updating profile.');
    } finally {
      setAdminSaving(false);
    }
  };

  const token = localStorage.getItem('fireforest_token');
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || (import.meta.env.DEV ? '' : 'https://forestspark.onrender.com');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'x-auth-token': token || '',
          'Authorization': `Bearer ${token || ''}`,
        },
      });
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setUsers(data.users || []);
        if (data.summary) {
          setSummary(data.summary);
        }
      } else {
        setFeedbackMessage({ type: 'error', text: 'Failed to fetch users.' });
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Network error fetching users.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPolicy = async () => {
    try {
      const response = await fetch(`${API_URL}/api/policies`);
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.title) {
          setPolicyTitle(data.title);
          setPolicyContent(data.content || '');
          setPolicyRequireAcceptance(data.requireAcceptance ?? true);
          setPolicyLastUpdated(data.lastUpdated || '');
          setPolicyUpdatedBy(data.updatedBy || 'Admin');
        }
      }
    } catch (err: any) {
      console.error('Error fetching policy:', err);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
      fetchPolicy();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleSavePolicy = async () => {
    if (!policyContent.trim()) {
      showNotification('error', 'Policy content cannot be empty.');
      return;
    }

    setPolicySaving(true);
    try {
      const response = await fetch(`${API_URL}/api/policies`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          title: policyTitle.trim(),
          content: policyContent.trim(),
          requireAcceptance: policyRequireAcceptance,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.policy) {
          setPolicyLastUpdated(data.policy.lastUpdated);
          setPolicyUpdatedBy(data.policy.updatedBy);
        }
        showNotification('success', 'Policies updated successfully! Changes are live across all apps and screens.');
      } else {
        showNotification('error', data.message || 'Failed to update policy.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Network error updating policy.');
    } finally {
      setPolicySaving(false);
    }
  };

  const handleResetPolicyTemplate = () => {
    if (!window.confirm('Reset policy editor to the default template? You will need to click Save to apply it.')) return;

    setPolicyTitle('Terms of Service & Privacy Policy');
    setPolicyContent(`Welcome to ForeSpark. By using our services, registering an account, or continuing with Google Sign-In, you agree to comply with and be bound by the following terms and policies:

1. Acceptance of Terms
By creating an account or using ForeSpark services, you acknowledge that you have read, understood, and agreed to be bound by these policies.

2. Privacy & Data Collection
We collect basic profile information (such as name and email address) and scan history to provide fire prediction, satellite analysis, and reporting services. We prioritize your privacy and do not sell your personal data to third parties.

3. Google Authentication
When signing in or registering with Google, you authorize ForeSpark to authenticate your identity using your verified Google profile information (name, email, and Google profile ID) in accordance with Google API Services User Data Policy.

4. Acceptable Use
You agree to use ForeSpark exclusively for lawful fire safety, monitoring, and educational evaluation purposes. Any attempt to abuse, reverse-engineer, or disrupt platform infrastructure is strictly prohibited.

5. AI Prediction Disclaimer
ForeSpark provides risk assessments using satellite imagery and machine learning models. These predictions are designed for situational awareness and decision support. They do not replace authoritative directives from civil defense or emergency services.

6. Account Management & Termination
Administrators reserve the right to suspend or terminate accounts that violate platform policies or compromise system security.

7. Policy Updates
These policies may be revised periodically by administrators. Continued use of ForeSpark following any updates constitutes acceptance of the modified policies.`);
    setPolicyRequireAcceptance(true);
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  // Change Role Handler
  const handleToggleRole = async (targetUser: ManagedUser) => {
    const isSelf = targetUser._id === currentUser?.id || targetUser.email === currentUser?.email;
    if (isSelf) {
      showNotification('error', 'You cannot change your own admin role.');
      return;
    }

    const newRole: 'admin' | 'user' = targetUser.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = `Are you sure you want to change ${targetUser.fullName}'s role to ${newRole.toUpperCase()}?`;
    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(targetUser._id);
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${targetUser._id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
          'Authorization': `Bearer ${token || ''}`,
          'x-user-email': currentUser?.email || '',
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
        );
        setSummary((prev) => ({
          ...prev,
          adminUsers: newRole === 'admin' ? prev.adminUsers + 1 : prev.adminUsers - 1,
          regularUsers: newRole === 'user' ? prev.regularUsers + 1 : prev.regularUsers - 1,
        }));
        showNotification('success', `${targetUser.fullName} is now an ${newRole}.`);
      } else {
        showNotification('error', data.message || 'Failed to update user role.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Server error updating user role.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Pause / Resume Status Handler
  const handleTogglePause = async (targetUser: ManagedUser) => {
    const isSelf = targetUser._id === currentUser?.id || targetUser.email === currentUser?.email;
    if (isSelf) {
      showNotification('error', 'You cannot pause your own account.');
      return;
    }

    const willPause = !targetUser.isPaused;
    const confirmMsg = willPause
      ? `Are you sure you want to pause ${targetUser.fullName}'s account? They won't be able to log in.`
      : `Are you sure you want to resume ${targetUser.fullName}'s account?`;
    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(targetUser._id);
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${targetUser._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
          'Authorization': `Bearer ${token || ''}`,
          'x-user-email': currentUser?.email || '',
        },
        body: JSON.stringify({ isPaused: willPause }),
      });
      const data = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, isPaused: willPause } : u))
        );
        setSummary((prev) => ({
          ...prev,
          pausedUsers: willPause ? prev.pausedUsers + 1 : prev.pausedUsers - 1,
          activeUsers: willPause ? prev.activeUsers - 1 : prev.activeUsers + 1,
        }));
        showNotification(
          'success',
          `Account for ${targetUser.fullName} has been ${willPause ? 'paused' : 'activated'}.`
        );
      } else {
        showNotification('error', data.message || 'Failed to update account status.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Server error updating account status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (targetUser: ManagedUser) => {
    const isSelf = targetUser._id === currentUser?.id || targetUser.email === currentUser?.email;
    if (isSelf) {
      showNotification('error', 'You cannot delete your own account.');
      return;
    }

    const confirmMsg = `WARNING: Are you sure you want to permanently delete ${targetUser.fullName} (${targetUser.email})? This action cannot be undone!`;
    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(targetUser._id);
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${targetUser._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token || '',
          'Authorization': `Bearer ${token || ''}`,
          'x-user-email': currentUser?.email || '',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));
        setSummary((prev) => ({
          ...prev,
          totalUsers: Math.max(0, prev.totalUsers - 1),
          adminUsers: targetUser.role === 'admin' ? Math.max(0, prev.adminUsers - 1) : prev.adminUsers,
          regularUsers: targetUser.role !== 'admin' ? Math.max(0, prev.regularUsers - 1) : prev.regularUsers,
          activeUsers: !targetUser.isPaused ? Math.max(0, prev.activeUsers - 1) : prev.activeUsers,
          pausedUsers: targetUser.isPaused ? Math.max(0, prev.pausedUsers - 1) : prev.pausedUsers,
        }));
        showNotification('success', `User ${targetUser.fullName} has been permanently deleted.`);
      } else {
        showNotification('error', data.message || 'Failed to delete user.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Server error deleting user.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterRole === 'admin') return u.role === 'admin';
      if (filterRole === 'user') return u.role !== 'admin';
      if (filterRole === 'paused') return u.isPaused;
      return true;
    });
  }, [users, searchQuery, filterRole]);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm mb-6">
            You must be an administrator to access this management console.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute top-0 left-0 w-full h-[360px] bg-emerald-600/5 -skew-y-3 origin-top-left z-0" />

      <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <button
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all mb-4"
            >
              <MoveLeftIcon size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Admin Panel
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Management
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium mt-1">
              View user statistics, manage permissions, pause accounts, or delete records.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 px-5 py-3 rounded-2xl shadow-sm font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-600' : ''} />
            Refresh Data
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-center justify-between text-sm font-bold transition-all ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs uppercase opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section Tabs Switcher */}
        <div className="flex items-center gap-3 mb-8 bg-slate-200/70 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setAdminSection('users')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              adminSection === 'users'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users size={16} />
            User Management
          </button>

          <button
            onClick={() => setAdminSection('policies')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              adminSection === 'policies'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText size={16} />
            Policies & Terms Editor
          </button>

          <button
            onClick={() => setAdminSection('settings')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              adminSection === 'settings'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings size={16} />
            Admin Profile & Settings
          </button>
        </div>

        {adminSection === 'users' && (
          <>
            {/* User Summary Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-b-4 border-b-emerald-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Total Users
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{summary.totalUsers}</div>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">Registered in database</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-b-4 border-b-sky-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Admins
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <div className="text-3xl font-black text-sky-600">{summary.adminUsers}</div>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">Full platform privileges</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-b-4 border-b-green-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Active Users
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                    <UserCheck size={16} />
                  </div>
                </div>
                <div className="text-3xl font-black text-green-600">{summary.activeUsers}</div>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">Normal access granted</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-b-4 border-b-red-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Paused Users
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <UserX size={16} />
                  </div>
                </div>
                <div className="text-3xl font-black text-red-600">{summary.pausedUsers}</div>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">Suspended accounts</span>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setFilterRole('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterRole === 'all'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  onClick={() => setFilterRole('admin')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterRole === 'admin'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Admins ({summary.adminUsers})
                </button>
                <button
                  onClick={() => setFilterRole('user')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterRole === 'user'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Regular ({summary.regularUsers})
                </button>
                <button
                  onClick={() => setFilterRole('paused')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterRole === 'paused'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Paused ({summary.pausedUsers})
                </button>
              </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
              {loading ? (
                <div className="p-16 text-center">
                  <RefreshCw size={32} className="animate-spin text-emerald-600 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-sm">Loading platform users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-16 text-center">
                  <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
                  <h3 className="text-lg font-black text-slate-900 mb-1">No matching users found</h3>
                  <p className="text-slate-400 text-xs">Try clearing search keywords or role filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-6">User Profile</th>
                        <th className="py-4 px-6">Role</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">Joined Date</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((item) => {
                        const isSelf = item._id === currentUser?.id || item.email === currentUser?.email;
                        const isItemLoading = actionLoadingId === item._id;

                        return (
                          <tr
                            key={item._id}
                            className={`hover:bg-slate-50/60 transition-colors ${
                              isSelf ? 'bg-emerald-50/20' : ''
                            }`}
                          >
                            {/* User Profile */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-sm">
                                  {item.fullName ? item.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                    {item.fullName}
                                    {isSelf && (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-400 font-medium">{item.email}</div>
                                </div>
                              </div>
                            </td>

                            {/* Role Badge */}
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                  item.role === 'admin'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {item.role === 'admin' ? (
                                  <ShieldCheck size={14} className="text-emerald-600" />
                                ) : (
                                  <Users size={14} className="text-slate-400" />
                                )}
                                {item.role}
                              </span>
                            </td>

                            {/* Account Status Badge */}
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                  item.isPaused
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-green-50 text-green-700 border border-green-200'
                                }`}
                              >
                                {item.isPaused ? (
                                  <PauseCircle size={14} className="text-red-500" />
                                ) : (
                                  <UserCheck size={14} className="text-green-600" />
                                )}
                                {item.isPaused ? 'Paused' : 'Active'}
                              </span>
                            </td>

                            {/* Joined Date */}
                            <td className="py-4 px-6 text-xs text-slate-400 font-medium">
                              {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              {isItemLoading ? (
                                <span className="text-xs font-bold text-slate-400 animate-pulse">Updating...</span>
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  {/* Change Role Button */}
                                  <button
                                    onClick={() => handleToggleRole(item)}
                                    disabled={isSelf}
                                    title={
                                      isSelf
                                        ? 'You cannot change your own role'
                                        : item.role === 'admin'
                                        ? 'Change role to User'
                                        : 'Upgrade to Admin'
                                    }
                                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                                      isSelf
                                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                                        : item.role === 'admin'
                                        ? 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                    }`}
                                  >
                                    <Shield size={13} />
                                    {item.role === 'admin' ? 'Make User' : 'Make Admin'}
                                  </button>

                                  {/* Pause / Resume Button */}
                                  <button
                                    onClick={() => handleTogglePause(item)}
                                    disabled={isSelf}
                                    title={isSelf ? 'You cannot pause your own account' : ''}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                                      isSelf
                                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                                        : item.isPaused
                                        ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                    }`}
                                  >
                                    {item.isPaused ? <PlayCircle size={13} /> : <PauseCircle size={13} />}
                                    {item.isPaused ? 'Resume' : 'Pause'}
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    onClick={() => handleDeleteUser(item)}
                                    disabled={isSelf}
                                    title={isSelf ? 'You cannot delete your own account' : 'Delete user permanently'}
                                    className={`p-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all ${
                                      isSelf ? 'opacity-40 cursor-not-allowed text-slate-400' : ''
                                    }`}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {adminSection === 'policies' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <FileText className="text-emerald-600" size={24} />
                  Terms of Service & Privacy Policy Editor
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Changes saved here immediately update the policy text across Registration, Google Sign-In, and Sign-Up screens.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPolicyPreviewModal(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
                >
                  <Eye size={15} />
                  Preview Modal
                </button>
                <button
                  type="button"
                  onClick={handleResetPolicyTemplate}
                  className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs flex items-center gap-2 transition-all border border-amber-200"
                >
                  <RotateCcw size={15} />
                  Reset Template
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Policy Title
                </label>
                <input
                  type="text"
                  value={policyTitle}
                  onChange={(e) => setPolicyTitle(e.target.value)}
                  placeholder="e.g. Terms of Service & Privacy Policy"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 py-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="require-acceptance"
                  checked={policyRequireAcceptance}
                  onChange={(e) => setPolicyRequireAcceptance(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="require-acceptance" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Require user acceptance checkbox before completing Registration or Google Sign-In
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Policy Content & Declarations
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {policyContent.length} characters
                  </span>
                </div>
                <textarea
                  value={policyContent}
                  onChange={(e) => setPolicyContent(e.target.value)}
                  rows={16}
                  placeholder="Write terms, privacy statements, user agreement clauses, and disclaimers here..."
                  className="w-full p-4 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-400">
                  {policyLastUpdated && (
                    <span>Last updated on {new Date(policyLastUpdated).toLocaleString()} by {policyUpdatedBy}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSavePolicy}
                  disabled={policySaving}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {policySaving ? 'Saving Policy...' : 'Save & Publish Policy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {adminSection === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Settings className="text-emerald-600" size={24} />
                Admin Profile & Platform Settings
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Update your administrative profile name and contact telephone number.
              </p>
            </div>

            <form onSubmit={handleSaveAdminProfile} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    placeholder="Admin Full Name"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Telephone Number
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={adminSaving}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {adminSaving ? 'Saving Profile...' : 'Save Admin Profile'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Policy Preview Modal */}
      {showPolicyPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-900">{policyTitle || 'Terms of Service & Privacy Policy'}</h3>
                <span className="text-xs text-slate-400">Preview of live user policy modal</span>
              </div>
              <button
                onClick={() => setShowPolicyPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed font-sans">
              {policyContent || 'No policy content provided.'}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowPolicyPreviewModal(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
