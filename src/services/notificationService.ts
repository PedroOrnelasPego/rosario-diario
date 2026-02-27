import { LocalNotifications, ScheduleOptions, LocalNotificationSchema } from '@capacitor/local-notifications';

export const scheduleAlarms = async (alarms: { hour: number; minute: number; enabled: boolean }[]) => {
  try {
    const navApp = (window as any).NativeApp;
    if (navApp) {
      // Cancelar todos primeiro
      for (let i = 0; i < 3; i++) {
        navApp.cancelAlarm(i);
      }
      
      alarms.forEach((alarm, i) => {
        if (alarm.enabled && i < 3) {
          navApp.setAlarm(i, alarm.hour, alarm.minute);
          console.log(`Native Alarm scheduled for ${alarm.hour}:${alarm.minute} at index ${i}`);
        }
      });
    }
  } catch (error) {
    console.error("Error scheduling alarms natively:", error);
  }
};

export const scheduleNotifications = async (enabled: boolean) => {
  try {
    // First, clear all existing notifications
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    if (!enabled) return;

    // Check/Request permissions
    const permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') {
      const request = await LocalNotifications.requestPermissions();
      if (request.display !== 'granted') return;
    }

    const messages = [
      "O seu rosário diário espera por você. Vamos rezar?",
      "Você já rezou hoje?",
      "Um momento com Maria pode transformar o seu dia.",
      "Salmo 23: O Senhor é meu pastor, nada me faltará."
    ];

    const notifications: LocalNotificationSchema[] = [];
    
    // Agendar algumas notificações diárias (ex: 9h, 15h, 20h)
    [9, 15, 20].forEach((hour, i) => {
      notifications.push({
        title: "Momento de Oração",
        body: messages[i % messages.length],
        id: 10 + i,
        schedule: {
          on: {
            hour: hour,
            minute: 0
          },
          allowWhileIdle: true,
          repeats: true
        }
      });
    });

    await LocalNotifications.schedule({ notifications });
    console.log(`Periodic notifications enabled`);
  } catch (error) {
    console.error("Error scheduling periodic notifications:", error);
  }
};
