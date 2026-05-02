'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, UtensilsCrossed, Clock, Leaf, Wheat, Flame, Apple, X, CheckCircle2, Soup, ChefHat, Salad, Cake, ArrowRight } from 'lucide-react';
import { getMenus, createReservation } from '@/services/meal.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * Meal Menu Page
 * Takvim görünümü ile menü seçimi ve rezervasyon
 */
export default function MealMenuPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [reserving, setReserving] = useState(false);

    useEffect(() => {
        loadMenus();
    }, [selectedDate]);

    async function loadMenus() {
        try {
            setLoading(true);
            const dateStr = selectedDate.toISOString().split('T')[0];
            const response = await getMenus({ date: dateStr });
            setMenus(response.data || []);
        } catch (error) {
            toast.error('Menüler yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleReserve(menu) {
        setSelectedMeal(menu);
    }

    async function confirmReservation() {
        if (!selectedMeal) return;

        try {
            setReserving(true);
            await createReservation({
                MenuId: selectedMeal.id,
                CafeteriaId: selectedMeal.cafeteriaId,
                MealType: selectedMeal.mealType,
                Date: selectedDate.toISOString().split('T')[0]
            });
            toast.success('Rezervasyon başarıyla oluşturuldu!');
            setSelectedMeal(null);
            loadMenus();
        } catch (error) {
            toast.error(error.message || 'Rezervasyon yapılamadı');
        } finally {
            setReserving(false);
        }
    }

    // Takvim için tarih seçimi
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
    });

    // Backend MealType enum: 1=Breakfast, 2=Lunch, 3=Dinner
    const breakfastMenus = menus.filter(m => m.mealType === 1 || m.mealType === 'Breakfast');
    const lunchMenus = menus.filter(m => m.mealType === 2 || m.mealType === 'Lunch' || m.mealType === 'lunch');
    const dinnerMenus = menus.filter(m => m.mealType === 3 || m.mealType === 'Dinner' || m.mealType === 'dinner');

    return (
        <div className="space-y-6">
            {/* Header and Calendar Selector with Background Image */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-xl overflow-hidden bg-white/80 dark:bg-slate-800/70 border border-border"
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-contain bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1600&h=250&fit=crop)',
                        opacity: 0.4,
                        filter: 'brightness(1.15) saturate(1.2) contrast(1.1)',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center top'
                    }}
                />

                {/* Header */}
                <div className="relative p-6 pb-4">
                    <h1 className="text-2xl lg:text-3xl font-bold">Yemek Menüsü</h1>
                </div>

                {/* Calendar Selector - Day Card View */}
                <div className="relative p-4 pt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {dates.map((date, index) => {
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            const isToday = date.toDateString() === today.toDateString();
                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => setSelectedDate(date)}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                    rounded-xl border-2 transition-all p-3 text-center
                                    ${isSelected
                                            ? 'border-blue-500 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/40'
                                            : 'border-border hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 bg-white dark:bg-slate-800'
                                        }
                                    ${isToday && !isSelected ? 'ring-2 ring-blue-500/30 bg-blue-50/50 dark:bg-blue-950/10' : ''}
                                `}
                                >
                                    <div className={`text-xs font-medium mb-1 ${isSelected ? 'text-white/90' : 'text-muted-foreground'}`}>
                                        {date.toLocaleDateString('tr-TR', { weekday: 'long' })}
                                    </div>
                                    <div className={`text-2xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-foreground'}`}>
                                        {date.getDate()}
                                    </div>
                                    <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                                        {date.toLocaleDateString('tr-TR', { month: 'long' })}
                                    </div>
                                    {isToday && (
                                        <div className={`mt-1 text-[10px] font-medium ${isSelected ? 'text-white/90' : 'text-blue-600 dark:text-blue-400'}`}>
                                            Bugün
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* Menus */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lunch Menu */}
                    <MealCard
                        type="lunch"
                        menus={lunchMenus}
                        onReserve={handleReserve}
                        date={selectedDate}
                    />

                    {/* Dinner Menu */}
                    <MealCard
                        type="dinner"
                        menus={dinnerMenus}
                        onReserve={handleReserve}
                        date={selectedDate}
                    />
                </div>
            )}

            {/* Reservation Modal */}
            <AnimatePresence>
                {selectedMeal && (
                    <ReservationModal
                        meal={selectedMeal}
                        date={selectedDate}
                        onClose={() => setSelectedMeal(null)}
                        onConfirm={confirmReservation}
                        loading={reserving}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Meal Card Component
 */
function MealCard({ type, menus, onReserve, date }) {
    const menu = menus[0];
    const isLunch = type === 'lunch';
    const isBreakfast = type === 'breakfast';

    if (!menu) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${isLunch ? 'bg-blue-100 dark:bg-blue-900/30' : isBreakfast ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
                        <UtensilsCrossed className={`size-5 ${isLunch ? 'text-blue-600 dark:text-blue-400' : isBreakfast ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
                    </div>
                    <h2 className="text-lg font-semibold">
                        {isBreakfast ? 'Kahvaltı' : isLunch ? 'Öğle Yemeği' : 'Akşam Yemeği'}
                    </h2>
                </div>
                <p className="text-muted-foreground text-center py-8">
                    Bu tarih için menü bulunmuyor
                </p>
            </motion.div>
        );
    }

    // Backend'den gelen foodItems array'i veya items string'i
    let items = [];
    if (menu.foodItems && Array.isArray(menu.foodItems)) {
        items = menu.foodItems.map(fi => fi.name || fi);
    } else if (menu.items) {
        items = typeof menu.items === 'string' ? JSON.parse(menu.items) : menu.items;
    }

    const nutrition = typeof menu.nutrition === 'string' ? JSON.parse(menu.nutrition) : menu.nutrition;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className={`
                rounded-xl border-2 overflow-hidden
                bg-gradient-to-br from-white to-slate-50
                dark:from-slate-800/50 dark:to-slate-900/50
                ${isLunch
                    ? 'border-blue-200 dark:border-blue-900/50 shadow-lg shadow-blue-500/10'
                    : 'border-indigo-200 dark:border-indigo-900/50 shadow-lg shadow-indigo-500/10'
                }
            `}
        >
            {/* Header */}
            <div className={`
                p-6 border-b-2
                ${isLunch
                    ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 border-blue-300 dark:border-blue-800'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 border-indigo-300 dark:border-indigo-800'
                }
            `}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UtensilsCrossed className="size-6 text-white" />
                        <h2 className="text-xl font-bold text-white">
                            {isLunch ? 'Öğle Yemeği' : 'Akşam Yemeği'}
                        </h2>
                    </div>
                    <Clock className="size-5 text-white/80" />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Items */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">Menü İçeriği</h3>
                    <ul className="space-y-2">
                        {items.map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 text-sm"
                            >
                                <CheckCircle2 className="size-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                <span className="flex-1">{item}</span>
                                {item.toLowerCase().includes('vegan') && (
                                    <Leaf className="size-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                )}
                                {item.toLowerCase().includes('vejetaryen') && (
                                    <Wheat className="size-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                )}
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {/* Nutrition Info */}
                {nutrition && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-3 gap-3 pt-4 border-t border-border"
                    >
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                            <Flame className="size-5 mx-auto mb-1 text-orange-500" />
                            <div className="text-xs text-muted-foreground">Kalori</div>
                            <div className="font-bold">{nutrition.calories || 'N/A'}</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                            <Apple className="size-5 mx-auto mb-1 text-green-500" />
                            <div className="text-xs text-muted-foreground">Protein</div>
                            <div className="font-bold">{nutrition.protein || 'N/A'}g</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                            <div className="size-5 mx-auto mb-1 rounded-full bg-blue-500" />
                            <div className="text-xs text-muted-foreground">Karbonhidrat</div>
                            <div className="font-bold">{nutrition.carbs || 'N/A'}g</div>
                        </div>
                    </motion.div>
                )}

                {/* Reserve Button */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        onClick={() => onReserve(menu)}
                        className={`
                            w-full h-11 font-medium
                            ${isLunch
                                ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                            }
                        `}
                    >
                        Rezervasyon Yap
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}

/**
 * Reservation Modal Component
 */
function ReservationModal({ meal, date, onClose, onConfirm, loading }) {
    // Backend'den gelen foodItems array'i veya items string'i
    let items = [];
    if (meal.foodItems && Array.isArray(meal.foodItems)) {
        items = meal.foodItems.map(fi => fi.name || fi);
    } else if (meal.items) {
        items = typeof meal.items === 'string' ? JSON.parse(meal.items) : meal.items;
    }

    // Backend MealType enum: 1=Breakfast, 2=Lunch, 3=Dinner
    const isLunch = meal.mealType === 2 || meal.mealType === 'Lunch' || meal.mealType === 'lunch';

    // Menü öğelerini kategorilere ayır
    const categorizeItems = (items) => {
        const categories = {
            çorba: { items: [], icon: Soup, label: 'ÇORBA' },
            ana: { items: [], icon: ChefHat, label: 'ANA YEMEK' },
            yan: { items: [], icon: Salad, label: 'YAN ÜRÜN' },
            tatlı: { items: [], icon: Cake, label: 'TATLI' },
            diğer: { items: [], icon: UtensilsCrossed, label: 'DİĞER' }
        };

        items.forEach(item => {
            const lowerItem = item.toLowerCase();
            if (lowerItem.includes('çorba')) {
                categories.çorba.items.push(item);
            } else if (lowerItem.includes('köfte') || lowerItem.includes('tavuk') || lowerItem.includes('et') || lowerItem.includes('balık') || lowerItem.includes('makarna') || lowerItem.includes('pilav') || lowerItem.includes('fasulye')) {
                categories.ana.items.push(item);
            } else if (lowerItem.includes('salata') || lowerItem.includes('turşu') || lowerItem.includes('sebze')) {
                categories.yan.items.push(item);
            } else if (lowerItem.includes('tatlı') || lowerItem.includes('meyve') || lowerItem.includes('sütlaç') || lowerItem.includes('baklava')) {
                categories.tatlı.items.push(item);
            } else {
                categories.diğer.items.push(item);
            }
        });

        return Object.values(categories).filter(cat => cat.items.length > 0);
    };

    const categorizedItems = categorizeItems(items);
    const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
    const mealTypeStr = isLunch ? 'Öğle Yemeği' : 'Akşam Yemeği';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl"
            >
                {/* Header with Image Background */}
                <div className={`relative h-36 overflow-hidden ${isLunch
                    ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
                    : 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700'
                    }`}>
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                    <div className="relative h-full flex flex-col justify-between p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Rezervasyon Onayı</h2>
                                <p className="text-white/90 text-xs">Seçimlerin harika görünüyor! İşte menü özetin:</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
                            >
                                <X className="size-4 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Date and Meal Type Badge */}
                <div className="px-4 -mt-5 mb-3 relative z-10">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isLunch
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        }`}>
                        <Calendar className="size-3" />
                        <span>{dateStr.split(',')[0]}, {dateStr.split(',')[1]} • {mealTypeStr}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 space-y-3">
                    {/* Menu Items by Category */}
                    {categorizedItems.map((category, catIndex) => {
                        const Icon = category.icon;
                        return (
                            <div key={catIndex} className="space-y-1.5">
                                <div className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide ${isLunch
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-purple-600 dark:text-purple-400'
                                    }`}>
                                    <Icon className="size-3" />
                                    <span>{category.label}</span>
                                </div>
                                <ul className="space-y-1.5">
                                    {category.items.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2 text-xs">
                                            <div className={`size-1.5 rounded-full ${isLunch
                                                ? 'bg-blue-400 dark:bg-blue-500'
                                                : 'bg-purple-400 dark:bg-purple-500'
                                                }`}></div>
                                            <span className="text-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}

                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-2 text-xs h-9"
                        disabled={loading}
                    >
                        İptal Et
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 text-white shadow-lg text-xs h-9 ${isLunch
                            ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-blue-500/30'
                            : 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 shadow-purple-500/30'
                            }`}
                    >
                        {loading ? (
                            'Rezervasyon yapılıyor...'
                        ) : (
                            <>
                                Rezervasyonu Onayla
                                <ArrowRight className="size-3 ml-1.5" />
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

