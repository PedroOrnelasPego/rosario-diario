import { LocalNotifications, ScheduleOptions, LocalNotificationSchema } from '@capacitor/local-notifications';


export const scheduleNotifications = async (config: any) => {
  try {
    // First, clear all existing notifications
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    if (!config.reminders && !config.dailyProverbs && !config.novena) return;

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

    if (config.novena) {
      let novenasData = null;
      try {
        const r = await fetch('https://api-novena.vercel.app/api/novenas');
        novenasData = await r.json();
        localStorage.setItem('rosario_novenas_cache', JSON.stringify(novenasData));
      } catch (err) {
        const cached = localStorage.getItem('rosario_novenas_cache');
        if (cached) {
          try { novenasData = JSON.parse(cached); } catch(e) {}
        }
      }

      if (novenasData) {
        let novenaIdCounter = 100;
        const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        
        Object.keys(novenasData).forEach(monthName => {
          const novenas = novenasData[monthName];
          if (Array.isArray(novenas)) {
            novenas.forEach((novena: any) => {
               if (novena.starts) {
                  try {
                    const parts = novena.starts.split(' de ');
                    if (parts.length === 2) {
                      const day = parseInt(parts[0], 10);
                      const month = months.indexOf(parts[1].toLowerCase());
                      
                      if (month !== -1 && !isNaN(day)) {
                         const now = new Date();
                         let year = now.getFullYear();
                         
                         let targetDate = new Date(year, month, day, 9, 0, 0);
                         // Se a data já passou este ano num período de mais de 10 dias, agenda pro ano que vem
                         // O buffer de 10 dias é porque ainda vale rezar mesmo se já começou
                         if (targetDate.getTime() < now.getTime() - (10 * 24 * 60 * 60 * 1000)) {
                            targetDate = new Date(year + 1, month, day, 9, 0, 0);
                         }
                         
                         // Se a data proxima for estar no futuro próximo, a gente agenda
                         if (targetDate.getTime() > now.getTime()) {
                             notifications.push({
                                title: "Tempo de Novena",
                                body: `A ${novena.title} está começando hoje. Vamos rezar?`,
                                id: novenaIdCounter++,
                                channelId: 'rosario_daily',
                                schedule: {
                                   at: targetDate,
                                   allowWhileIdle: true
                                }
                             });
                         }
                      }
                    }
                  } catch(e) {}
               }
            });
          }
        });
      }
    }

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
      console.log(`Periodic notifications scheduled`);
    }
  } catch (error) {
    console.error("Error scheduling periodic notifications:", error);
  }
};
