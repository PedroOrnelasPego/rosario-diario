import { LocalNotifications, ScheduleOptions, LocalNotificationSchema } from '@capacitor/local-notifications';

export const scheduleAlarms = async (alarms: { hour: number; minute: number; enabled: boolean }[], alarmSound: string) => {
  try {
    const navApp = (window as any).NativeApp;
    if (navApp) {
      // Cancelar todos primeiro
      for (let i = 0; i < 3; i++) {
        navApp.cancelAlarm(i);
      }
      
      let actualUri = alarmSound;
      if (navApp.getSystemRingtones) {
         try {
           const ringtonesStr = navApp.getSystemRingtones();
           if (ringtonesStr) {
             const sysRingtones = JSON.parse(ringtonesStr);
             const found = sysRingtones.find((s:any) => s.name === alarmSound);
             if (found) actualUri = found.url;
           }
         } catch(e) {}
      }

      alarms.forEach((alarm, i) => {
        if (alarm.enabled && i < 3) {
          navApp.setAlarm(i, alarm.hour, alarm.minute, actualUri);
          console.log(`Native Alarm scheduled for ${alarm.hour}:${alarm.minute} at index ${i}`);
        }
      });
    }
  } catch (error) {
    console.error("Error scheduling alarms natively:", error);
  }
};

export const scheduleNotifications = async (config: any) => {
  try {
    // First, clear all existing notifications
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    if (!config.reminders && !config.dailyProverbs) return;

    // Check/Request permissions
    const permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') {
      const request = await LocalNotifications.requestPermissions();
      if (request.display !== 'granted') return;
    }

    // Criar canal no Android (Obrigatório API 26+)
    if (window.navigator.userAgent.includes('Android')) {
      await LocalNotifications.createChannel({
        id: 'rosario_daily',
        name: 'Lembretes Diários',
        description: 'Lembretes para rezar o rosário e ler o salmo',
        importance: 4,
        visibility: 1
      });
    }

    const messages = [
      "O seu rosário diário espera por você. Vamos rezar?",
      "Você já rezou hoje?",
      "Um momento com Maria pode transformar o seu dia.",
      "Salmo 23: O Senhor é meu pastor, nada me faltará.",
      "Provérbios 3: Confia no Senhor de todo o teu coração.",
      "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus (Is 41:10)",
      "Tudo posso naquele que me fortalece (Fl 4:13)",
      "Entregue o seu caminho ao Senhor (Sl 37:5)"
    ];

    const notifications: LocalNotificationSchema[] = [];
    
    // Lembretes de Oração vs Mensagens Diárias
    let hoursToSchedule: number[] = [];
    
    if (config.reminders && config.dailyProverbs !== false) {
      hoursToSchedule = [9, 12, 15, 18, 20]; // A cada 3h aprox durante o dia
    } else if (config.reminders) {
      hoursToSchedule = [9, 20]; // Apenas os extremos
    } else if (config.dailyProverbs !== false) {
      hoursToSchedule = [10, 15, 18]; // Apenas versículos no meio dia
    }
    
    hoursToSchedule.forEach((hour, i) => {
      notifications.push({
        title: config.dailyProverbs !== false ? "Palavra do Dia" : "Momento de Oração",
        body: messages[i % messages.length],
        id: 10 + i,
        channelId: 'rosario_daily',
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

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
      console.log(`Periodic notifications scheduled`);
    }
  } catch (error) {
    console.error("Error scheduling periodic notifications:", error);
  }
};
