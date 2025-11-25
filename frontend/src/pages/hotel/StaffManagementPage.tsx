import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Key,
  X,
  Loader2,
  ChefHat,
  Utensils,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { usersApi } from '../../api/usersApi';
import type { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '../../api/usersApi';

const roleIcons = {
  ADMIN: <ShieldCheck className="w-5 h-5" />,
  SERVANT: <Utensils className="w-5 h-5" />,
  KITCHEN: <ChefHat className="w-5 h-5" />,
  CASHIER: <Calculator className="w-5 h-5" />,
};

const roleLabels = {
  ADMIN: 'Admin',
  SERVANT: 'Waiter',
  KITCHEN: 'Kitchen',
  CASHIER: 'Cashier',
};

const roleColors = {
  ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
  SERVANT: 'bg-blue-100 text-blue-700 border-blue-200',
  KITCHEN: 'bg-orange-100 text-orange-700 border-orange-200',
  CASHIER: 'bg-green-100 text-green-700 border-green-200',
};

export const StaffManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    username: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
    role: 'SERVANT',
    active: true,
  });

  const [editForm, setEditForm] = useState<UpdateUserRequest>({
    fullName: '',
    phone: '',
    email: '',
    role: 'SERVANT',
    active: true,
  });

  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load staff members.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!createForm.username || !createForm.password || !createForm.fullName) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      await usersApi.createUser(createForm);
      await fetchUsers();
      setShowCreateModal(false);
      resetCreateForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create staff member.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !editForm.fullName) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      await usersApi.updateUser(selectedUser.id, editForm);
      await fetchUsers();
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update staff member.');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!selectedUser || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      await usersApi.changePassword(selectedUser.id, passwordForm);
      setShowPasswordModal(false);
      setSelectedUser(null);
      resetPasswordForm();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);
      setError(null);
      await usersApi.deleteUser(selectedUser.id);
      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete staff member.');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      setUpdating(true);
      setError(null);
      await usersApi.toggleUserStatus(user.id);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle user status.');
    } finally {
      setUpdating(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      phone: user.phone || '',
      email: user.email || '',
      role: user.role,
      active: user.active,
    });
    setShowEditModal(true);
  };

  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    resetPasswordForm();
    setShowPasswordModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const resetCreateForm = () => {
    setCreateForm({
      username: '',
      password: '',
      fullName: '',
      phone: '',
      email: '',
      role: 'SERVANT',
      active: true,
    });
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Staff Management</h1>
          <p className="text-slate-600 mt-1">Manage your restaurant staff members</p>
        </div>
        <button
          onClick={() => {
            resetCreateForm();
            setShowCreateModal(true);
          }}
          className="food-button-primary flex items-center gap-2"
          disabled={updating}
        >
          <Plus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="food-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="food-input pl-10"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="food-input"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="SERVANT">Waiter</option>
            <option value="KITCHEN">Kitchen</option>
            <option value="CASHIER">Cashier</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            className="food-card p-6 hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`food-icon-circle ${
                  roleColors[user.role as keyof typeof roleColors]
                } border-2`}
              >
                {roleIcons[user.role as keyof typeof roleIcons]}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(user)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.active
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                  disabled={updating}
                >
                  {user.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1">{user.fullName}</h3>
            <p className="text-sm text-slate-500 mb-1">@{user.username}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                roleColors[user.role as keyof typeof roleColors]
              } mb-4`}
            >
              {roleLabels[user.role as keyof typeof roleLabels]}
            </span>

            <div className="space-y-2 mb-4 text-sm">
              {user.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium">Phone:</span>
                  <span>{user.phone}</span>
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{user.email}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(user)}
                className="flex-1 food-button-secondary flex items-center justify-center gap-2 py-2"
                disabled={updating}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => openPasswordModal(user)}
                className="food-button-secondary p-2"
                disabled={updating}
                title="Change Password"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => openDeleteModal(user)}
                className="food-button-danger p-2"
                disabled={updating}
                title="Delete User"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="food-card p-12 text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No staff members found.</p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Add Staff Member</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                  disabled={updating}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="food-label">Username *</label>
                  <input
                    type="text"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    className="food-input"
                    placeholder="Enter username"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">Password *</label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="food-input"
                    placeholder="Enter password (min 6 characters)"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">Full Name *</label>
                  <input
                    type="text"
                    value={createForm.fullName}
                    onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                    className="food-input"
                    placeholder="Enter full name"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">Phone</label>
                  <input
                    type="text"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="food-input"
                    placeholder="Enter phone number"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">Email</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="food-input"
                    placeholder="Enter email address"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">Role *</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="food-input"
                    disabled={updating}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SERVANT">Waiter</option>
                    <option value="KITCHEN">Kitchen</option>
                    <option value="CASHIER">Cashier</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="createActive"
                    checked={createForm.active}
                    onChange={(e) => setCreateForm({ ...createForm, active: e.target.checked })}
                    className="rounded"
                    disabled={updating}
                  />
                  <label htmlFor="createActive" className="text-sm text-slate-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 food-button-secondary"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateUser}
                    className="flex-1 food-button-primary"
                    disabled={updating}
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Edit Staff Member</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                  disabled={updating}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="food-label">Full Name *</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="food-input"
                    placeholder="Enter full name"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="food-input"
                    placeholder="Enter phone number"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="food-input"
                    placeholder="Enter email address"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">Role *</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="food-input"
                    disabled={updating}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SERVANT">Waiter</option>
                    <option value="KITCHEN">Kitchen</option>
                    <option value="CASHIER">Cashier</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editActive"
                    checked={editForm.active}
                    onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                    className="rounded"
                    disabled={updating}
                  />
                  <label htmlFor="editActive" className="text-sm text-slate-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 food-button-secondary"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    className="flex-1 food-button-primary"
                    disabled={updating}
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Change Password</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                  disabled={updating}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                Changing password for: <strong>{selectedUser.fullName}</strong>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="food-label">Current Password *</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="food-input"
                    placeholder="Enter current password"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">New Password *</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="food-input"
                    placeholder="Enter new password (min 6 characters)"
                    disabled={updating}
                  />
                </div>

                <div>
                  <label className="food-label">Confirm New Password *</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="food-input"
                    placeholder="Confirm new password"
                    disabled={updating}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 food-button-secondary"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 food-button-primary"
                    disabled={updating}
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Change Password'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Delete Staff Member</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                  disabled={updating}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-slate-600 mb-6">
                Are you sure you want to delete <strong>{selectedUser.fullName}</strong>? This
                action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 food-button-secondary"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 food-button-danger"
                  disabled={updating}
                >
                  {updating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
