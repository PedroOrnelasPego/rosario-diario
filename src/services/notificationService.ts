import { LocalNotifications } from '@capacitor/local-notifications';

export const scheduleAlarm = async (hour: number, minute: number, enabled: boolean) => {
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

    // Schedule the notification for every day at the specified time
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Hora da Oração",
          body: "O seu rosário diário espera por você. Vamos rezar?",
          id: 1,
          schedule: {
            on: {
              hour: hour,
              minute: minute
            },
            allowWhileIdle: true,
            repeats: true
          },
          sound: 'beep.wav', // Fallback
          actionTypeId: "",
          extra: null
        }
      ]
    });
    console.log(`Alarm scheduled for ${hour}:${minute}`);
  } catch (error) {
    console.error("Error scheduling alarm:", error);
  }
};
