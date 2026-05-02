'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Calendar,
    MapPin,
    Clock,
    Users,
    Edit2,
    Trash2,
    Search,
    X,
    GraduationCap,
    Code,
    Music,
    Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/services/event.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
    { value: 'conference', label: 'Konferans', icon: GraduationCap },
    { value: 'workshop', label: 'Workshop', icon: Code },
    { value: 'social', label: 'Sosyal', icon: Music },
    { value: 'sports', label: 'Spor', icon: Trophy }
];

const initialEventForm = {
    title: '',
    description: '',
    category: 'conference',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    capacity: 50,
    isPaid: false,
    price: 0
};

export default function AdminEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState(initialEventForm);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {
        try {
            setLoading(true);
            const response = await getEvents({});
            let eventsData = [];
            if (Array.isArray(response)) {
                eventsData = response;
            } else if (response?.data) {
                eventsData = Array.isArray(response.data) ? response.data : (response.data?.items || []);
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

    function handleNewEvent() {
        setEditingEvent(null);
        setFormData(initialEventForm);
        setShowForm(true);
    }

    function handleEditEvent(event) {
        setEditingEvent(event);
        setFormData({
            title: event.title || '',
            description: event.description || '',
            category: event.category || 'conference',
            startDate: event.startDate ? event.startDate.split('T')[0] : '',
            startTime: event.startTime || '',
            endDate: event.endDate ? event.endDate.split('T')[0] : '',
            endTime: event.endTime || '',
            location: event.location || '',
            capacity: event.capacity || 50,
            isPaid: event.isPaid || false,
            price: event.price || 0
        });
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.title || !formData.startDate || !formData.endDate || !formData.location) {
            toast.error('Lütfen zorunlu alanları doldurun (Başlık, Başlangıç Tarihi, Bitiş Tarihi, Konum)');
            return;
        }

        try {
            setSubmitting(true);

            // Backend formatına dönüştür
            const startDateTime = formData.startTime
                ? `${formData.startDate}T${formData.startTime}:00`
                : `${formData.startDate}T09:00:00`;
            const endDateTime = formData.endTime
                ? `${formData.endDate}T${formData.endTime}:00`
                : `${formData.endDate}T18:00:00`;

            // Kategori ID'sini belirle
            const categoryMap = { conference: 1, workshop: 2, social: 3, sports: 4 };

            const eventData = {
                title: formData.title,
                description: formData.description,
                categoryId: categoryMap[formData.category] || 1,
                startDate: startDateTime,
                endDate: endDateTime,
                location: formData.location,
                capacity: formData.capacity,
                price: formData.isPaid ? formData.price : 0
            };

            if (editingEvent) {
                await updateEvent(editingEvent.id, eventData);
                toast.success('Etkinlik güncellendi');
            } else {
                await createEvent(eventData);
                toast.success('Etkinlik oluşturuldu');
            }

            setShowForm(false);
            loadEvents();
        } catch (error) {
            toast.error(error.message || 'İşlem başarısız');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDeleteEvent(eventId) {
        if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            await deleteEvent(eventId);
            toast.success('Etkinlik silindi');
            loadEvents();
        } catch (error) {
            toast.error(error.message || 'Silme işlemi başarısız');
        }
    }

    function getCategoryColor(category) {
        const colors = {
            conference: 'bg-blue-100 text-blue-700',
            workshop: 'bg-purple-100 text-purple-700',
            social: 'bg-pink-100 text-pink-700',
            sports: 'bg-green-100 text-green-700'
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    }

    function getCategoryLabel(category) {
        const cat = categories.find(c => c.value === category);
        return cat?.label || category;
    }

    const filteredEvents = events.filter(event =>
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Etkinlik Yönetimi</h1>
                        <p className="text-white/90 mt-2">
                            Etkinlikleri oluşturun, düzenleyin ve yönetin
                        </p>
                    </div>
                    <Button
                        onClick={handleNewEvent}
                        className="bg-white text-purple-600 hover:bg-white/90"
                    >
                        <Plus className="size-4 mr-2" />
                        Yeni Etkinlik
                    </Button>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -right-20 w-60 h-60 rounded-full bg-white/5" />
            </motion.div>

            {/* Form Panel */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-xl border p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">
                            {editingEvent ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Oluştur'}
                        </h2>
                        <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-lg">
                            <X className="size-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">Etkinlik Adı *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Etkinlik adını girin"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-1">Kategori</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-10 px-3 rounded-md border bg-background"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium block mb-1">Açıklama</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Etkinlik açıklaması"
                                className="w-full min-h-[80px] px-3 py-2 rounded-md border bg-background"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">Başlangıç Tarihi *</label>
                                <Input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Başlangıç Saati</label>
                                <Input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Bitiş Tarihi *</label>
                                <Input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Bitiş Saati</label>
                                <Input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">Konum *</label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Konum"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Kapasite</label>
                                <Input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 50 })}
                                    min={1}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isPaid}
                                    onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                                    className="rounded"
                                />
                                <span className="text-sm font-medium">Ücretli etkinlik</span>
                            </label>

                            {formData.isPaid && (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        min={0}
                                        step={0.01}
                                        className="w-32"
                                        placeholder="Ücret"
                                    />
                                    <span className="text-sm">₺</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                İptal
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Kaydediliyor...' : (editingEvent ? 'Güncelle' : 'Oluştur')}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Search */}
            {!showForm && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Etkinlik ara..."
                        className="pl-10"
                    />
                </div>
            )}

            {/* Events Table/List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-white dark:bg-slate-800/50 border">
                    <Calendar className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Etkinlik bulunamadı</h3>
                    <p className="text-muted-foreground mb-4">
                        Henüz etkinlik oluşturulmamış
                    </p>
                    <Button onClick={handleNewEvent}>
                        <Plus className="size-4 mr-2" />
                        İlk Etkinliği Oluştur
                    </Button>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium">Etkinlik</th>
                                    <th className="text-left p-4 font-medium">Kategori</th>
                                    <th className="text-left p-4 font-medium">Tarih</th>
                                    <th className="text-left p-4 font-medium">Konum</th>
                                    <th className="text-left p-4 font-medium">Kapasite</th>
                                    <th className="text-right p-4 font-medium">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.map((event, index) => (
                                    <motion.tr
                                        key={event.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-t hover:bg-muted/30"
                                    >
                                        <td className="p-4">
                                            <div className="font-medium">{event.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {event.description}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                                {getCategoryLabel(event.category)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="size-4 text-muted-foreground" />
                                                {new Date(event.date).toLocaleDateString('tr-TR')}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="size-4" />
                                                {event.startTime} - {event.endTime}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="size-4 text-muted-foreground" />
                                                {event.location}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="size-4 text-muted-foreground" />
                                                {event.registeredCount || 0} / {event.capacity}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditEvent(event)}
                                                >
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
