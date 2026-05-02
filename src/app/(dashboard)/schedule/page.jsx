'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMySchedule } from '@/services/enrollment.service';
import { toast } from 'sonner';

/**
 * Course Detail Modal
 */
function CourseDetailModal({ isOpen, onClose, course }) {
    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Ders Detayları</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Ders Kodu</p>
                        <p className="font-semibold">{course.CourseCode}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Ders Adı</p>
                        <p className="font-semibold">{course.CourseName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Şube</p>
                        <p className="font-semibold">{course.SectionNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Öğretim Elemanı</p>
                        <p className="font-semibold">{course.InstructorName || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Derslik</p>
                        <p className="font-semibold">{course.ClassroomInfo || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Gün</p>
                        <p className="font-semibold">{course.Day}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Saat</p>
                        <p className="font-semibold">{course.StartTime} - {course.EndTime}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/**
 * Mini Calendar Component
 */
function MiniCalendar({ currentDate, onDateChange, scheduleItems }) {
    const [currentMonth, setCurrentMonth] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };
    
    const getFirstDayOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday = 0
    };
    
    const hasSchedule = (day) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay() === 0 ? 6 : new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay() - 1];
        return scheduleItems?.some(item => item.Day === dayName);
    };
    
    const days = [];
    const firstDay = getFirstDayOfMonth(currentMonth);
    const daysInMonth = getDaysInMonth(currentMonth);
    
    // Previous month days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, isCurrentMonth: true });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({ day: i, isCurrentMonth: false });
    }
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-1 rounded hover:bg-muted"
                >
                    <ChevronLeft className="size-4" />
                </button>
                <h3 className="font-bold text-sm">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-1 rounded hover:bg-muted"
                >
                    <ChevronRight className="size-4" />
                </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-xs font-medium text-center text-muted-foreground py-1">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
                {days.map(({ day, isCurrentMonth }, index) => {
                    const hasClass = hasSchedule(day) && isCurrentMonth;
                    const isToday = isCurrentMonth && 
                        day === new Date().getDate() && 
                        currentMonth.getMonth() === new Date().getMonth() &&
                        currentMonth.getFullYear() === new Date().getFullYear();
                    
                    return (
                        <button
                            key={index}
                            onClick={() => isCurrentMonth && onDateChange?.(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                            className={`aspect-square text-xs rounded transition-colors ${
                                isToday 
                                    ? 'bg-primary text-primary-foreground font-bold' 
                                    : hasClass
                                    ? 'bg-primary/20 text-primary font-semibold hover:bg-primary/30'
                                    : isCurrentMonth
                                    ? 'hover:bg-muted'
                                    : 'text-muted-foreground/30'
                            }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Upcoming Courses List
 */
function UpcomingCourses({ scheduleItems, onCourseClick }) {
    const getNextCourses = () => {
        if (!scheduleItems || scheduleItems.length === 0) return [];
        
        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = dayNames[today.getDay()];
        const currentTime = today.getHours() * 60 + today.getMinutes();
        
        const upcoming = scheduleItems
            .filter(item => {
                // Sadece hafta içi günleri göster
                if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(item.Day)) {
                    return false;
                }
                
                const itemDay = item.Day;
                const [startHour, startMin] = item.StartTime.split(':').map(Number);
                const itemTime = startHour * 60 + startMin;
                
                const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                const currentDayIndex = dayOrder.indexOf(currentDay);
                const itemDayIndex = dayOrder.indexOf(itemDay);
                
                if (currentDayIndex === -1) {
                    // Bugün hafta sonu ise, tüm hafta içi dersleri göster
                    return true;
                }
                
                if (itemDayIndex > currentDayIndex) return true;
                if (itemDayIndex === currentDayIndex && itemTime > currentTime) return true;
                return false;
            })
            .sort((a, b) => {
                const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                const aIndex = dayOrder.indexOf(a.Day);
                const bIndex = dayOrder.indexOf(b.Day);
                if (aIndex !== bIndex) return aIndex - bIndex;
                return a.StartTime.localeCompare(b.StartTime);
            })
            .slice(0, 5);
        
        return upcoming;
    };
    
    const upcoming = getNextCourses();
    
    if (upcoming.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-border p-4">
                <h3 className="font-bold mb-3">Yaklaşan Dersler</h3>
                <p className="text-sm text-muted-foreground">Yaklaşan ders bulunmuyor</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-border p-4">
            <h3 className="font-bold mb-3">Yaklaşan Dersler</h3>
            <div className="space-y-3">
                {upcoming.map((course, index) => {
                    const dayTranslations = {
                        'Monday': 'Pazartesi',
                        'Tuesday': 'Salı',
                        'Wednesday': 'Çarşamba',
                        'Thursday': 'Perşembe',
                        'Friday': 'Cuma'
                    };
                    
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onCourseClick?.(course)}
                            className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-primary">
                                        {dayTranslations[course.Day]?.charAt(0) || 'P'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm truncate">{course.CourseCode}</div>
                                    <div className="text-xs text-muted-foreground truncate">{course.CourseName}</div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <Clock className="size-3" />
                                        <span>{course.StartTime} - {course.EndTime}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Weekly Calendar Component - Modern Design
 */
function WeeklyCalendar({ scheduleItems = [], onItemClick, currentWeek }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    const dayTranslations = {
        'Monday': 'Pazartesi',
        'Tuesday': 'Salı',
        'Wednesday': 'Çarşamba',
        'Thursday': 'Perşembe',
        'Friday': 'Cuma'
    };
    
    const getWeekDates = () => {
        const start = new Date(currentWeek);
        const dates = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dates.push(date);
        }
        return dates;
    };
    
    const weekDates = getWeekDates();
    
    // Color assignment by SectionId
    const courseColors = {};
    const colors = [
        { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-900', dark: 'dark:bg-yellow-900/40 dark:border-yellow-600 dark:text-yellow-200' },
        { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-900', dark: 'dark:bg-purple-900/40 dark:border-purple-600 dark:text-purple-200' },
        { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-900', dark: 'dark:bg-green-900/40 dark:border-green-600 dark:text-green-200' },
        { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-900', dark: 'dark:bg-pink-900/40 dark:border-pink-600 dark:text-pink-200' },
        { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-900', dark: 'dark:bg-blue-900/40 dark:border-blue-600 dark:text-blue-200' },
        { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-900', dark: 'dark:bg-indigo-900/40 dark:border-indigo-600 dark:text-indigo-200' },
    ];
    
    const uniqueSectionIds = [...new Set(scheduleItems.map(item => item.SectionId))];
    uniqueSectionIds.forEach((sectionId, index) => {
        courseColors[sectionId] = colors[index % colors.length];
    });
    
    return (
        <div className="space-y-4">
            {/* Day Headers */}
            <div className="grid grid-cols-5 gap-3">
                {days.map((day, index) => {
                    const date = weekDates[index];
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayItems = scheduleItems.filter(item => item.Day === day);
                    
                    return (
                        <div key={day} className="text-center">
                            <div className={`p-3 rounded-lg ${isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <div className="text-2xl font-bold">{date.getDate()}</div>
                                <div className="text-xs font-medium mt-1">
                                    {dayTranslations[day] || day}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Course Cards */}
            <div className="grid grid-cols-5 gap-3">
                {days.map(day => {
                    const dayItems = scheduleItems.filter(item => item.Day === day);
                    
                    return (
                        <div key={day} className="space-y-2 min-h-[400px]">
                            {dayItems.map(item => {
                                const color = courseColors[item.SectionId] || colors[0];
                                
                                return (
                                    <motion.div
                                        key={`${item.SectionId}-${item.Day}-${item.StartTime}`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={() => onItemClick?.(item)}
                                        className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all ${color.bg} ${color.border} ${color.text} ${color.dark}`}
                                    >
                                        <div className="font-bold text-sm mb-1">{item.CourseCode}</div>
                                        <div className="text-xs font-semibold mb-2 line-clamp-1">{item.CourseName}</div>
                                        <div className="flex items-center gap-1 text-xs mb-1">
                                            <Clock className="size-3" />
                                            <span>{item.StartTime} - {item.EndTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                            <MapPin className="size-3" />
                                            <span className="truncate">{item.ClassroomInfo || 'Belirtilmemiş'}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Generate iCal file
 */
function generateICal(scheduleItems, semester, year) {
    const formatDate = (dateStr, timeStr) => {
        const [year, month, day] = dateStr.split('-');
        const [hour, minute] = timeStr.split(':');
        return `${year}${month}${day}T${hour}${minute}00`;
    };

    const getWeekStart = () => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    };

    const weekStart = getWeekStart();
    const dayMap = {
        'Monday': 0,
        'Tuesday': 1,
        'Wednesday': 2,
        'Thursday': 3,
        'Friday': 4
    };

    let ical = 'BEGIN:VCALENDAR\n';
    ical += 'VERSION:2.0\n';
    ical += 'PRODID:-//SmartCampus//Schedule//EN\n';
    ical += 'CALSCALE:GREGORIAN\n';
    ical += 'METHOD:PUBLISH\n';

    scheduleItems.forEach(item => {
        const dayOffset = dayMap[item.Day] || 0;
        const eventDate = new Date(weekStart);
        eventDate.setDate(eventDate.getDate() + dayOffset);
        
        const dateStr = eventDate.toISOString().split('T')[0];
        const startDateTime = formatDate(dateStr, item.StartTime);
        const endDateTime = formatDate(dateStr, item.EndTime);

        ical += 'BEGIN:VEVENT\n';
        ical += `UID:${item.SectionId}-${item.Day}-${item.StartTime}@smartcampus.edu\n`;
        ical += `DTSTART:${startDateTime}\n`;
        ical += `DTEND:${endDateTime}\n`;
        ical += `RRULE:FREQ=WEEKLY;COUNT=16\n`;
        ical += `SUMMARY:${item.CourseCode} - ${item.CourseName}\n`;
        ical += `DESCRIPTION:Şube: ${item.SectionNumber}\\nÖğretim Elemanı: ${item.InstructorName || 'Belirtilmemiş'}\\nDerslik: ${item.ClassroomInfo || 'Belirtilmemiş'}\n`;
        ical += `LOCATION:${item.ClassroomInfo || 'Belirtilmemiş'}\n`;
        ical += 'END:VEVENT\n';
    });

    ical += 'END:VCALENDAR\n';
    return ical;
}

/**
 * Schedule Page - Ders Programı Sayfası
 */
export default function SchedulePage() {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    });

    // Mock data
    const mockSchedule = {
        Semester: "Güz",
        Year: 2024,
        ScheduleItems: [
            {
                SectionId: 1, CourseCode: "CS101", CourseName: "Bilgisayar Bilimlerine Giriş",
                SectionNumber: "A", InstructorName: "Dr. Ahmet Yılmaz", ClassroomInfo: "A-101",
                Day: "Monday", StartTime: "09:00", EndTime: "10:30", ClassroomId: 1
            },
            {
                SectionId: 1, CourseCode: "CS101", CourseName: "Bilgisayar Bilimlerine Giriş",
                SectionNumber: "A", InstructorName: "Dr. Ahmet Yılmaz", ClassroomInfo: "A-101",
                Day: "Wednesday", StartTime: "09:00", EndTime: "10:30", ClassroomId: 1
            },
            {
                SectionId: 2, CourseCode: "MATH201", CourseName: "Analiz II",
                SectionNumber: "B", InstructorName: "Prof. Mehmet Demir", ClassroomInfo: "B-205",
                Day: "Tuesday", StartTime: "10:00", EndTime: "11:30", ClassroomId: 2
            },
            {
                SectionId: 2, CourseCode: "MATH201", CourseName: "Analiz II",
                SectionNumber: "B", InstructorName: "Prof. Mehmet Demir", ClassroomInfo: "B-205",
                Day: "Thursday", StartTime: "10:00", EndTime: "11:30", ClassroomId: 2
            },
            {
                SectionId: 3, CourseCode: "ENG102", CourseName: "İngilizce Kompozisyon",
                SectionNumber: "C", InstructorName: "Öğr. Gör. Ayşe Kaya", ClassroomInfo: "A-201",
                Day: "Monday", StartTime: "14:00", EndTime: "15:30", ClassroomId: 3
            },
            {
                SectionId: 4, CourseCode: "PHYS101", CourseName: "Fizik I",
                SectionNumber: "D", InstructorName: "Dr. Can Özkan", ClassroomInfo: "Lab-1",
                Day: "Tuesday", StartTime: "13:00", EndTime: "15:00", ClassroomId: 4
            },
            {
                SectionId: 5, CourseCode: "HIST201", CourseName: "Dünya Tarihi",
                SectionNumber: "E", InstructorName: "Prof. Zeynep Arslan", ClassroomInfo: "B-101",
                Day: "Friday", StartTime: "09:00", EndTime: "10:30", ClassroomId: 5
            },
        ]
    };

    useEffect(() => {
        loadSchedule();
    }, []);

    async function loadSchedule() {
        try {
            setLoading(true);
            const response = await getMySchedule();
            if (response.success) {
                setSchedule(response.data);
            } else {
                setSchedule(mockSchedule);
            }
        } catch (error) {
            toast.error('Ders programı yüklenemedi. Mock veri kullanılıyor.');
            console.error(error);
            setSchedule(mockSchedule);
        } finally {
            setLoading(false);
        }
    }

    function handleCourseClick(course) {
        setSelectedCourse(course);
        setIsModalOpen(true);
    }

    function handleExportICal() {
        if (!schedule || !schedule.ScheduleItems || schedule.ScheduleItems.length === 0) {
            toast.error('Ders programı boş');
            return;
        }

        const icalContent = generateICal(schedule.ScheduleItems, schedule.Semester, schedule.Year);
        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ders-programi-${schedule.Semester}-${schedule.Year}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('iCal dosyası indirildi');
    }


    function navigateWeek(direction) {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(newWeek.getDate() + (direction * 7));
        setCurrentWeek(newWeek);
    }

    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const currentMonth = monthNames[currentWeek.getMonth()];
    const currentYear = currentWeek.getFullYear();

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-96 bg-muted animate-pulse rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground">
                Ana Sayfa / Dersler / Ders Programım
            </div>

            {/* Header with Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigateWeek(-1)}
                        className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">
                            {currentMonth.toUpperCase()} {currentYear}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {schedule?.Semester} {schedule?.Year} Dönemi
                        </p>
                    </div>
                    <button
                        onClick={() => navigateWeek(1)}
                        className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* iCal Export Button */}
                    <button
                        onClick={handleExportICal}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Download className="size-4" />
                        <span>iCal'e Aktar</span>
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar View - 3 columns */}
                <div className="lg:col-span-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-800/50 rounded-xl border border-border p-6"
                    >
                        {schedule?.ScheduleItems && schedule.ScheduleItems.length > 0 ? (
                            <WeeklyCalendar
                                scheduleItems={schedule.ScheduleItems}
                                onItemClick={handleCourseClick}
                                currentWeek={currentWeek}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">Henüz ders programınız yok</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right Sidebar - 1 column */}
                <div className="space-y-4">
                    {/* Mini Calendar */}
                    <MiniCalendar
                        currentDate={currentWeek}
                        onDateChange={(date) => {
                            const day = date.getDay();
                            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
                            setCurrentWeek(new Date(date.setDate(diff)));
                        }}
                        scheduleItems={schedule?.ScheduleItems}
                    />

                    {/* Upcoming Courses */}
                    <UpcomingCourses
                        scheduleItems={schedule?.ScheduleItems}
                        onCourseClick={handleCourseClick}
                    />
                </div>
            </div>

            {/* Course Detail Modal */}
            <CourseDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                course={selectedCourse}
            />
        </div>
    );
}
