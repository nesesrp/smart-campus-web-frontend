'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UtensilsCrossed, Building2, Plus, Trash2, Edit, CheckCircle,
    Loader2, AlertCircle, X, Save, Eye, EyeOff, Soup, Beef,
    Salad, Coffee, Cake, Pizza
} from 'lucide-react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    getCafeterias, createCafeteria, deleteCafeteria,
    getFoodItems, createFoodItem, deleteFoodItem,
    getMenus, createMenu, publishMenu, unpublishMenu, deleteMenu,
    MealType, MealTypeLabels, MealItemCategory, MealItemCategoryLabels
} from '@/services/admin-meal.service';

// ============ TAB COMPONENT ============
function TabButton({ active, onClick, icon: Icon, label, count }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${active
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
        >
            <Icon className="size-5" />
            <span>{label}</span>
            {count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );
}

// ============ CAFETERIA TAB ============
function CafeteriasTab() {
    const [cafeterias, setCafeterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ Name: '', Location: '', Capacity: 100, IsActive: true });

    useEffect(() => {
        loadCafeterias();
    }, []);

    async function loadCafeterias() {
        try {
            setLoading(true);
            const response = await getCafeterias(true);
            setCafeterias(response.data || []);
        } catch (error) {
            toast.error('Yemekhaneler yüklenemedi');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        try {
            setCreating(true);
            await createCafeteria(formData);
            toast.success('Yemekhane oluşturuldu');
            setShowForm(false);
            setFormData({ Name: '', Location: '', Capacity: 100, IsActive: true });
            loadCafeterias();
        } catch (error) {
            toast.error(error.message || 'Yemekhane oluşturulamadı');
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Bu yemekhaneyi silmek istediğinize emin misiniz?')) return;
        try {
            await deleteCafeteria(id);
            toast.success('Yemekhane silindi');
            loadCafeterias();
        } catch (error) {
            toast.error(error.message || 'Yemekhane silinemedi');
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Yemekhaneler ({cafeterias.length})</h3>
                <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'default'}>
                    {showForm ? <X className="size-4 mr-2" /> : <Plus className="size-4 mr-2" />}
                    {showForm ? 'İptal' : 'Yeni Yemekhane'}
                </Button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleCreate}
                        className="p-4 border border-border rounded-lg bg-muted/30 space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Yemekhane Adı *</label>
                                <Input
                                    value={formData.Name}
                                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                    placeholder="Merkez Yemekhane"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Konum</label>
                                <Input
                                    value={formData.Location}
                                    onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                                    placeholder="Ana Bina, Zemin Kat"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Kapasite</label>
                                <Input
                                    type="number"
                                    value={formData.Capacity}
                                    onChange={(e) => setFormData({ ...formData, Capacity: parseInt(e.target.value) })}
                                    min={1}
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={creating}>
                            {creating ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
                            Kaydet
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>

            {cafeterias.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="size-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz yemekhane eklenmemiş</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cafeterias.map((cafeteria) => (
                        <div
                            key={cafeteria.id}
                            className="p-4 border border-border rounded-lg bg-white dark:bg-slate-800/50 flex items-start justify-between"
                        >
                            <div>
                                <h4 className="font-semibold">{cafeteria.name}</h4>
                                <p className="text-sm text-muted-foreground">{cafeteria.location || 'Konum belirtilmemiş'}</p>
                                <p className="text-sm text-muted-foreground">Kapasite: {cafeteria.capacity || '-'}</p>
                                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${cafeteria.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {cafeteria.isActive ? 'Aktif' : 'Pasif'}
                                </span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(cafeteria.id)}>
                                <Trash2 className="size-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============ FOOD ITEMS TAB ============
function FoodItemsTab() {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ Name: '', Description: '', Category: 2, Calories: null });

    useEffect(() => {
        loadFoodItems();
    }, []);

    async function loadFoodItems() {
        try {
            setLoading(true);
            const response = await getFoodItems(true);
            setFoodItems(response.data || []);
        } catch (error) {
            toast.error('Yemek içerikleri yüklenemedi');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        try {
            setCreating(true);
            await createFoodItem({
                ...formData,
                Category: parseInt(formData.Category),
                Calories: formData.Calories ? parseInt(formData.Calories) : null
            });
            toast.success('Yemek içeriği oluşturuldu');
            setShowForm(false);
            setFormData({ Name: '', Description: '', Category: 2, Calories: null });
            loadFoodItems();
        } catch (error) {
            toast.error(error.message || 'Yemek içeriği oluşturulamadı');
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Bu yemek içeriğini silmek istediğinize emin misiniz?')) return;
        try {
            await deleteFoodItem(id);
            toast.success('Yemek içeriği silindi');
            loadFoodItems();
        } catch (error) {
            toast.error(error.message || 'Yemek içeriği silinemedi');
        }
    }

    const getCategoryIcon = (category) => {
        const icons = {
            1: Soup, 2: Beef, 3: Pizza, 4: Salad, 5: Coffee, 6: Cake, 7: Pizza
        };
        const Icon = icons[category] || UtensilsCrossed;
        return <Icon className="size-4" />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Yemek İçerikleri ({foodItems.length})</h3>
                <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'default'}>
                    {showForm ? <X className="size-4 mr-2" /> : <Plus className="size-4 mr-2" />}
                    {showForm ? 'İptal' : 'Yeni Yemek'}
                </Button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleCreate}
                        className="p-4 border border-border rounded-lg bg-muted/30 space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Yemek Adı *</label>
                                <Input
                                    value={formData.Name}
                                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                    placeholder="Mercimek Çorbası"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Kategori *</label>
                                <select
                                    value={formData.Category}
                                    onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {Object.entries(MealItemCategoryLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Açıklama</label>
                                <Input
                                    value={formData.Description}
                                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                                    placeholder="Geleneksel Türk mutfağından..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Kalori (opsiyonel)</label>
                                <Input
                                    type="number"
                                    value={formData.Calories || ''}
                                    onChange={(e) => setFormData({ ...formData, Calories: e.target.value })}
                                    placeholder="150"
                                    min={0}
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={creating}>
                            {creating ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
                            Kaydet
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>

            {foodItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <UtensilsCrossed className="size-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz yemek içeriği eklenmemiş</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {foodItems.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 border border-border rounded-lg bg-white dark:bg-slate-800/50"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    {getCategoryIcon(item.category)}
                                    <h4 className="font-semibold">{item.name}</h4>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="size-4 text-red-500" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.description || '-'}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                                    {MealItemCategoryLabels[item.category] || 'Diğer'}
                                </span>
                                {item.calories && (
                                    <span className="text-xs text-muted-foreground">{item.calories} kcal</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============ MENUS TAB ============
function MenusTab() {
    const [menus, setMenus] = useState([]);
    const [cafeterias, setCafeterias] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        CafeteriaId: '',
        Date: new Date().toISOString().split('T')[0],
        MealType: 2,
        Price: 25,
        IsPublished: false,
        FoodItemIds: []
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [menusRes, cafeteriasRes, foodItemsRes] = await Promise.all([
                getMenus(),
                getCafeterias(),
                getFoodItems()
            ]);
            setMenus(menusRes.data || []);
            setCafeterias(cafeteriasRes.data || []);
            setFoodItems(foodItemsRes.data || []);

            // İlk yemekhaneyi seç
            if (cafeteriasRes.data?.length > 0) {
                setFormData(prev => ({ ...prev, CafeteriaId: cafeteriasRes.data[0].id }));
            }
        } catch (error) {
            toast.error('Veriler yüklenemedi');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (formData.FoodItemIds.length === 0) {
            toast.error('En az bir yemek seçmelisiniz');
            return;
        }
        try {
            setCreating(true);
            await createMenu({
                ...formData,
                CafeteriaId: parseInt(formData.CafeteriaId),
                MealType: parseInt(formData.MealType),
                Price: parseFloat(formData.Price)
            });
            toast.success('Menü oluşturuldu');
            setShowForm(false);
            setFormData({
                CafeteriaId: cafeterias[0]?.id || '',
                Date: new Date().toISOString().split('T')[0],
                MealType: 2,
                Price: 25,
                IsPublished: false,
                FoodItemIds: []
            });
            loadData();
        } catch (error) {
            toast.error(error.message || 'Menü oluşturulamadı');
        } finally {
            setCreating(false);
        }
    }

    async function handlePublish(id) {
        try {
            await publishMenu(id);
            toast.success('Menü yayınlandı');
            loadData();
        } catch (error) {
            toast.error(error.message || 'Menü yayınlanamadı');
        }
    }

    async function handleUnpublish(id) {
        try {
            await unpublishMenu(id);
            toast.success('Menü yayından kaldırıldı');
            loadData();
        } catch (error) {
            toast.error(error.message || 'Menü yayından kaldırılamadı');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Bu menüyü silmek istediğinize emin misiniz?')) return;
        try {
            await deleteMenu(id);
            toast.success('Menü silindi');
            loadData();
        } catch (error) {
            toast.error(error.message || 'Menü silinemedi');
        }
    }

    function toggleFoodItem(itemId) {
        setFormData(prev => ({
            ...prev,
            FoodItemIds: prev.FoodItemIds.includes(itemId)
                ? prev.FoodItemIds.filter(id => id !== itemId)
                : [...prev.FoodItemIds, itemId]
        }));
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Menüler ({menus.length})</h3>
                <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'default'}>
                    {showForm ? <X className="size-4 mr-2" /> : <Plus className="size-4 mr-2" />}
                    {showForm ? 'İptal' : 'Yeni Menü'}
                </Button>
            </div>

            {cafeterias.length === 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                        ⚠️ Menü oluşturmak için önce bir yemekhane eklemelisiniz.
                    </p>
                </div>
            )}

            {foodItems.length === 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                        ⚠️ Menü oluşturmak için önce yemek içerikleri eklemelisiniz.
                    </p>
                </div>
            )}

            <AnimatePresence>
                {showForm && cafeterias.length > 0 && foodItems.length > 0 && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleCreate}
                        className="p-4 border border-border rounded-lg bg-muted/30 space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Yemekhane *</label>
                                <select
                                    value={formData.CafeteriaId}
                                    onChange={(e) => setFormData({ ...formData, CafeteriaId: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                >
                                    {cafeterias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tarih *</label>
                                <Input
                                    type="date"
                                    value={formData.Date}
                                    onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Öğün *</label>
                                <select
                                    value={formData.MealType}
                                    onChange={(e) => setFormData({ ...formData, MealType: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {Object.entries(MealTypeLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Fiyat (₺) *</label>
                                <Input
                                    type="number"
                                    value={formData.Price}
                                    onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                                    min={0}
                                    step={0.01}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Yemekler ({formData.FoodItemIds.length} seçili) *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-border rounded-lg">
                                {foodItems.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleFoodItem(item.id)}
                                        className={`p-2 rounded text-left text-sm transition-all ${formData.FoodItemIds.includes(item.id)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                            }`}
                                    >
                                        <div className="flex items-center gap-1">
                                            {formData.FoodItemIds.includes(item.id) && (
                                                <CheckCircle className="size-3" />
                                            )}
                                            <span className="truncate">{item.name}</span>
                                        </div>
                                        <span className="text-xs opacity-70">
                                            {MealItemCategoryLabels[item.category]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPublished"
                                checked={formData.IsPublished}
                                onChange={(e) => setFormData({ ...formData, IsPublished: e.target.checked })}
                                className="size-4"
                            />
                            <label htmlFor="isPublished" className="text-sm">Hemen yayınla</label>
                        </div>

                        <Button type="submit" disabled={creating}>
                            {creating ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
                            Menüyü Kaydet
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>

            {menus.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <UtensilsCrossed className="size-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz menü oluşturulmamış</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            className="p-4 border border-border rounded-lg bg-white dark:bg-slate-800/50"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold">
                                            {new Date(menu.date).toLocaleDateString('tr-TR')} - {MealTypeLabels[menu.mealType]}
                                        </h4>
                                        <span className={`px-2 py-0.5 rounded text-xs ${menu.isPublished
                                                ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                            }`}>
                                            {menu.isPublished ? 'Yayında' : 'Taslak'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {menu.cafeteriaName || 'Yemekhane'} • ₺{menu.price}
                                    </p>
                                    {menu.foodItems?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {menu.foodItems.map((item, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-muted rounded text-xs">
                                                    {item.name || item}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => menu.isPublished ? handleUnpublish(menu.id) : handlePublish(menu.id)}
                                    >
                                        {menu.isPublished ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(menu.id)}>
                                        <Trash2 className="size-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============ MAIN PAGE ============
function AdminMealsPage() {
    const [activeTab, setActiveTab] = useState('cafeterias');

    return (
        <ProtectedRoute requiredRoles={['Admin']}>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                        <UtensilsCrossed className="size-8 text-primary" />
                        Yemek Yönetimi
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Yemekhane, menü ve yemek içeriklerini bu sayfadan yönetebilirsiniz.
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
                >
                    <div className="flex border-b border-border overflow-x-auto">
                        <TabButton
                            active={activeTab === 'cafeterias'}
                            onClick={() => setActiveTab('cafeterias')}
                            icon={Building2}
                            label="Yemekhaneler"
                        />
                        <TabButton
                            active={activeTab === 'fooditems'}
                            onClick={() => setActiveTab('fooditems')}
                            icon={UtensilsCrossed}
                            label="Yemek İçerikleri"
                        />
                        <TabButton
                            active={activeTab === 'menus'}
                            onClick={() => setActiveTab('menus')}
                            icon={UtensilsCrossed}
                            label="Menüler"
                        />
                    </div>

                    <div className="p-6">
                        {activeTab === 'cafeterias' && <CafeteriasTab />}
                        {activeTab === 'fooditems' && <FoodItemsTab />}
                        {activeTab === 'menus' && <MenusTab />}
                    </div>
                </motion.div>
            </div>
        </ProtectedRoute>
    );
}

export default AdminMealsPage;
