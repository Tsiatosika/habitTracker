import { createContext, useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [permission, setPermission] = useState('default');

    useEffect(() => {
        // Vérifier la permission pour les notifications
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }

        // Charger les notifications sauvegardées
        loadNotifications();

        // Vérifier les rappels chaque minute
        const interval = setInterval(checkReminders, 60000);

        return () => clearInterval(interval);
    }, []);

    const requestPermission = async () => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        }
        return false;
    };

    const loadNotifications = () => {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            setNotifications(JSON.parse(saved));
        }
    };

    const saveNotifications = (notifs) => {
        localStorage.setItem('notifications', JSON.stringify(notifs));
    };

    const addNotification = (notification) => {
        const newNotif = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };

        const updated = [newNotif, ...notifications];
        setNotifications(updated);
        saveNotifications(updated);

        // Afficher un toast
        showToast(notification);

        return newNotif;
    };

    const showToast = (notification) => {
        const { type, title, message } = notification;

        const toastOptions = {
            duration: 4000,
            position: 'top-right',
            icon: getIconForType(type),
        };

        switch (type) {
            case 'success':
                toast.success(`${title}\n${message}`, toastOptions);
                break;
            case 'error':
                toast.error(`${title}\n${message}`, toastOptions);
                break;
            case 'warning':
                toast(`${title}\n${message}`, { ...toastOptions, icon: '⚠️' });
                break;
            case 'achievement':
                toast.success(`${title}\n${message}`, { ...toastOptions, icon: '🏆' });
                break;
            case 'streak':
                toast.success(`${title}\n${message}`, { ...toastOptions, icon: '🔥' });
                break;
            default:
                toast(`${title}\n${message}`, toastOptions);
        }
    };

    const getIconForType = (type) => {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            achievement: '🏆',
            streak: '🔥',
            reminder: '🔔'
        };
        return icons[type] || '📢';
    };

    const sendPushNotification = async (title, body, icon = '/icon.png') => {
        if (permission === 'granted' && 'Notification' in window) {
            try {
                const notification = new Notification(title, {
                    body,
                    icon,
                    badge: '/badge.png',
                    vibrate: [200, 100, 200],
                    tag: 'habit-tracker',
                    requireInteraction: false
                });

                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };

                return notification;
            } catch (error) {
                console.error('Error sending push notification:', error);
            }
        }
    };

    const scheduleReminder = (habitId, habitName, time) => {
        const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');

        const reminder = {
            id: Date.now(),
            habitId,
            habitName,
            time, // Format: "HH:MM"
            enabled: true
        };

        reminders.push(reminder);
        localStorage.setItem('reminders', JSON.stringify(reminders));

        toast.success(`Rappel programmé pour ${habitName} à ${time}`);
    };

    const checkReminders = () => {
        const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        reminders.forEach(reminder => {
            if (reminder.enabled && reminder.time === currentTime) {
                sendPushNotification(
                    '🔔 Rappel d\'habitude',
                    `Il est temps de : ${reminder.habitName}`
                );

                addNotification({
                    type: 'reminder',
                    title: 'Rappel d\'habitude',
                    message: reminder.habitName,
                    habitId: reminder.habitId
                });
            }
        });
    };

    const markAsRead = (notificationId) => {
        const updated = notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        );
        setNotifications(updated);
        saveNotifications(updated);
    };

    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
        saveNotifications(updated);
    };

    const deleteNotification = (notificationId) => {
        const updated = notifications.filter(n => n.id !== notificationId);
        setNotifications(updated);
        saveNotifications(updated);
    };

    const clearAll = () => {
        setNotifications([]);
        saveNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            permission,
            requestPermission,
            addNotification,
            sendPushNotification,
            scheduleReminder,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            clearAll,
            showToast
        }}>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    },
                }}
            />
            {children}
        </NotificationContext.Provider>
    );
};