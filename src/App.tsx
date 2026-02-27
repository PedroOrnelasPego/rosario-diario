import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import Home from './components/Home';
import Prayer from './components/Prayer';
import Alarm from './components/Alarm';
import Onboarding from './components/Onboarding';
import { Artwork, getDailyArtImage } from './services/artService';
import { 
  Library, PencilLine, User, Sparkles, X, Activity, History, ShieldCheck, Download, Clock, Flame, Award, Moon, CheckCircle2, Heart, Camera as CameraIcon
} from 'lucide-react';
import av1 from './assets/avatares/1.png';
import av2 from './assets/avatares/2.png';
import av3 from './assets/avatares/3.png';
import av4 from './assets/avatares/4.png';
import av5 from './assets/avatares/5.png';
import av6 from './assets/avatares/6.png';
import av7 from './assets/avatares/7.png';

const avatars = [av1, av2, av3, av4, av5, av6, av7];

// Helper Components for Modals
const PremiumFeatureItem = ({ icon: Icon, title, description }: any) => (
  <div className="flex items-start gap-4 p-2">
    <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-sm font-black text-slate-900 dark:text-white">{title}</h4>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{description}</p>
    </div>
  </div>
);

const AchievementBlock = ({ title, desc, progress, total, current, icon: Icon, earned }: any) => (
  <div className={`p-5 rounded-3xl border-2 transition-all ${earned ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
    <div className="flex items-center gap-4 mb-4">
      <div className={`size-12 rounded-2xl flex items-center justify-center ${earned ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-black ${earned ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{title}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{desc}</p>
      </div>
      {earned && <CheckCircle2 size={20} className="text-primary" />}
    </div>
    <div className="space-y-1.5">
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-1000" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
        <span>Progresso</span>
        <span>{current || 0}/{total}</span>
      </div>
    </div>
  </div>
);

const ArtworkPattern = () => (
  <div className="grid grid-cols-4 gap-2 rotate-12 -translate-y-10">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="aspect-square bg-white/30 rounded-lg"></div>
    ))}
  </div>
);

export type Screen = 'home' | 'prayer' | 'alarm' | 'settings' | 'library' | 'bible' | 'diary' | 'profile' | 'edit-profile';

import Navigation from './components/Navigation';
import AppSettings from './components/Settings';
import LibraryComponent from './components/Library';
import DiaryComponent from './components/Diary';
import ProfileComponent from './components/Profile';
import BibleComponent from './components/Bible';
import { BibleVerse, getDailyVerse, getPsalmOfDay } from './services/bibleService';
import { scheduleAlarms, scheduleNotifications } from './services/notificationService';

