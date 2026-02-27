import { Settings, AlarmClock, Flame, PlayCircle, Check, Moon, Sun, Info, X as CloseIcon, Church, BookOpen, ChevronRight, Lock } from 'lucide-react';
import { Screen } from '../App';
import { useState } from 'react';
import { Artwork } from '../services/artService';
import avPadrao from '../assets/avatares/padrao.png';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
  dailyArt: Artwork | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  alarms: { hour: number; minute: number; enabled: boolean }[];
  setAlarms: (alarms: { hour: number; minute: number; enabled: boolean }[]) => void;
  userName: string;
  userPhoto: string | null;
  streak: number;
  totalPrayers: number;
  dailyHistory: string[];
  dailyVerse: { text: string; reference: string } | null;
  onOpenPremium: () => void;
}

export default function Home({ 
  onNavigate, 
  dailyArt, 
  isDarkMode, 
  onToggleDarkMode, 
  alarms, 
  setAlarms, 
  userName, 
  userPhoto,
  streak,
  totalPrayers,
  dailyHistory,
  dailyVerse,
  onOpenPremium
}: HomeProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const today = new Date();
  const dateString = today.toLocaleDateString('pt-BR', { weekday: 'long', month: 'short', day: 'numeric' });
  
  const hour = today.getHours();
  let greeting = 'Bom dia';
  if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
  else if (hour >= 18) greeting = 'Boa noite';

  const dayOfWeek = today.getDay();
  const mysteries = [
    { name: 'Mistérios Gloriosos', desc: 'Domingo', details: 'Neste dia contemplamos a vitória de Cristo sobre a morte e a glória de Sua Mãe Santíssima.' },
    { name: 'Mistérios Gozosos', desc: 'Segunda-feira', details: 'Hoje meditamos sobre a alegria da encarnação e a infância de Jesus.' },
    { name: 'Mistérios Dolorosos', desc: 'Terça-feira', details: 'Dia de acompanhar Jesus em Sua Paixão e Morte por nossa salvação.' },
    { name: 'Mistérios Gloriosos', desc: 'Quarta-feira', details: 'Contemplamos a Ressurreição e a força do Espírito Santo.' },
    { name: 'Mistérios Luminosos', desc: 'Quinta-feira', details: 'Meditemos na vida pública de Jesus, a Luz do Mundo.' },
    { name: 'Mistérios Dolorosos', desc: 'Sexta-feira', details: 'Unimo-nos ao sofrimento de Cristo no Calvário.' },
    { name: 'Mistérios Gozosos', desc: 'Sábado', details: 'Contemplamos a Virgem Maria e os mistérios da alegria.' },
  ];
  const currentMystery = mysteries[dayOfWeek];

  const defaultAvatar = avPadrao;

  return (
    <div className="flex flex-col h-full overflow-y-auto parchment-bg pt-4">
      {/* Header */}
      <div className="flex flex-col p-6 pb-2 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="size-12 shrink-0 rounded-full border-2 border-primary/20 bg-cover bg-center bg-no-repeat shadow-lg bg-slate-100" 
              style={{ backgroundImage: `url('${userPhoto || defaultAvatar}')` }}
            ></div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">{dateString}</p>
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">{greeting}, {userName.split(' ')[0]}</h2>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={onToggleDarkMode} 
              className="flex items-center justify-center rounded-xl size-10 bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all border border-slate-300/50 dark:border-slate-700"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => onNavigate('settings')} 
              className="flex items-center justify-center rounded-xl size-10 bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all border border-slate-300/50 dark:border-slate-700"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Button - Moved to Top */}
      <div className="px-6 py-4">
        <button 
          onClick={() => onNavigate('prayer')}
          className="group flex w-full items-center justify-between gap-4 rounded-3xl bg-primary py-5 px-6 text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98] hover:bg-primary-light hover:shadow-primary/30"
        >
          <div className="flex items-center gap-4">
            <PlayCircle size={32} className="fill-white/20 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="text-xl font-black tracking-tight block">Começar a Rezar</span>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{currentMystery.name}</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/40 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 px-6 py-2">
        <div 
          onClick={() => onNavigate('alarm')}
          className="flex flex-col gap-1 rounded-2xl bg-white dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-2 text-primary">
            <AlarmClock size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Alarme</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {alarms[0] ? `${String(alarms[0].hour).padStart(2, '0')}:${String(alarms[0].minute).padStart(2, '0')}` : '00:00'}
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (alarms.length > 0) {
                  const newAlarms = [...alarms];
                  newAlarms[0].enabled = !newAlarms[0].enabled;
                  setAlarms(newAlarms);
                }
              }}
              className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter transition-all ${alarms[0]?.enabled ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
            >
              {alarms[0]?.enabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-white dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex items-center gap-2 text-accent-gold">
            <Flame size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Ofensiva</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">0 <span className="text-xs font-medium text-slate-500">Dias</span></p>
        </div>
      </div>

      {/* Mystery Card - Only show if online */}
      {window.navigator.onLine && dailyArt && (
        <div className="px-6 py-4">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl h-72 border border-slate-800/50 group">
            <img 
              src={dailyArt.url} 
              alt={dailyArt.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tizian_041.jpg/800px-Tizian_041.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col gap-1 z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-1 rounded-lg bg-primary text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                  Hoje
                </span>
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">{currentMystery.name}</h3>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                <p className="text-slate-300 text-sm italic line-clamp-1 pr-4">Arte: {dailyArt.title}</p>
                <button 
                  onClick={() => setShowDetails(true)}
                  className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-xs font-bold border border-white/20 shrink-0 hover:bg-white/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Info size={14} />
                  Explorar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
            <div className="relative h-[450px]">
              <img 
                src={dailyArt?.url} 
                alt="Arte" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tizian_041.jpg/800px-Tizian_041.jpg';
                }}
              />
              <button 
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 size-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2 block">Curiosidades</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">{currentMystery.name}</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                {currentMystery.details}
              </p>
              {dailyArt?.artist && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Sobre a Obra</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    {dailyArt.title} - {dailyArt.artist}
                  </p>
                </div>
              )}
              <button 
                onClick={() => setShowDetails(false)}
                className="w-full mt-6 bg-primary text-white py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Verse */}
      {dailyVerse && (
        <div className="px-6 py-2">
          <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-primary text-[8px] font-black uppercase tracking-[0.3em] mb-2 block">Versículo do Dia</span>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium italic leading-relaxed mb-3">
                "{dailyVerse.text}"
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                — {dailyVerse.reference}
              </p>
            </div>
            <BookOpen className="absolute -right-4 -bottom-4 size-24 text-slate-100 dark:text-slate-800/20 -rotate-12" />
          </div>
        </div>
      )}


      {/* This Week */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Sua Jornada</h4>
          <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full capitalize">
            {today.toLocaleDateString('pt-BR', { month: 'long' })}
          </span>
        </div>
        <div className="flex justify-between items-center bg-white dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((day, i) => {
            // Get the Monday of current week
            const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)
            const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
            const monday = new Date(today.setDate(diff));
            const dayDate = new Date(monday.setDate(monday.getDate() + i));
            
            const isToday = dayDate.toDateString() === new Date().toDateString();
            const isFuture = dayDate > new Date();
            const dateISO = dayDate.toISOString().split('T')[0];
            const isCompleted = dailyHistory.includes(dateISO);
            
            return (
              <div key={day} className={`flex flex-col items-center gap-3 ${(isFuture && !isToday) ? 'opacity-30' : ''}`}>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500">{day}</span>
                {isCompleted ? (
                   <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                     <Check size={18} strokeWidth={4} />
                   </div>
                ) : isToday ? (
                  <div className="size-9 rounded-full border-2 border-primary flex items-center justify-center text-primary bg-primary/5">
                    <span className="text-xs font-black">{dayDate.getDate()}</span>
                  </div>
                ) : (
                  <div className="size-9 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-600">
                    <span className="text-xs font-bold">{dayDate.getDate()}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


