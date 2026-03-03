import { Settings, Award, Flame, Check, Moon, Sun, Info, X as CloseIcon, Church, BookOpen, ChevronRight, ChevronDown, Lock, PlayCircle, Heart } from 'lucide-react';
import { Screen } from '../App';
import { useState, useEffect } from 'react';
import { Artwork } from '../services/artService';
import avPadrao from '../assets/avatares/padrao.png';
import { AdMob, RewardInterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
  dailyArt: Artwork | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userName: string;
  userPhoto: string | null;
  streak: number;
  totalPrayers: number;
  dailyHistory: string[];
  dailyVerse: { text: string; reference: string } | null;
  onOpenPremium: () => void;
  onNovenaComplete?: () => void;
}

export default function Home({ 
  onNavigate, 
  dailyArt, 
  isDarkMode, 
  onToggleDarkMode, 
  userName, 
  userPhoto,
  streak,
  totalPrayers,
  dailyHistory,
  dailyVerse,
  onOpenPremium,
  onNovenaComplete
}: HomeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [novena, setNovena] = useState<any>(null);
  const [showNovenaModal, setShowNovenaModal] = useState(false);
  const [novenaDay, setNovenaDay] = useState(0);
  const [novenaProgress, setNovenaProgress] = useState<number[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    fetch('https://api-novena.vercel.app/api/novenas')
      .then(r => r.json())
      .then(data => {
        const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date()).toLowerCase();
        const novenasThisMonth = data[monthName];
        if (novenasThisMonth && novenasThisMonth.length > 0) {
          const fetchedNovena = novenasThisMonth[0];
          setNovena(fetchedNovena);
          const savedProgress = localStorage.getItem(`novena_progress_${fetchedNovena.title}`);
          if (savedProgress) {
            try {
               setNovenaProgress(JSON.parse(savedProgress));
            } catch(e) {}
          }
        }
      })
      .catch(console.error);
  }, []);

  const [isAdFailed, setIsAdFailed] = useState(false);

  useEffect(() => {
    const initAd = async () => {
      if (parseInt(localStorage.getItem('rosario_supporter_level') || '0', 10) > 0 || Capacitor.getPlatform() !== 'android') return;
      try {
        await AdMob.initialize({});
        await AdMob.prepareRewardInterstitialAd({
          adId: 'ca-app-pub-5471973562089914/4377350660',
          isTesting: false
        });
      } catch (e) {
        console.warn('Erro ao carregar anúncio', e);
        setIsAdFailed(true);
      }
    };
    initAd();
  }, []);

  const toggleNovenaDay = (dayIndex: number) => {
    let newProgress = [...novenaProgress];
    const isCompleting = !newProgress.includes(dayIndex);
    const maxDays = novena?.content?.length || 9;
    const wasCompleted = novenaProgress.length === maxDays;

    if (isCompleting) {
      newProgress.push(dayIndex);
    } else {
      newProgress = newProgress.filter(d => d !== dayIndex);
    }
    setNovenaProgress(newProgress);
    if(novena) {
      localStorage.setItem(`novena_progress_${novena.title}`, JSON.stringify(newProgress));
    }
    
    const isNowCompleted = newProgress.length === maxDays;

    // Mostra o popup se marcou como concluído e atualiza as estatísticas
    if (isCompleting) {
      if (!wasCompleted && isNowCompleted && onNovenaComplete) {
        onNovenaComplete();
      }
      setShowCompletionModal(true);
    }
  };

  const handleWatchAd = async () => {
    if (Capacitor.getPlatform() !== 'android' || isAdFailed) {
      setShowCompletionModal(false);
      return;
    }
    try {
      const dismissListener = await AdMob.addListener(RewardInterstitialAdPluginEvents.Dismissed, () => {
         dismissListener.remove();
         setShowCompletionModal(false);
      });
      await AdMob.showRewardInterstitialAd();
    } catch (e) {
      console.warn('Erro ao exibir anúncio', e);
      setShowCompletionModal(false);
    }
  };

  const handleNextDay = () => {
    setShowCompletionModal(false);
    if (novena?.content && novenaDay < novena.content.length - 1) {
      setNovenaDay(novenaDay + 1);
    }
  };
  
  const today = new Date();
  
  let novenaStatus = '';
  let showNovenaBanner = false;
  let showProgressBar = false;

  if (novena) {
    try {
      const startDayMatch = novena.starts.match(/\d+/);
      const feastDayMatch = novena.feast.match(/\d+/);
      const todayDate = today.getDate();
      
      if (startDayMatch && feastDayMatch) {
         const startD = parseInt(startDayMatch[0]);
         const feastD = parseInt(feastDayMatch[0]);
         
         const hasStarted = novenaProgress.length > 0;
         showNovenaBanner = true;
         
         if (todayDate < startD) {
           const diff = startD - todayDate;
           novenaStatus = `Falta${diff > 1 ? 'm' : ''} ${diff} dia${diff > 1 ? 's' : ''}`;
           if (hasStarted) showProgressBar = true;
         } else if (todayDate <= feastD) {
           novenaStatus = `${novenaProgress.length}/${novena?.content?.length || 9} Dias Concluídos`;
           showProgressBar = true;
         } else {
           novenaStatus = 'Finalizada';
           showProgressBar = true;
         }
      } else {
         showNovenaBanner = true;
      }
    } catch(e) {}
  }

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
        <div className="flex flex-col gap-1 rounded-2xl bg-white dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex items-center gap-2 text-primary">
            <Award size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Terços</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalPrayers} <span className="text-xs font-medium text-slate-500">Reza{totalPrayers === 1 ? 'da' : 'das'}</span>
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-white dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex items-center gap-2 text-accent-gold">
            <Flame size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Ofensiva</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{streak} <span className="text-xs font-medium text-slate-500">{streak === 1 ? 'Dia' : 'Dias'}</span></p>
        </div>
      </div>

      {/* Mystery Card - Only show if online */}
      {window.navigator.onLine && dailyArt && (
        <div className="px-6 py-4">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl h-56 border border-slate-800/50 group">
            {!imageLoaded && (
               <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
                  <div className="size-8 border-4 border-slate-600 border-t-primary rounded-full animate-spin"></div>
               </div>
            )}
            <img 
              src={dailyArt.url} 
              alt={dailyArt.title}
              onLoad={() => setImageLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tizian_041.jpg/800px-Tizian_041.jpg';
                setImageLoaded(true);
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
            
            <div className={`absolute bottom-0 left-0 p-6 w-full flex flex-col gap-1 z-10 transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-1 rounded-lg bg-primary text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                  Hoje
                </span>
              </div>
              <h3 className="text-xl font-black text-white leading-tight">{currentMystery.name}</h3>
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/10">
                <p className="text-slate-300 text-xs italic line-clamp-2 flex-1">Arte: {dailyArt.title}</p>
                <button 
                  onClick={() => setShowDetails(true)}
                  className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-white/20 shrink-0 hover:bg-white/20 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Info size={14} />
                  Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
            <div className="relative h-64 shrink-0 bg-slate-100 dark:bg-slate-800">
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
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
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

      {/* Novena Banner */}
      {novena && showNovenaBanner && (
        <div className="px-6 py-2">
          <div 
             onClick={() => {
               // Encontra o próximo dia não completado
               const maxDays = novena.content?.length || 9;
               let nextDay = 0;
               for (let i = 0; i < maxDays; i++) {
                 if (!novenaProgress.includes(i)) {
                   nextDay = i;
                   break;
                 }
               }
               // Se tudo completou (ex: dia 9 pronto e abriu dnv), pode abrir no ultimo
               if (novenaProgress.length === maxDays) {
                 nextDay = maxDays - 1;
               }
               setNovenaDay(nextDay);
               setShowNovenaModal(true);
             }}
             className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 shadow-sm cursor-pointer hover:border-primary/30 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center justify-between relative z-10 w-full">
              <div className="flex flex-col flex-1 pb-1">
                <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1.5 flex items-center gap-1.5"><Church size={12} className="text-primary" /> {showProgressBar ? 'Novena Atual' : (novenaStatus || 'Novena Atual')}</span>
                <h4 className="text-slate-900 dark:text-white font-bold text-base leading-tight pr-4 mb-1">{novena.title}</h4>
                {showProgressBar ? (
                  <div className="w-full mt-2 pr-6">
                     <div className="flex items-center justify-between gap-4 mb-1.5">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{novenaStatus}</span>
                       <span className="text-[10px] font-black text-primary">{Math.round((novenaProgress.length / (novena?.content?.length || 9)) * 100)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(novenaProgress.length / (novena?.content?.length || 9)) * 100}%` }}></div>
                     </div>
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{novena.starts} — {novena.feast}</p>
                )}
              </div>
              <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 ml-4">
                 <ChevronRight className="text-primary size-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Novena Modal */}
      {showNovenaModal && novena && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-bottom duration-300">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0 z-10">
            <div className="flex-1 min-w-0 pr-4">
               <span className="text-primary text-[10px] font-black uppercase tracking-widest block mb-1">Novena Diária</span>
               <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight truncate">{novena.title}</h3>
            </div>
            <button 
              onClick={() => setShowNovenaModal(false)}
              className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              <CloseIcon size={20} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950">
            <div className="flex overflow-x-auto custom-scrollbar p-4 gap-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0 snap-x">
              {novena.content?.map((d: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setNovenaDay(idx)}
                  className={`px-4 py-2 shrink-0 text-xs font-black uppercase tracking-widest rounded-xl transition-all snap-center flex items-center gap-1.5 ${novenaDay === idx ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                >
                  {d.day}
                  {novenaProgress.includes(idx) && <Check size={14} strokeWidth={3} className={novenaDay === idx ? "text-white" : "text-primary"} />}
                </button>
              ))}
            </div>
            
            <div className="flex-1 relative min-h-0 flex flex-col">
              <div 
                 className="absolute inset-0 overflow-y-auto p-6 md:p-8 font-serif leading-loose text-lg text-slate-800 dark:text-slate-200 custom-scrollbar"
                 onScroll={(e) => {
                    const target = e.target as HTMLDivElement;
                    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
                       setShowArrow(false);
                    } else {
                       setShowArrow(true);
                    }
                 }}
              >
                <div className="max-w-prose mx-auto space-y-6 pb-20">
                  {novena.content?.[novenaDay]?.prayers?.map((line: string, i: number) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    const isHeading = trimmed === trimmed.toUpperCase() && trimmed.length > 5;
                    const isDialogue = trimmed.startsWith('V.') || trimmed.startsWith('R.');
                    
                    return (
                     <p key={i} className={`
                        ${isHeading ? 'text-xl font-black text-primary not-italic font-display mt-8 mb-4 border-b-2 border-primary/10 pb-2 text-center' : ''}
                        ${isDialogue ? 'pl-4 border-l-2 border-slate-200 dark:border-slate-800 italic' : ''}
                        ${!isHeading && !isDialogue && i === 1 ? 'first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-primary' : ''}
                     `}>
                       {trimmed}
                     </p>
                    )
                  })}
                </div>
              </div>
              
              {showArrow && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 pt-20 pointer-events-none z-10 opacity-50 bg-gradient-to-t from-white dark:from-slate-950 to-transparent transition-opacity">
                   <div className="animate-bounce">
                      <ChevronDown size={32} className="text-primary" />
                   </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
               <button 
                 onClick={() => toggleNovenaDay(novenaDay)}
                 className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all active:scale-95 ${novenaProgress.includes(novenaDay) ? 'bg-primary/10 text-primary border-2 border-primary/20' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}
               >
                 <Check size={20} className={novenaProgress.includes(novenaDay) ? 'opacity-100' : 'opacity-50'} />
                 {novenaProgress.includes(novenaDay) ? 'Novena Concluída' : 'Marcar como Rezada'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Novena Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] w-full max-w-sm shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-[10%] right-[10%] opacity-5 dark:opacity-10 translate-x-1/2 -translate-y-1/4 pointer-events-none">
               <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-12 transform text-slate-900 dark:text-white"><path d="M12 2v20M5 8h14"/></svg>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 relative z-10 text-center">Dia Concluído!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center relative z-10">Obrigado por perseverar na novena.<br/>Como deseja continuar?</p>
            
            <div className="flex flex-col gap-3 w-full relative z-10 pt-2">
               {novena?.content && novenaDay < novena.content.length - 1 && (
                 <button onClick={handleNextDay} className="bg-primary text-white shadow-xl shadow-primary/25 py-4 rounded-[20px] font-black text-sm hover:bg-primary-dark transition-all active:scale-[0.98] w-full text-center">
                   Ir para o próximo dia
                 </button>
               )}

               {parseInt(localStorage.getItem('rosario_supporter_level') || '0', 10) === 0 && (
                 <button onClick={handleWatchAd} className="bg-slate-100 dark:bg-slate-800 text-slate-500 py-4 rounded-[20px] font-bold text-sm text-center active:scale-[0.98] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full group">
                  <div className="flex items-center">
                    <span className="flex items-center justify-center mx-auto gap-2">
                      Apoiar projeto (Anúncio) 
                    <Heart size={14} fill="currentColor" />
                    </span>
                  </div>
                 </button>
               )}
               
               <button onClick={() => { setShowCompletionModal(false); setShowNovenaModal(false); }} className="mt-2 text-slate-400 dark:text-slate-500 font-bold text-xs py-3 rounded-[20px] hover:text-slate-600 dark:hover:text-slate-300 transition-colors uppercase tracking-widest text-center w-full">
                 Voltar para o Menu
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


