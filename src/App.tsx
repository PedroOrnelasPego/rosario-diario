import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Home from './components/Home';
import Prayer from './components/Prayer';
import Alarm from './components/Alarm';
import Onboarding from './components/Onboarding';
import { Artwork, getDailyArtImage } from './services/artService';
import { Library, PencilLine, User } from 'lucide-react';

export type Screen = 'home' | 'prayer' | 'alarm' | 'settings' | 'library' | 'diary' | 'profile' | 'edit-profile';

import Navigation from './components/Navigation';
import AppSettings from './components/Settings';
import LibraryComponent from './components/Library';
import DiaryComponent from './components/Diary';
import ProfileComponent from './components/Profile';
import { BibleVerse, getDailyVerse } from './services/bibleService';

export default function App() {
  const [isFirstTime, setIsFirstTime] = useState(() => !localStorage.getItem('rosario_user_data'));
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [settingsSub, setSettingsSub] = useState<any>('main');
  const [dailyArt, setDailyArt] = useState<Artwork | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userName, setUserName] = useState('Maria Silva');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    reminders: true,
    audioAlerts: false,
    dailyMystery: true,
  });
  
  // Real Alarm State
  const [alarmTime, setAlarmTime] = useState({ hour: 6, minute: 30 });
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmSound, setAlarmSound] = useState('Gregoriano');

  // Stats State
  const [totalPrayers, setTotalPrayers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dailyHistory, setDailyHistory] = useState<string[]>([]);
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);

  useEffect(() => {
    // Load persisted data
    const savedData = localStorage.getItem('rosario_user_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      setUserName(data.name);
      setUserPhoto(data.photo);
      setAlarmTime(data.alarm);
      setTotalPrayers(data.totalPrayers || 0);
      setStreak(data.streak || 0);
      setDailyHistory(data.dailyHistory || []);
      setIsFirstTime(false);
    }
    
    getDailyVerse().then(setDailyVerse);

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

  const variants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 }
  };

  const handleOnboardingComplete = (data: { 
    name: string; 
    photo: string | null; 
    alarm: { hour: number; minute: number; enabled: boolean };
    theme: 'light' | 'dark';
  }) => {
    setUserName(data.name);
    setUserPhoto(data.photo);
    setAlarmTime({ hour: data.alarm.hour, minute: data.alarm.minute });
    setAlarmEnabled(data.alarm.enabled);
    localStorage.setItem('rosario_user_data', JSON.stringify({
      name: data.name,
      photo: data.photo,
      alarm: { hour: data.alarm.hour, minute: data.alarm.minute, enabled: data.alarm.enabled }
    }));
    setIsFirstTime(false);
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const content = readerEvent.target?.result as string;
          setUserPhoto(content);
          // Update localStorage
          const savedData = localStorage.getItem('rosario_user_data');
          if (savedData) {
            const parsed = JSON.parse(savedData);
            parsed.photo = content;
            localStorage.setItem('rosario_user_data', JSON.stringify(parsed));
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (isFirstTime) {
    return (
      <Onboarding 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        onComplete={handleOnboardingComplete} 
      />
    );
  }

  return (
    <div className={`mx-auto max-w-[430px] h-[100dvh] w-full relative overflow-hidden shadow-2xl ${isDarkMode ? 'dark bg-background-dark text-white' : 'bg-background-light text-slate-900'}`}>
      <div className="h-full w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full w-full"
          >
            {currentScreen === 'home' && (
              <Home 
                onNavigate={setCurrentScreen} 
                dailyArt={dailyArt} 
                isDarkMode={isDarkMode} 
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                alarmTime={alarmTime}
                alarmEnabled={alarmEnabled}
                setAlarmEnabled={setAlarmEnabled}
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
              />
            )}
            {currentScreen === 'alarm' && (
              <Alarm 
                onNavigate={setCurrentScreen} 
                time={alarmTime} 
                setTime={setAlarmTime}
                sound={alarmSound}
                setSound={setAlarmSound}
                enabled={alarmEnabled}
                setEnabled={setAlarmEnabled}
              />
            )}
            {currentScreen === 'settings' && (
              <AppSettings 
                onNavigate={setCurrentScreen} 
                isDarkMode={isDarkMode} 
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                userName={userName}
                setUserName={setUserName}
                userPhoto={userPhoto}
                setUserPhoto={setUserPhoto}
                onPhotoUpload={handlePhotoUpload}
                notifications={notifications}
                setNotifications={setNotifications}
                activeSub={settingsSub}
                setActiveSub={setSettingsSub}
              />
            )}
            {currentScreen === 'library' && <LibraryComponent onNavigate={setCurrentScreen} />}
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
                onPhotoUpload={handlePhotoUpload}
                totalPrayers={totalPrayers}
                streak={streak}
                dailyHistory={dailyHistory}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Footer Navigation constant across all screens, except during prayer */}
      {currentScreen !== 'prayer' && (
        <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}
    </div>
  );
}
