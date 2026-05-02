'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    Search,
    X,
    GraduationCap,
    Code,
    Music,
    Trophy
} from 'lucide-react';
import { getEvents } from '@/services/event.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Events Page
 * Dokümantasyona göre:
 * - List upcoming events (cards)
 * - Filter by category (conference, workshop, social, sports)
 * - Search by title
 * - Click to view details
 */
export default function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: 'Tümü', icon: Calendar },
        { value: 'conference', label: 'Konferans', icon: GraduationCap },
        { value: 'workshop', label: 'Workshop', icon: Code },
        { value: 'social', label: 'Sosyal', icon: Music },
        { value: 'sports', label: 'Spor', icon: Trophy }
    ];

    useEffect(() => {
        loadEvents();
    }, [selectedCategory, searchQuery]);

    async function loadEvents() {
        try {
            setLoading(true);
            const params = {};
            if (selectedCategory !== 'all') {
                params.category = selectedCategory;
            }
            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            const response = await getEvents(params);
            // API response formats:
            // 1. { data: { data: [...], pageNumber, totalRecords } } - PagedResponse inside Response wrapper
            // 2. { data: [...] } - Array inside Response wrapper
            // 3. [...] - Direct array
            let eventsData = [];
            if (Array.isArray(response)) {
                eventsData = response;
            } else if (response?.data) {
                // Check if it's PagedResponse (has nested data property)
                if (response.data?.data && Array.isArray(response.data.data)) {
                    eventsData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    eventsData = response.data;
                } else if (response.data?.items) {
                    eventsData = response.data.items;
                }
            }
            setEvents(eventsData);
        } catch (error) {
            toast.error('Etkinlikler yüklenemedi');
            console.error(error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }

    function handleEventClick(eventId) {
        router.push(`/events/${eventId}`);
    }

    function getCategoryColor(category) {
        const colors = {
            conference: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
            workshop: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
            social: 'bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400',
            sports: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
        };
        return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400';
    }

    function getCategoryCardBg(category) {
        const backgrounds = {
            conference: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800',
            workshop: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800',
            social: 'bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-pink-900/10 border-pink-200 dark:border-pink-800',
            sports: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800'
        };
        return backgrounds[category] || 'bg-white dark:bg-slate-800/50 border-border';
    }

    function getCategoryBarColor(category) {
        const colors = {
            conference: 'bg-blue-600',
            workshop: 'bg-purple-600',
            social: 'bg-pink-600',
            sports: 'bg-green-600'
        };
        return colors[category] || 'bg-purple-600';
    }

    function getCategoryLabel(category) {
        const labels = {
            conference: 'Konferans',
            workshop: 'Workshop',
            social: 'Sosyal',
            sports: 'Spor'
        };
        return labels[category] || category;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <h1 className="text-2xl lg:text-3xl font-bold">Etkinlikler</h1>
                    <p className="text-white/90 mt-2">
                        Yaklaşan etkinlikleri görüntüleyin ve kayıt olun
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -right-20 w-60 h-60 rounded-full bg-white/5" />
            </motion.div>

            {/* Filters and Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Etkinlik adı ile ara..."
                        className="pl-10"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <X className="size-4 text-muted-foreground hover:text-foreground" />
                        </button>
                    )}
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.value;
                        return (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isSelected
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                <Icon className="size-4" />
                                {category.label}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Events Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <Calendar className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Etkinlik bulunamadı</h3>
                    <p className="text-muted-foreground">
                        {searchQuery || selectedCategory !== 'all'
                            ? 'Arama kriterlerinize uygun etkinlik bulunamadı'
                            : 'Henüz etkinlik bulunmamaktadır'}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleEventClick(event.id)}
                            className={`group cursor-pointer rounded-xl border p-6 hover:shadow-lg transition-all ${getCategoryCardBg(event.category)}`}
                        >
                            {/* Category Badge */}
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                    {getCategoryLabel(event.category)}
                                </span>
                                {event.isPaid && (
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400">
                                        {event.price} ₺
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                                {event.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {event.description}
                            </p>

                            {/* Event Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="size-4" />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="size-4" />
                                    <span>{event.startTime} - {event.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="size-4" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="size-4" />
                                    <span>{event.registeredCount} / {event.capacity} kayıtlı</span>
                                </div>
                            </div>

                            {/* Capacity Bar */}
                            <div className="w-full bg-muted rounded-full h-2 mb-2">
                                <div
                                    className={`${getCategoryBarColor(event.category)} h-2 rounded-full transition-all`}
                                    style={{
                                        width: `${(event.registeredCount / event.capacity) * 100}%`
                                    }}
                                />
                            </div>

                            {/* View Details Hint */}
                            <div className={`text-sm font-medium mt-4 group-hover:underline ${event.category === 'conference' ? 'text-blue-600 dark:text-blue-400' :
                                event.category === 'workshop' ? 'text-purple-600 dark:text-purple-400' :
                                    event.category === 'social' ? 'text-pink-600 dark:text-pink-400' :
                                        event.category === 'sports' ? 'text-green-600 dark:text-green-400' :
                                            'text-purple-600 dark:text-purple-400'
                                }`}>
                                Detayları Gör →
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

