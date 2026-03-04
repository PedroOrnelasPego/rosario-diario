import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import Home from './components/Home';
import Prayer from './components/Prayer';
import Onboarding from './components/Onboarding';
import { Artwork, getDailyArtImage } from './services/artService';
import { 
  Library, PencilLine, User, Sparkles, X, Activity, History, ShieldCheck, Download, Clock, Flame, Award, Moon, CheckCircle2, Heart, Camera as CameraIcon, BookOpen, Church, Trash2
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
  <div className={`p-4 rounded-3xl border-2 transition-all ${earned ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
    <div className="flex items-center gap-4 mb-3">
      <div className={`size-10 rounded-2xl flex items-center justify-center ${earned ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
        <Icon size={20} />
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

export type Screen = 'home' | 'prayer' | 'settings' | 'library' | 'bible' | 'diary' | 'profile' | 'edit-profile' | 'history';

import Navigation from './components/Navigation';
import AppSettings from './components/Settings';
import LibraryComponent from './components/Library';
import DiaryComponent from './components/Diary';
import ProfileComponent from './components/Profile';
import BibleComponent from './components/Bible';
import HistoryComponent from './components/History';
import { BibleVerse, getDailyVerse, getPsalmOfDay } from './services/bibleService';
import { scheduleNotifications } from './services/notificationService';

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
      audioAlerts: true,
      prayerHaptics: true,
      dailyProverbs: true,
      novena: true,
    };
  });
  // Stats State
  const [totalPrayers, setTotalPrayers] = useState(0);
  const [totalNovenas, setTotalNovenas] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dailyHistory, setDailyHistory] = useState<string[]>([]);
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [psalmOfDay, setPsalmOfDay] = useState<BibleVerse | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userNameSubtitle, setUserNameSubtitle] = useState(() => {
    return localStorage.getItem('rosario_user_subtitle') || 'Fiel de Maria';
  });
  const [supporterLevel, setSupporterLevel] = useState(() => {
    return parseInt(localStorage.getItem('rosario_supporter_level') || '0', 10);
  });
  const [purchasedDonations, setPurchasedDonations] = useState<string[]>(() => {
    const saved = localStorage.getItem('rosario_purchased_donations');
    return saved ? JSON.parse(saved) : [];
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [novenaLoaded, setNovenaLoaded] = useState(false);

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
    const initNativeFeatures = async () => {
      try {
        if (Capacitor.getPlatform() === 'android') {
          await AdMob.initialize({});
        }
      } catch (err) {
        console.warn('Native features init error', err);
      }
    };
    initNativeFeatures();
  }, []);

  useEffect(() => {
    localStorage.setItem('rosario_prayer_typography', JSON.stringify(prayerTypography));
  }, [prayerTypography]);

  useEffect(() => {
    localStorage.setItem('rosario_notifications_config', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    scheduleNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('rosario_supporter_level', String(supporterLevel));
  }, [supporterLevel]);

  useEffect(() => {
    localStorage.setItem('rosario_purchased_donations', JSON.stringify(purchasedDonations));
  }, [purchasedDonations]);

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
      setTotalPrayers(data.totalPrayers || 0);
      setTotalNovenas(data.totalNovenas || 0);
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
    
    getDailyArtImage(currentMysteryName, dateStr).then(art => {
      setDailyArt(art);
    });
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handlePrayerComplete = () => {
    const now = new Date();
    const timeZoneOffset = now.getTimezoneOffset() * 60000;
    const today = new Date(now.getTime() - timeZoneOffset).toISOString().split('T')[0];
    
    const yesterdayDate = new Date(now.getTime() - timeZoneOffset);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];
    
    const newHistory = [...dailyHistory];
    let newStreak = streak;
    
    if (!newHistory.includes(today)) {
      newHistory.push(today);
      if (dailyHistory.includes(yesterday)) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else if (newStreak === 0 && newHistory.includes(today)) {
      newStreak = 1;
    }

    const newTotal = totalPrayers + 1;
    setTotalPrayers(newTotal);
    setDailyHistory(newHistory);
    setStreak(newStreak);

    // Update localStorage
    const savedData = localStorage.getItem('rosario_user_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      data.totalPrayers = newTotal;
      data.dailyHistory = newHistory;
      data.streak = newStreak;
      localStorage.setItem('rosario_user_data', JSON.stringify(data));
    }
  };

  const handleNovenaComplete = () => {
    const newTotal = totalNovenas + 1;
    setTotalNovenas(newTotal);

    const savedData = localStorage.getItem('rosario_user_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      data.totalNovenas = newTotal;
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
    notifications: boolean;
    dailyProverbs: boolean;
    novenaNotifications: boolean;
    theme: 'light' | 'dark';
  }) => {
    setUserName(data.name);
    setUserPhoto(data.photo);
    setNotifications(prev => ({...prev, reminders: data.notifications, dailyMystery: data.notifications, dailyProverbs: data.dailyProverbs, novena: data.novenaNotifications}));
    localStorage.setItem('rosario_user_data', JSON.stringify({
      name: data.name,
      photo: data.photo
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

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    console.log("Account deletion initiated.");
    // For now, just clear local storage and reset state
    localStorage.clear();
    setIsFirstTime(true);
    setCurrentScreen('home');
    setUserName('Maria Silva');
    setUserPhoto(null);
    setTotalPrayers(0);
    setTotalNovenas(0);
    setStreak(0);
    setDailyHistory([]);
    setUserNameSubtitle('Fiel de Maria');
    setSupporterLevel(0);
    setPurchasedDonations([]);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className={`mx-auto md:max-w-none max-w-[430px] h-[100dvh] w-full flex flex-col relative overflow-hidden shadow-2xl ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {isFirstTime ? (
        <Onboarding 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={toggleDarkMode} 
          onComplete={handleOnboardingComplete} 
          onPhotoUpload={handlePhotoUploadTrigger}
          userPhoto={userPhoto}
        />
      ) : (
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
                userName={userName}
                userPhoto={userPhoto}
                streak={streak}
                totalPrayers={totalPrayers}
                dailyHistory={dailyHistory}
                dailyVerse={dailyVerse}
                onNovenaComplete={handleNovenaComplete}
              />
            )}
            {currentScreen === 'prayer' && (
              <Prayer 
                onNavigate={setCurrentScreen} 
                dailyArt={dailyArt} 
                onComplete={handlePrayerComplete}
                onOpenPremium={() => setIsPremiumModalOpen(true)}
                typography={prayerTypography}
                hapticsEnabled={notifications.prayerHaptics ?? true}
                supporterLevel={supporterLevel}
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
                  onOpenDelete={() => setIsDeleteModalOpen(true)}
                />
              )}
            {currentScreen === 'library' && (
              <LibraryComponent 
                onNavigate={setCurrentScreen} 
                psalmOfDay={psalmOfDay}
                onOpenPremium={() => setIsPremiumModalOpen(true)}
                supporterLevel={supporterLevel}
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
                  totalNovenas={totalNovenas}
                  streak={streak}
                  dailyHistory={dailyHistory}
                  userNameSubtitle={userNameSubtitle}
                  supporterLevel={supporterLevel}
                  onOpenPremium={() => setIsPremiumModalOpen(true)}
                  onOpenAchievements={() => setIsAchievementsModalOpen(true)}
                  onOpenDonation={() => setIsDonationModalOpen(true)}
                  onOpenDelete={() => setIsDeleteModalOpen(true)}
                />
              )}
            {currentScreen === 'history' && (
              <HistoryComponent 
                onNavigate={setCurrentScreen}
                dailyHistory={dailyHistory}
                totalPrayers={totalPrayers}
                streak={streak}
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
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[92dvh]"
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
                  <div className="h-44 bg-primary relative overflow-hidden">
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
                    {/* Small Donation Link at the top */}
                    <button 
                      onClick={() => {
                        setIsPremiumModalOpen(false);
                        setTimeout(() => setIsDonationModalOpen(true), 150);
                      }}
                      className="w-full text-center text-[11px] font-black text-slate-500 hover:text-rose-600 transition-colors flex items-center justify-center gap-1.5 -mt-2 mb-2 uppercase tracking-widest"
                    >
                      <Heart size={14} fill="currentColor" className="text-rose-500" />
                      Fazer Doação
                    </button>

                    {/* Prominent Subscription Button with Price */}
                    <button className="w-full bg-primary text-white font-black py-4 px-6 rounded-[28px] shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all active:scale-[0.98] flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-lg">Assinar Premium</span>
                        <span className="text-[10px] text-white/70 italic"><Clock size={10} className="inline mr-1" />Teste grátis de 7 dias</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-white/70 mr-1">R$</span>
                        <span className="text-2xl">11,90</span>
                        <span className="text-[10px] text-white/70">/mês</span>
                      </div>
                    </button>

                    {/* Features List below the CTA */}
                    <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2 text-center">O que você ganha:</p>
                      <PremiumFeatureItem icon={Activity} title="Dashboard Detalhado" description="Acompanhe sua evolução diária com gráficos." />
                      <PremiumFeatureItem icon={History} title="Histórico Completo" description="Veja todas as suas orações passadas." />
                      <PremiumFeatureItem icon={ShieldCheck} title="Sem Anúncios" description="Uma experiência focada 100% na sua fé." />
                      <PremiumFeatureItem icon={Download} title="Bíblia Offline" description="Acesse a Palavra sem precisar de internet." />
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
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 shrink-0">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Suas Conquistas</h2>
                  <button 
                    onClick={() => setIsAchievementsModalOpen(false)}
                    className="size-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-3 max-h-[70vh]">
                  <AchievementBlock 
                    title="Iniciante na Fé" 
                    desc="Completou o primeiro terço" 
                    progress={Math.min((totalPrayers/1)*100, 100)} 
                    total={1} 
                    current={Math.min(totalPrayers, 1)}
                    earned={totalPrayers >= 1}
                    icon={Sparkles}
                  />
                  <AchievementBlock 
                    title="Fiel Constante" 
                    desc="Rezar por 7 dias seguidos" 
                    progress={Math.min((streak/7)*100, 100)} 
                    total={7} 
                    current={Math.min(streak, 7)}
                    earned={streak >= 7}
                    icon={Flame}
                  />
                  <AchievementBlock 
                    title="Devoto de Maria" 
                    desc="Completar 12 terços" 
                    progress={Math.min((totalPrayers/12)*100, 100)} 
                    total={12} 
                    current={Math.min(totalPrayers, 12)}
                    earned={totalPrayers >= 12}
                    icon={Award}
                  />
                  <AchievementBlock 
                    title="Guardião da Alvorada" 
                    desc="Rezar antes das 08:00 por 3 dias" 
                    progress={0} 
                    total={3} 
                    current={0}
                    earned={false}
                    icon={Moon}
                  />
                  <AchievementBlock 
                    title="Estudioso da Palavra" 
                    desc="Ler 5 capítulos da Bíblia" 
                    progress={0} 
                    total={5} 
                    current={0}
                    earned={false}
                    icon={BookOpen}
                  />
                  <AchievementBlock 
                    title="Alma Generosa" 
                    desc="Fazer pelo menos uma doação" 
                    progress={supporterLevel > 0 ? 100 : 0} 
                    total={1} 
                    current={supporterLevel > 0 ? 1 : 0}
                    earned={supporterLevel > 0}
                    icon={Heart}
                  />
                  <AchievementBlock 
                    title="Perseverança da Novena" 
                    desc="Participar de 12 novenas completas" 
                    progress={Math.min((totalNovenas/12)*100, 100)} 
                    total={12} 
                    current={Math.min(totalNovenas, 12)}
                    earned={totalNovenas >= 12}
                    icon={Church}
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
                    Sua contribuição ajuda a manter o app no ar e gratuito para milhares de pessoas. Ao apoiar, você ganha o <span className="text-rose-500 font-black italic">Coração Solidário</span> no seu perfil!
                  </p>
                </div>

                <div className="p-8 pt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'coffee', label: 'Um Cafézinho', price: '4,90', icon: '☕' },
                      { id: 'rosary', label: 'Um Terço', price: '14,90', icon: '📿' },
                      { id: 'church', label: 'Ajuda Generosa', price: '49,90', icon: '⛪' }
                    ].map((levelItem) => {
                      const isPurchased = purchasedDonations.includes(levelItem.id);
                      return (
                        <button 
                          key={levelItem.id}
                          disabled={isPurchased}
                          onClick={() => {
                            if (!isPurchased) {
                              // Simulating IAP success
                              setSupporterLevel(prev => Math.min(prev + 1, 3));
                              setPurchasedDonations(prev => [...prev, levelItem.id]);
                            }
                          }}
                          className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all group ${
                            isPurchased 
                            ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed' 
                            : 'border-slate-100 dark:border-slate-800 hover:border-rose-500/30 hover:bg-rose-50/30 dark:hover:bg-rose-900/10 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`text-2xl ${isPurchased ? 'grayscale' : ''}`}>{levelItem.icon}</span>
                            <div className="text-left">
                              <span className="text-sm font-black text-slate-900 dark:text-white block">{levelItem.label}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                {isPurchased ? 'Doação Realizada' : 'Fazer Doação'}
                              </span>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-2xl text-xs font-black transition-colors ${
                            isPurchased 
                            ? 'bg-transparent text-slate-400' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-rose-500 group-hover:text-white'
                          }`}>
                            {isPurchased ? <CheckCircle2 size={16} className="text-green-500" /> : `R$ ${levelItem.price}`}
                          </span>
                        </button>
                      );
                    })}
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

        {/* Delete Account Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[130] flex items-center justify-center p-6"
            >
              <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                onClick={() => setIsDeleteModalOpen(false)}
              ></div>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col p-8 text-center"
              >
                <div className="size-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6">
                  <Trash2 size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Apagar Conta?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                  Tem certeza que deseja apagar sua conta? Esta ação é irreversível e todo seu progresso será perdido para sempre.
                </p>
                
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="w-full bg-red-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all active:scale-[0.98]"
                  >
                    Sim, Apagar Tudo
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="w-full py-4 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest mt-2"
                  >
                    Não, Manter Minha Fé
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      )}
      
      {/* Footer Navigation constant across all screens, except during prayer */}
      {!['prayer', 'bible', 'onboarding'].includes(currentScreen) && (
        <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}
    </div>
  );
}