export default function App() {
  const [isFirstTime, setIsFirstTime] = useState(() => !localStorage.getItem('rosario_user_data'));
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [settingsSub, setSettingsSub] = useState<any>('main');
  const [dailyArt, setDailyArt] = useState<Artwork | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userName, setUserName] = useState('Maria Silva');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('rosario_notifications_config');
    return saved ? JSON.parse(saved) : {
      reminders: true,
      audioAlerts: false,
      dailyMystery: true,
      prayerHaptics: true,
    };
  });
  
  // Real Alarms State (Up to 3)
  const [alarms, setAlarms] = useState([{ hour: 6, minute: 30, enabled: true }]);
  const [alarmSound, setAlarmSound] = useState('Gregoriano');

  // Stats State
  const [totalPrayers, setTotalPrayers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dailyHistory, setDailyHistory] = useState<string[]>([]);
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [psalmOfDay, setPsalmOfDay] = useState<BibleVerse | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [userNameSubtitle, setUserNameSubtitle] = useState(() => {
    return localStorage.getItem('rosario_user_subtitle') || 'Fiel de Maria';
  });
  const [isSupporter, setIsSupporter] = useState(() => {
    return localStorage.getItem('rosario_is_supporter') === 'true';
  });
  const [isPhotoPromptOpen, setIsPhotoPromptOpen] = useState(false);
  const [photoTarget, setPhotoTarget] = useState<'profile' | 'onboarding'>('profile');
  const [prayerTypography, setPrayerTypography] = useState(() => {
    const saved = localStorage.getItem('rosario_prayer_typography');
    return saved ? JSON.parse(saved) : {
      fontFamily: 'font-serif',
      fontSize: 'text-3xl',
      isBold: false
    };
  });

  // Request permissions and manage status bar on mount
  useEffect(() => {
    const initApp = async () => {
      try {
        // Set Status Bar Style based on theme
        await StatusBar.setStyle({ style: isDarkMode ? Style.Dark : Style.Light });
        
        // Android specific: color the bar to avoid gray
        if (window.navigator.userAgent.includes('Android')) {
          await StatusBar.setBackgroundColor({ color: isDarkMode ? '#020617' : '#f8fafc' });
          await StatusBar.setOverlaysWebView({ overlay: false });
        }

        const status = await LocalNotifications.checkPermissions();
        if (status.display === 'prompt' || status.display === 'prompt-with-rationale') {
          await LocalNotifications.requestPermissions();
        }
      } catch (e) {
        console.warn("Init app native features failed", e);
      }
    };
    initApp();
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('rosario_prayer_typography', JSON.stringify(prayerTypography));
  }, [prayerTypography]);

  useEffect(() => {
    localStorage.setItem('rosario_notifications_config', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    scheduleAlarms(alarms, alarmSound);
    const savedData = localStorage.getItem('rosario_user_data');
    if (savedData && !isFirstTime) {
      try {
        const data = JSON.parse(savedData);
        data.alarms = alarms;
        data.alarmSound = alarmSound;
        localStorage.setItem('rosario_user_data', JSON.stringify(data));
      } catch (e) {}
    }
  }, [alarms, alarmSound, isFirstTime]);

  useEffect(() => {
    scheduleNotifications(notifications.reminders || notifications.dailyMystery);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('rosario_is_supporter', String(isSupporter));
  }, [isSupporter]);

  useEffect(() => {
    localStorage.setItem('rosario_user_subtitle', userNameSubtitle);
  }, [userNameSubtitle]);

  useEffect(() => {
    // Load persisted data
    const savedData = localStorage.getItem('rosario_user_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      setUserName(data.name);
      setUserPhoto(data.photo);
      
      // Migrate old alarm to alarms array
      if (data.alarms) {
        setAlarms(data.alarms);
      } else if (data.alarm) {
        setAlarms([data.alarm]);
      }
      
      if (data.alarmSound) {
        setAlarmSound(data.alarmSound);
      }
      
      setTotalPrayers(data.totalPrayers || 0);
      setStreak(data.streak || 0);
      setDailyHistory(data.dailyHistory || []);
      setIsFirstTime(false);
    }
    
    getDailyVerse().then(setDailyVerse);
    getPsalmOfDay().then(setPsalmOfDay);

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const dayOfWeek = today.getDay();
    const mysteryNames = [
      'Mistérios Gloriosos',
      'Mistérios Gozosos',
      'Mistérios Dolorosos',
      'Mistérios Gloriosos',
      'Mistérios Luminosos',
      'Mistérios Dolorosos',
      'Mistérios Gozosos'
    ];
    const currentMysteryName = mysteryNames[dayOfWeek];
    
    getDailyArtImage(currentMysteryName, dateStr).then(setDailyArt);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handlePrayerComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...dailyHistory];
    
    if (!newHistory.includes(today)) {
      newHistory.push(today);
    }

    const newTotal = totalPrayers + 1;
    setTotalPrayers(newTotal);
    setDailyHistory(newHistory);

    // Update localStorage
    const savedData = localStorage.getItem('rosario_user_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      data.totalPrayers = newTotal;
      data.dailyHistory = newHistory;
      // Simple streak logic (could be more robust)
      data.streak = (data.streak || 0) + 1;
      setStreak(data.streak);
      localStorage.setItem('rosario_user_data', JSON.stringify(data));
    }
  };

  const toggleDarkMode = async () => {
    setIsDarkMode(!isDarkMode);
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}
  };

  const variants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 }
  };

  const handleOnboardingComplete = (data: { 
    name: string; 
    photo: string | null; 
    alarms: { hour: number; minute: number; enabled: boolean }[];
    notifications: boolean;
    theme: 'light' | 'dark';
  }) => {
    setUserName(data.name);
    setUserPhoto(data.photo);
    setAlarms(data.alarms);
    setNotifications(prev => ({...prev, reminders: data.notifications, dailyMystery: data.notifications}));
    localStorage.setItem('rosario_user_data', JSON.stringify({
      name: data.name,
      photo: data.photo,
      alarms: data.alarms
    }));
    setIsFirstTime(false);
  };

  const handlePhotoUploadTrigger = async () => {
    setIsPhotoPromptOpen(true);
  };

  const handleTakePhoto = async (sourceType: 'CAMERA' | 'PHOTOS') => {
    try {
      const source = sourceType === 'CAMERA' ? CameraSource.Camera : CameraSource.Photos;
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source
      });

      if (image && image.dataUrl) {
        setPhotoTarget('profile');
        setUserPhoto(image.dataUrl);
        // Update localStorage
        const savedData = localStorage.getItem('rosario_user_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          parsed.photo = image.dataUrl;
          localStorage.setItem('rosario_user_data', JSON.stringify(parsed));
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    } finally {
      setIsPhotoPromptOpen(false);
    }
  };

  const handleSelectAvatar = (avatarUrl: string) => {
    setPhotoTarget('profile');
    setUserPhoto(avatarUrl);
    const savedData = localStorage.getItem('rosario_user_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      parsed.photo = avatarUrl;
      localStorage.setItem('rosario_user_data', JSON.stringify(parsed));
    }
    setIsPhotoPromptOpen(false);
  };

  if (isFirstTime) {
    return (
      <Onboarding 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={toggleDarkMode} 
        onComplete={handleOnboardingComplete} 
        onPhotoUpload={handlePhotoUploadTrigger}
      />
    );
  }

  return (
    <div className={`mx-auto max-w-[430px] h-[100dvh] w-full flex flex-col relative overflow-hidden shadow-2xl ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <main className="flex-1 w-full overflow-y-auto relative flex flex-col custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full w-full flex flex-col"
          >
            {currentScreen === 'home' && (
              <Home 
                onNavigate={setCurrentScreen} 
                onOpenPremium={() => setIsPremiumModalOpen(true)}
                dailyArt={dailyArt} 
                isDarkMode={isDarkMode} 
                onToggleDarkMode={toggleDarkMode} 
                alarms={alarms}
                setAlarms={setAlarms}
                userName={userName}
                userPhoto={userPhoto}
                streak={streak}
                totalPrayers={totalPrayers}
                dailyHistory={dailyHistory}
                dailyVerse={dailyVerse}
              />
            )}
            {currentScreen === 'prayer' && (
              <Prayer 
                onNavigate={setCurrentScreen} 
                dailyArt={dailyArt} 
                onComplete={handlePrayerComplete}
                typography={prayerTypography}
                hapticsEnabled={notifications.prayerHaptics ?? true}
              />
            )}
            {currentScreen === 'alarm' && (
              <Alarm 
                onNavigate={setCurrentScreen} 
                alarms={alarms} 
                setAlarms={setAlarms}
                sound={alarmSound}
                setSound={setAlarmSound}
              />
            )}
            {currentScreen === 'settings' && (
              <AppSettings 
                onNavigate={setCurrentScreen} 
                isDarkMode={isDarkMode} 
                onToggleDarkMode={toggleDarkMode} 
                userName={userName}
                setUserName={setUserName}
                userPhoto={userPhoto}
                setUserPhoto={setUserPhoto}
                userNameSubtitle={userNameSubtitle}
                setUserNameSubtitle={setUserNameSubtitle}
                onPhotoUpload={handlePhotoUploadTrigger}
                notifications={notifications}
                setNotifications={setNotifications}
                activeSub={settingsSub}
                setActiveSub={setSettingsSub}
                prayerTypography={prayerTypography}
                setPrayerTypography={setPrayerTypography}
              />
            )}
            {currentScreen === 'library' && (
              <LibraryComponent 
                onNavigate={setCurrentScreen} 
                psalmOfDay={psalmOfDay}
                onOpenPremium={() => setIsPremiumModalOpen(true)}
              />
            )}
            {currentScreen === 'bible' && (
              <BibleComponent onNavigate={setCurrentScreen} />
            )}
            {currentScreen === 'diary' && <DiaryComponent onNavigate={setCurrentScreen} />}
            {currentScreen === 'profile' && (
              <ProfileComponent 
                onNavigate={(screen) => {
                  if (screen === 'edit-profile') {
                    setSettingsSub('edit-profile');
                    setCurrentScreen('settings');
                  } else {
                    setCurrentScreen(screen);
                  }
                }} 
                userName={userName}
                userPhoto={userPhoto}
                onPhotoUpload={handlePhotoUploadTrigger}
                totalPrayers={totalPrayers}
                streak={streak}
                dailyHistory={dailyHistory}
                userNameSubtitle={userNameSubtitle}
                isSupporter={isSupporter}
                onOpenPremium={() => setIsPremiumModalOpen(true)}
                onOpenAchievements={() => setIsAchievementsModalOpen(true)}
                onOpenDonation={() => setIsDonationModalOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Premium Paywall Modal */}
        <AnimatePresence>
          {isPremiumModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end justify-center"
            >
              <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                onClick={() => setIsPremiumModalOpen(false)}
              ></div>
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[40px] shadow-2xl flex flex-col max-h-[92dvh]"
              >
                {/* Sticky close button — always visible */}
                <button 
                  onClick={() => setIsPremiumModalOpen(false)}
                  className="absolute top-4 right-4 z-10 size-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Scrollable content */}
                <div className="overflow-y-auto">
                  {/* Header */}
                  <div className="h-44 bg-primary relative overflow-hidden rounded-t-[40px]">
                    <div className="absolute inset-0 opacity-20">
                      <ArtworkPattern />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent"></div>
                    <div className="absolute bottom-0 inset-x-0 flex flex-col items-center pb-2">
                      <div className="size-16 bg-accent-gold rounded-2xl shadow-xl shadow-gold/20 flex items-center justify-center text-white mb-2">
                        <Sparkles size={32} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Premium Gold</h2>
                    </div>
                  </div>

                  <div className="p-6 space-y-5 pb-10">
                    <div className="space-y-3">
                      <PremiumFeatureItem icon={Activity} title="Dashboard Detalhado" description="Acompanhe sua evolução diária com gráficos." />
                      <PremiumFeatureItem icon={History} title="Histórico Completo" description="Veja todas as suas orações passadas." />
                      <PremiumFeatureItem icon={ShieldCheck} title="Sem Anúncios" description="Uma experiência focada 100% na sua fé." />
                      <PremiumFeatureItem icon={Download} title="Bíblia Offline" description="Acesse a Palavra sem precisar de internet." />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Assinatura Mensal</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">R$</span>
                        <span className="text-4xl font-black text-slate-900 dark:text-white">11,90</span>
                      </div>
                      <p className="text-[10px] font-bold text-primary mt-2 flex items-center justify-center gap-1 italic">
                        <Clock size={12} /> Teste por 7 dias grátis
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button className="w-full bg-primary text-white font-black py-5 rounded-[28px] shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all active:scale-[0.98]">
                        Assinar Agora
                      </button>
                      
                      <button 
                        onClick={() => {
                          setIsPremiumModalOpen(false);
                          setTimeout(() => setIsDonationModalOpen(true), 150);
                        }}
                        className="w-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 font-bold py-4 rounded-[24px] flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all text-sm"
                      >
                        <Heart size={18} fill="currentColor" className="opacity-80" />
                        Fazer uma Doação Única
                      </button>
                    </div>
                    <p className="text-[9px] text-center text-slate-400 px-6">
                      Cancele a qualquer momento nas configurações da sua conta.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements Modal */}
        <AnimatePresence>
          {isAchievementsModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            >
              <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                onClick={() => setIsAchievementsModalOpen(false)}
              ></div>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Suas Conquistas</h2>
                  <button 
                    onClick={() => setIsAchievementsModalOpen(false)}
                    className="size-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[70vh]">
                  <AchievementBlock 
                    title="Iniciante na Fé" 
                    desc="Completou o primeiro terço" 
                    progress={100} 
                    total={1} 
                    earned={true}
                    icon={Sparkles}
                  />
                  <AchievementBlock 
                    title="Fiel Constante" 
                    desc="Rezar por 7 dias seguidos" 
                    progress={Math.min((streak/7)*100, 100)} 
                    total={7} 
                    current={streak}
                    icon={Flame}
                  />
                  <AchievementBlock 
                    title="Devoto de Maria" 
                    desc="Completar 12 terços" 
                    progress={Math.min((totalPrayers/12)*100, 100)} 
                    total={12} 
                    current={totalPrayers}
                    icon={Award}
                  />
                  <AchievementBlock 
                    title="Guardião da Alvorada" 
                    desc="Rezar antes das 08:00 por 3 dias" 
                    progress={0} 
                    total={3} 
                    icon={Moon}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Donation (Apoio) Modal */}
        <AnimatePresence>
          {isDonationModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6"
            >
              <div 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                onClick={() => setIsDonationModalOpen(false)}
              ></div>
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="p-8 pb-4 text-center">
                  <div className="size-20 bg-rose-500 rounded-[32px] mx-auto flex items-center justify-center text-white mb-6 shadow-xl shadow-rose-200 dark:shadow-rose-950/40">
                    <Heart size={40} fill="currentColor" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Apoie o Rosário Diário</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium px-4">
                    Sua contribuição ajuda a manter o app no ar e gratuito para milhares de pessoas. Ao apoiar, você ganha o <span className="text-rose-500 font-black italic">Selo de Apoiador</span> no seu perfil!
                  </p>
                </div>

                <div className="p-8 pt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'coffee', label: 'Um Cafézinho', price: '4,90', icon: '☕' },
                      { id: 'rosary', label: 'Um Terço', price: '14,90', icon: '📿' },
                      { id: 'church', label: 'Ajuda Generosa', price: '49,90', icon: '⛪' }
                    ].map((level) => (
                      <button 
                        key={level.id}
                        onClick={() => {
                          // Simulating IAP success for now
                          setIsSupporter(true);
                          setIsDonationModalOpen(false);
                        }}
                        className="flex items-center justify-between p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-rose-500/30 hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-all group active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{level.icon}</span>
                          <div className="text-left">
                            <span className="text-sm font-black text-slate-900 dark:text-white block">{level.label}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Contribuição Única</span>
                          </div>
                        </div>
                        <span className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl text-xs font-black text-slate-900 dark:text-white group-hover:bg-rose-500 group-hover:text-white transition-colors">
                          R$ {level.price}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-center text-slate-400 px-6 font-medium italic">
                    * Transação processada com segurança pela {window.navigator.userAgent.includes('Android') ? 'Google Play' : 'App Store'}.
                  </p>
                  
                  <button 
                    onClick={() => setIsDonationModalOpen(false)}
                    className="w-full py-4 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                  >
                    Agora não, obrigado
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Câmera / Galeria Modal */}
        <AnimatePresence>
          {isPhotoPromptOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6"
            >
              <div 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                onClick={() => setIsPhotoPromptOpen(false)}
              ></div>
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col p-6 space-y-4"
              >
                <div className="flex flex-col items-center mb-2">
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Foto de Perfil</h3>
                  <p className="text-xs text-slate-500 font-medium text-center">Escolha um avatar ou envie sua própria foto</p>
                </div>

                <div className="mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Avatares Prontos</p>
                  <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x px-1">
                    {avatars.map((av, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSelectAvatar(av)}
                        className={`size-16 shrink-0 rounded-full border-4 shadow-sm bg-slate-100 dark:bg-slate-800 bg-cover bg-center snap-center transition-all ${userPhoto === av ? 'border-primary shadow-primary/20' : 'border-white dark:border-slate-900 hover:border-primary/50'}`}
                        style={{ backgroundImage: `url('${av}')` }}
                      ></button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleTakePhoto('CAMERA')}
                    className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary-dark transition-all active:scale-[0.98]"
                  >
                    <CameraIcon size={20} />
                    Tirar Nova Foto
                  </button>
                  <button 
                    onClick={() => handleTakePhoto('PHOTOS')}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    Escolher da Galeria
                  </button>
                  <button 
                    onClick={() => setIsPhotoPromptOpen(false)}
                    className="w-full py-4 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest mt-2"
                  >
                    Cancelar e Fechar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer Navigation constant across all screens, except during prayer */}
      {!['prayer', 'bible', 'onboarding'].includes(currentScreen) && (
        <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}
    </div>
  );
}
