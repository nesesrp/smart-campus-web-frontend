'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, Clock, Building, Users, CheckCircle, 
    Eye, Save, Loader2, AlertCircle, X, Search
} from 'lucide-react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

/**
 * Section Selection Card
 */
function SectionCard({ section, isSelected, onToggle }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggle}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold">{section.courseCode}</h4>
                        <span className="text-sm text-muted-foreground">- {section.courseName}</span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>Şube: {section.sectionNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>Öğretim Elemanı: {section.instructorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>Kayıtlı Öğrenci: {section.enrolledStudents || 0}</span>
                        </div>
                    </div>
                </div>
                <div className={`p-2 rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {isSelected ? (
                        <CheckCircle className="size-5" />
                    ) : (
                        <div className="size-5 rounded-full border-2 border-border" />
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Schedule Preview Modal
 */
function SchedulePreviewModal({ isOpen, onClose, schedule, onSave }) {
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        try {
            setSaving(true);
            // API call burada yapılacak
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock
            toast.success('Program kaydedildi ve yayınlandı');
            onSave?.();
            onClose();
        } catch (error) {
            toast.error('Program kaydedilemedi');
        } finally {
            setSaving(false);
        }
    }

    if (!isOpen || !schedule) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Program Önizleme</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map(day => (
                            <div key={day} className="p-2 text-center font-semibold text-sm bg-muted rounded">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {schedule.items?.map((item, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-lg border border-border bg-muted/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="font-semibold">{item.courseCode} - {item.sectionNumber}</div>
                                        <div className="text-sm text-muted-foreground">{item.courseName}</div>
                                    </div>
                                    <div className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="size-4" />
                                            <span>{item.day}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="size-4" />
                                            <span>{item.startTime} - {item.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Building className="size-4" />
                                            <span>{item.classroom}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Kaydediliyor...</span>
                            </>
                        ) : (
                            <>
                                <Save className="size-4" />
                                <span>Kaydet ve Yayınla</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

/**
 * Generated Schedule Card
 */
function ScheduleCard({ schedule, onSelect, onPreview }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-border bg-white dark:bg-slate-800/50 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold mb-2">Program #{schedule.id}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="size-4" />
                            <span>Çakışma: {schedule.conflicts || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>Derslik Kullanımı: {schedule.classroomUsage || '0%'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onPreview(schedule)}
                        className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                        title="Önizle"
                    >
                        <Eye className="size-5" />
                    </button>
                </div>
            </div>
            <button
                onClick={() => onSelect(schedule)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
                Bu Programı Seç
            </button>
        </motion.div>
    );
}

/**
 * Program Oluşturma Sayfası (Admin)
 */
function GenerateSchedulePage() {
    const [semester, setSemester] = useState('Fall');
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedSections, setSelectedSections] = useState([]);
    const [sections, setSections] = useState([]);
    const [generatedSchedules, setGeneratedSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [previewSchedule, setPreviewSchedule] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        loadSections();
    }, [semester, year]);

    async function loadSections() {
        try {
            setLoading(true);
            // Mock data - API'den gelecek
            const mockSections = [
                {
                    id: 1,
                    courseCode: 'CS101',
                    courseName: 'Introduction to Computer Science',
                    sectionNumber: 'A',
                    instructorName: 'Dr. Alice Smith',
                    enrolledStudents: 45
                },
                {
                    id: 2,
                    courseCode: 'CS101',
                    courseName: 'Introduction to Computer Science',
                    sectionNumber: 'B',
                    instructorName: 'Dr. Alice Smith',
                    enrolledStudents: 38
                },
                {
                    id: 3,
                    courseCode: 'MATH201',
                    courseName: 'Calculus II',
                    sectionNumber: 'A',
                    instructorName: 'Prof. Bob Johnson',
                    enrolledStudents: 52
                },
                {
                    id: 4,
                    courseCode: 'ENG102',
                    courseName: 'English Composition',
                    sectionNumber: 'C',
                    instructorName: 'Ms. Carol White',
                    enrolledStudents: 30
                },
                {
                    id: 5,
                    courseCode: 'PHYS101',
                    courseName: 'Physics I',
                    sectionNumber: 'D',
                    instructorName: 'Dr. David Green',
                    enrolledStudents: 40
                },
                {
                    id: 6,
                    courseCode: 'HIST201',
                    courseName: 'World History',
                    sectionNumber: 'E',
                    instructorName: 'Prof. Eve Black',
                    enrolledStudents: 35
                }
            ];
            setSections(mockSections);
        } catch (error) {
            toast.error('Ders şubeleri yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function toggleSection(sectionId) {
        setSelectedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    }

    function toggleAllSections() {
        if (selectedSections.length === filteredSections.length) {
            setSelectedSections([]);
        } else {
            setSelectedSections(filteredSections.map(s => s.id));
        }
    }

    async function generateSchedules() {
        if (selectedSections.length === 0) {
            toast.error('Lütfen en az bir ders şubesi seçin');
            return;
        }

        try {
            setGenerating(true);
            // Mock API call - gerçekte algoritma çalışacak
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock generated schedules
            const mockSchedules = [
                {
                    id: 1,
                    conflicts: 0,
                    classroomUsage: '85%',
                    items: selectedSections.map((sectionId, index) => {
                        const section = sections.find(s => s.id === sectionId);
                        const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
                        const times = [
                            { start: '09:00', end: '10:30' },
                            { start: '10:00', end: '11:30' },
                            { start: '14:00', end: '15:30' }
                        ];
                        const classrooms = ['A-101', 'A-102', 'A-201', 'B-101', 'B-205'];
                        return {
                            courseCode: section?.courseCode || 'CS101',
                            sectionNumber: section?.sectionNumber || 'A',
                            courseName: section?.courseName || 'Course',
                            day: days[index % days.length],
                            startTime: times[index % times.length].start,
                            endTime: times[index % times.length].end,
                            classroom: classrooms[index % classrooms.length]
                        };
                    })
                },
                {
                    id: 2,
                    conflicts: 2,
                    classroomUsage: '78%',
                    items: selectedSections.map((sectionId, index) => {
                        const section = sections.find(s => s.id === sectionId);
                        const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
                        const times = [
                            { start: '08:00', end: '09:30' },
                            { start: '11:00', end: '12:30' },
                            { start: '13:00', end: '14:30' }
                        ];
                        const classrooms = ['A-101', 'A-102', 'A-201', 'B-101', 'B-205'];
                        return {
                            courseCode: section?.courseCode || 'CS101',
                            sectionNumber: section?.sectionNumber || 'A',
                            courseName: section?.courseName || 'Course',
                            day: days[index % days.length],
                            startTime: times[index % times.length].start,
                            endTime: times[index % times.length].end,
                            classroom: classrooms[index % classrooms.length]
                        };
                    })
                },
                {
                    id: 3,
                    conflicts: 1,
                    classroomUsage: '92%',
                    items: selectedSections.map((sectionId, index) => {
                        const section = sections.find(s => s.id === sectionId);
                        const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
                        const times = [
                            { start: '09:30', end: '11:00' },
                            { start: '11:30', end: '13:00' },
                            { start: '15:00', end: '16:30' }
                        ];
                        const classrooms = ['A-101', 'A-102', 'A-201', 'B-101', 'B-205'];
                        return {
                            courseCode: section?.courseCode || 'CS101',
                            sectionNumber: section?.sectionNumber || 'A',
                            courseName: section?.courseName || 'Course',
                            day: days[index % days.length],
                            startTime: times[index % times.length].start,
                            endTime: times[index % times.length].end,
                            classroom: classrooms[index % classrooms.length]
                        };
                    })
                }
            ];

            setGeneratedSchedules(mockSchedules);
            toast.success(`${mockSchedules.length} alternatif program oluşturuldu`);
        } catch (error) {
            toast.error('Program oluşturulamadı');
            console.error(error);
        } finally {
            setGenerating(false);
        }
    }

    function handleSelectSchedule(schedule) {
        setIsPreviewOpen(true);
        setPreviewSchedule(schedule);
    }

    function handlePreviewSchedule(schedule) {
        setIsPreviewOpen(true);
        setPreviewSchedule(schedule);
    }

    function handleSaveSchedule() {
        toast.success('Program kaydedildi ve yayınlandı');
        setGeneratedSchedules([]);
        setSelectedSections([]);
    }

    // Filtrelenmiş şubeler
    const filteredSections = sections.filter(section => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            section.courseCode.toLowerCase().includes(query) ||
            section.courseName.toLowerCase().includes(query) ||
            section.instructorName.toLowerCase().includes(query)
        );
    });

    return (
        <ProtectedRoute requiredRoles={['Admin']}>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl lg:text-3xl font-bold">Program Oluşturma</h1>
                    <p className="text-muted-foreground mt-1">
                        Dönem ve yıl seçerek ders programı oluşturun
                    </p>
                </motion.div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-800/50 rounded-xl border border-border p-6"
                >
                    <h2 className="text-xl font-bold mb-4">Dönem Bilgileri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Dönem</label>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="Fall">Güz</option>
                                <option value="Spring">Bahar</option>
                                <option value="Summer">Yaz</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Yıl</label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                min={2020}
                                max={2030}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Sections Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-800/50 rounded-xl border border-border p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">
                            Ders Şubeleri Seçimi ({selectedSections.length} seçili)
                        </h2>
                        <button
                            onClick={toggleAllSections}
                            className="text-sm text-primary hover:underline"
                        >
                            {selectedSections.length === filteredSections.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ders kodu, isim veya öğretim elemanı ile ara..."
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Sections List */}
                    {loading ? (
                        <div className="text-center py-12">
                            <Loader2 className="size-8 animate-spin mx-auto text-primary" />
                            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
                        </div>
                    ) : filteredSections.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="size-12 mx-auto text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Ders şubesi bulunamadı</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredSections.map(section => (
                                <SectionCard
                                    key={section.id}
                                    section={section}
                                    isSelected={selectedSections.includes(section.id)}
                                    onToggle={() => toggleSection(section.id)}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Generate Button */}
                {selectedSections.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center"
                    >
                        <button
                            onClick={generateSchedules}
                            disabled={generating}
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-lg font-semibold"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    <span>Program Oluşturuluyor...</span>
                                </>
                            ) : (
                                <>
                                    <Calendar className="size-5" />
                                    <span>Program Oluştur</span>
                                </>
                            )}
                        </button>
                    </motion.div>
                )}

                {/* Generated Schedules */}
                {generatedSchedules.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-bold">Oluşturulan Alternatif Programlar</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {generatedSchedules.map(schedule => (
                                <ScheduleCard
                                    key={schedule.id}
                                    schedule={schedule}
                                    onSelect={handleSelectSchedule}
                                    onPreview={handlePreviewSchedule}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Preview Modal */}
                <SchedulePreviewModal
                    isOpen={isPreviewOpen}
                    onClose={() => {
                        setIsPreviewOpen(false);
                        setPreviewSchedule(null);
                    }}
                    schedule={previewSchedule}
                    onSave={handleSaveSchedule}
                />
            </div>
        </ProtectedRoute>
    );
}

export default GenerateSchedulePage;

