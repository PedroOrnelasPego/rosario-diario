import { ChevronLeft, Volume2, RotateCw, Vibrate, BookOpen, ChevronRight, AlarmClock } from 'lucide-react';
import { Screen } from '../App';
import { useState, useEffect } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface AlarmProps {
  onNavigate: (screen: Screen) => void;
  alarms: { hour: number; minute: number; enabled: boolean }[];
  setAlarms: (alarms: { hour: number; minute: number; enabled: boolean }[]) => void;
  sound: string;
  setSound: (sound: string) => void;
}

export default function Alarm({ onNavigate, alarms, setAlarms, sound, setSound }: AlarmProps) {
  const [autoStart, setAutoStart] = useState(true);
  const [vibrate, setVibrate] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const sounds = [
    { name: 'Gregoriano', url: '/sounds/gregoriano.mp3' },
    { name: 'Sinos', url: '/sounds/sinos.mp3' },
    { name: 'Natureza', url: '/sounds/natureza.mp3' },
    { name: 'Harpa', url: '/sounds/harpa.mp3' }
  ];

  const adjustHour = async (delta: number) => {
    if (alarms.length === 0) return;
    const newAlarms = [...alarms];
    let newHour = (newAlarms[selectedIdx].hour + delta + 24) % 24;
    newAlarms[selectedIdx].hour = newHour;
    setAlarms(newAlarms);
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
  };

  const adjustMinute = async (delta: number) => {
    if (alarms.length === 0) return;
    const newAlarms = [...alarms];
    let newMinute = (newAlarms[selectedIdx].minute + delta + 60) % 60;
    newAlarms[selectedIdx].minute = newMinute;
    setAlarms(newAlarms);
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
  };

  const addAlarm = () => {
    if (alarms.length < 3) {
      setAlarms([...alarms, { hour: 6, minute: 0, enabled: true }]);
      setSelectedIdx(alarms.length);
    }
  };

  const removeAlarm = (idx: number) => {
    const newAlarms = alarms.filter((_, i) => i !== idx);
    setAlarms(newAlarms);
    if (selectedIdx >= newAlarms.length) {
      setSelectedIdx(Math.max(0, newAlarms.length - 1));
    }
  };

  const toggleAlarm = (idx: number) => {
    const newAlarms = [...alarms];
    newAlarms[idx].enabled = !newAlarms[idx].enabled;
    setAlarms(newAlarms);
  };

  const togglePreview = async () => {
    const navApp = (window as any).NativeApp;
    if (isPreviewing) {
      if (navApp) {
        navApp.stopRingtonePreview();
      } else {
        const audio = document.getElementById('preview-audio') as HTMLAudioElement;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
      setIsPreviewing(false);
    } else {
      setIsPreviewing(true);
      if (vibrate) {
        try { await Haptics.impact({ style: ImpactStyle.Heavy }); } catch (e) {}
      }
      if (navApp) {
        navApp.playRingtonePreview();
        setTimeout(() => setIsPreviewing(false), 5000); // Auto stop preview after 5s
      } else {
        const selectedSound = sounds.find(s => s.name === sound);
        if (selectedSound) {
          const audio = document.getElementById('preview-audio') as HTMLAudioElement;
          if (audio) {
             audio.src = selectedSound.url;
             audio.play().catch(e => {
               console.error("Error playing audio:", e);
               setIsPreviewing(false);
             });
             audio.onended = () => setIsPreviewing(false);
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <audio id="preview-audio" className="hidden" />
      {/* Top Header */}
      <div className="flex items-center p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <button onClick={() => onNavigate('home')} className="text-slate-400 dark:text-slate-100 size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="flex-1 text-center text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Alarme de Oração</h2>
        <button onClick={() => onNavigate('home')} className="text-primary font-black text-sm pr-2">Salvar</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-40">
        <h3 className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] text-center mb-6">Horário de Despertar</h3>
        
        {/* Multiple Alarms Selector */}
        <div className="flex flex-col gap-3 mb-8">
          {alarms.map((alarm, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${selectedIdx === idx ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
            >
              <div className="flex flex-col">
                <span className={`text-2xl font-black ${selectedIdx === idx ? 'text-primary' : 'text-slate-800 dark:text-slate-200'}`}>
                  {String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Alarme {idx + 1}</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAlarm(idx);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${alarm.enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${alarm.enabled ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
                {alarms.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAlarm(idx);
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}

          {alarms.length < 3 && (
            <button 
              onClick={addAlarm}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              + Adicionar Alarme
            </button>
          )}
        </div>

        {/* Interactive 24h Time Picker */}
        {alarms.length > 0 && (
          <div className="flex justify-center items-center gap-4 mb-10 select-none">
            {/* Hours */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => adjustHour(-1)} className="text-slate-300 dark:text-slate-700 hover:text-primary transition-colors"><ChevronRight size={32} className="-rotate-90" /></button>
              <div className="bg-white dark:bg-slate-900 size-24 rounded-[32px] flex items-center justify-center border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{String(alarms[selectedIdx].hour).padStart(2, '0')}</span>
              </div>
              <button onClick={() => adjustHour(1)} className="text-slate-300 dark:text-slate-700 hover:text-primary transition-colors"><ChevronRight size={32} className="rotate-90" /></button>
            </div>
            
            <div className="text-4xl font-black text-primary animate-pulse opacity-30">:</div>
            
            {/* Minutes */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => adjustMinute(-1)} className="text-slate-300 dark:text-slate-700 hover:text-primary transition-colors"><ChevronRight size={32} className="-rotate-90" /></button>
              <div className="bg-white dark:bg-slate-900 size-24 rounded-[32px] flex items-center justify-center border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{String(alarms[selectedIdx].minute).padStart(2, '0')}</span>
              </div>
              <button onClick={() => adjustMinute(1)} className="text-slate-300 dark:text-slate-700 hover:text-primary transition-colors"><ChevronRight size={32} className="rotate-90" /></button>
            </div>
          </div>
        )}

        {/* Settings Cards */}
        <div className="space-y-4">
          {/* Sound Selection */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                  <Volume2 size={20} />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">Tom do Alarme</span>
              </div>
              <button 
                onClick={togglePreview}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all ${
                  isPreviewing ? 'bg-primary text-white scale-105' : 'bg-slate-100 dark:bg-slate-800 text-primary hover:bg-primary/5'
                }`}
              >
                {isPreviewing ? 'Parar Prévia' : 'Ouvir Prévia'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sounds.map(s => (
                <button 
                  key={s.name}
                  onClick={() => {
                    setSound(s.name);
                    if (isPreviewing) {
                       const audio = document.getElementById('preview-audio') as HTMLAudioElement;
                       if (audio) {
                         audio.src = s.url;
                         audio.play();
                       }
                    }
                  }}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border-2 ${
                    sound === s.name
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                  <RotateCw size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Terço Automático</p>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Abrir ao desligar</p>
                </div>
              </div>
              <button 
                onClick={() => setAutoStart(!autoStart)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${autoStart ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${autoStart ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
            </div>
            
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                  <Vibrate size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Vibração Suave</p>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Toque tátil no alarme</p>
                </div>
              </div>
              <button 
                onClick={() => setVibrate(!vibrate)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${vibrate ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${vibrate ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
