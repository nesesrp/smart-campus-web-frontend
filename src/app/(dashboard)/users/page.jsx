'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Filter,
    UserPlus,
    Edit,
    Trash2,
    Shield,
    GraduationCap,
    BookOpen,
    Loader2,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    X,
    Check
} from 'lucide-react';
import apiClient from '@/services/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

/**
 * Users Management Page
 * Admin kullanıcı yönetimi
 */
export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const pageSize = 10;

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                pageSize: pageSize.toString()
            });

            if (searchTerm) params.append('search', searchTerm);
            if (roleFilter !== 'all') params.append('role', roleFilter);

            const response = await apiClient.get(`/users?${params.toString()}`);
            const data = response.data;

            if (Array.isArray(data)) {
                setUsers(data);
                setTotalPages(Math.ceil(data.length / pageSize) || 1);
            } else if (data?.items) {
                setUsers(data.items);
                setTotalPages(data.totalPages || 1);
            } else if (data?.data) {
                setUsers(Array.isArray(data.data) ? data.data : []);
                setTotalPages(data.totalPages || 1);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Users load error:', error);
            toast.error('Kullanıcılar yüklenemedi');
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, roleFilter]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        loadUsers();
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

        try {
            await apiClient.del(`/users/${userId}`);
            toast.success('Kullanıcı silindi');
            loadUsers();
        } catch (error) {
            toast.error('Kullanıcı silinemedi');
        }
    };

    const handleOpenRoleModal = (user) => {
        setSelectedUser(user);
        setSelectedRoles(user.roles || []);
        setShowRoleModal(true);
    };

    const handleToggleRole = (role) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleSaveRoles = async () => {
        if (!selectedUser) return;

        try {
            await apiClient.post(`/users/${selectedUser.id}/roles`, selectedRoles);
            toast.success('Roller güncellendi');
            setShowRoleModal(false);
            loadUsers();
        } catch (error) {
            toast.error('Roller güncellenemedi');
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Admin': return Shield;
            case 'Faculty': return BookOpen;
            case 'Student': return GraduationCap;
            default: return Users;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'Faculty': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Student': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="size-8" />
                        <h1 className="text-2xl lg:text-3xl font-bold">Kullanıcı Yönetimi</h1>
                    </div>
                    <p className="text-white/90">Sistem kullanıcılarını yönetin</p>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center gap-4"
            >
                <form onSubmit={handleSearch} className="flex-1 min-w-[300px] flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="İsim veya e-posta ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit">Ara</Button>
                </form>

                <select
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                    <option value="all">Tüm Roller</option>
                    <option value="Admin">Admin</option>
                    <option value="Faculty">Akademisyen</option>
                    <option value="Student">Öğrenci</option>
                </select>
            </motion.div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="size-8 animate-spin mx-auto mb-4 text-violet-500" />
                        <p className="text-muted-foreground">Yükleniyor...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Kullanıcı Bulunamadı</h3>
                        <p className="text-muted-foreground">Arama kriterlerinize uygun kullanıcı yok</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Kullanıcı</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">E-posta</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rol</th>
                                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Durum</th>
                                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    const RoleIcon = getRoleIcon(user.role || user.roles?.[0]);

                                    return (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="border-t border-border hover:bg-muted/30"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                                                        {user.fullName?.charAt(0) || user.firstName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{user.fullName || `${user.firstName} ${user.lastName}`}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {user.id?.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{user.email}</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(user.roles || [user.role]).filter(Boolean).map(role => (
                                                        <span
                                                            key={role}
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(role)}`}
                                                        >
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isActive !== false
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {user.isActive !== false ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenRoleModal(user)}
                                                        title="Rol Ata"
                                                    >
                                                        <Shield className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            Sayfa {currentPage} / {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Role Assignment Modal */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Rol Ata</h3>
                            <button onClick={() => setShowRoleModal(false)} className="p-1 hover:bg-muted rounded">
                                <X className="size-5" />
                            </button>
                        </div>

                        <p className="text-muted-foreground mb-4">
                            <strong>{selectedUser.fullName || selectedUser.email}</strong> için rolleri seçin:
                        </p>

                        <div className="space-y-2 mb-6">
                            {['Admin', 'Faculty', 'Student'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => handleToggleRole(role)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedRoles.includes(role)
                                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                            : 'border-border hover:bg-muted/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const Icon = getRoleIcon(role);
                                            return <Icon className="size-5" />;
                                        })()}
                                        <span className="font-medium">{role}</span>
                                    </div>
                                    {selectedRoles.includes(role) && (
                                        <Check className="size-5 text-violet-500" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setShowRoleModal(false)}>
                                İptal
                            </Button>
                            <Button className="flex-1" onClick={handleSaveRoles}>
                                Kaydet
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
