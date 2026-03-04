import { X, CircleDot, ChevronDown } from 'lucide-react';
import { Screen } from '../App';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Artwork, getMysteryArtList } from '../services/artService';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AdMob, RewardInterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

interface PrayerProps {
  onNavigate: (screen: Screen) => void;
  dailyArt: Artwork | null;
  onComplete: () => void;
  onOpenPremium: () => void;
  typography: {
    fontFamily: string;
    fontSize: string;
    isBold: boolean;
  };
  hapticsEnabled: boolean;
  supporterLevel: number;
}

const INITIAL_PRAYERS = [
  { id: 'sign', name: 'Sinal da Cruz', text: 'Pelo sinal da Santa Cruz, livrai-nos Deus, Nosso Senhor, dos nossos inimigos. Em nome do Pai, do Filho e do Espírito Santo. Amém.' },
  { id: 'creed', name: 'Creio', text: 'Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.' },
  { id: 'ourfather', name: 'Pai Nosso', text: 'Pai Nosso que estais no céu, santificado seja o Vosso nome, venha a nós o Vosso reino, seja feita a Vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas dívidas assim como nós perdoamos aos nossos devedores, e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.' },
  { id: 'hailmary', name: 'Ave Maria (Fé)', text: 'Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, e bendito é o fruto do Vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.' },
  { id: 'hailmary', name: 'Ave Maria (Esperança)', text: 'Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, e bendito é o fruto do Vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.' },
  { id: 'hailmary', name: 'Ave Maria (Caridade)', text: 'Ave Maria, cheia de graça, o Senhor é convosco, bendita sois Vós entre as mulheres, e bendito é o fruto do Vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.' },
  { id: 'glory', name: 'Glória ao Pai', text: 'Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.' },
];

export default function Prayer({ onNavigate, dailyArt, onComplete, onOpenPremium, typography, hapticsEnabled, supporterLevel }: PrayerProps) {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('rosario_prayer_step');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showArrow, setShowArrow] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isAdFailed, setIsAdFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('rosario_prayer_step', step.toString());
  }, [step]);

  useEffect(() => {
    const initAd = async () => {
      if (supporterLevel > 0 || Capacitor.getPlatform() !== 'android') return;
      try {
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
  }, [supporterLevel]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Show arrow if there's content below and we're not at the bottom
      const canScroll = scrollHeight > clientHeight + 5;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
      setShowArrow(canScroll && !isAtBottom);
    }
  };

  useEffect(() => {
    // Check when content changes or initial mount
    const timer = setTimeout(checkScroll, 100);
    // Reset scroll to top
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    return () => clearTimeout(timer);
  }, [step]);
  const totalSteps = INITIAL_PRAYERS.length + (5 * 13) + 1;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mysteries = useMemo(() => [
    { name: 'Mistérios Gloriosos', list: ['A Ressurreição', 'A Ascensão', 'A Vinda do Espírito Santo', 'A Assunção de Maria', 'A Coroação de Maria'] },
    { name: 'Mistérios Gozosos', list: ['A Anunciação', 'A Visitação', 'O Nascimento', 'A Apresentação', 'O Encontro no Templo'] },
    { name: 'Mistérios Dolorosos', list: ['A Agonia no Horto', 'A Flagelação', 'A Coroação de Espinhos', 'O Caminho do Calvário', 'A Crucificação'] },
    { name: 'Mistérios Gloriosos', list: ['A Ressurreição', 'A Ascensão', 'A Vinda do Espírito Santo', 'A Assunção de Maria', 'A Coroação de Maria'] },
    { name: 'Mistérios Luminosos', list: ['O Batismo', 'As Bodas de Caná', 'O Anúncio do Reino', 'A Transfiguração', 'A Instituição da Eucaristia'] },
    { name: 'Mistérios Dolorosos', list: ['A Agonia no Horto', 'A Flagelação', 'A Coroação de Espinhos', 'O Caminho do Calvário', 'A Crucificação'] },
    { name: 'Mistérios Gozosos', list: ['A Anunciação', 'A Visitação', 'O Nascimento', 'A Apresentação', 'O Encontro no Templo'] },
  ], []);
  const currentMysterySet = mysteries[dayOfWeek];

  const artOptions = useMemo(() => getMysteryArtList(currentMysterySet.name), [currentMysterySet.name]);
  const currentArt = useMemo(() => {
    if (step < INITIAL_PRAYERS.length) return dailyArt || artOptions[0];
    const decadeIndex = Math.floor((step - INITIAL_PRAYERS.length) / 13);
    return artOptions[decadeIndex % artOptions.length];
  }, [step, artOptions, dailyArt]);

  const getStepData = () => {
    if (step < INITIAL_PRAYERS.length) return INITIAL_PRAYERS[step];
    
    const decadeIndex = Math.floor((step - INITIAL_PRAYERS.length) / 13);
    const subStep = (step - INITIAL_PRAYERS.length) % 13;
    
    if (decadeIndex >= 5) {
      return { id: 'salve', name: 'Salve Rainha', text: 'Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A Vós bradamos, os degredados filhos de Eva. A Vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, Advogada nossa, esses Vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do Vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus. Para que sejamos dignos das promessas de Cristo. Amém.' };
    }

    const currentMysteryName = currentMysterySet.list[decadeIndex];

    if (subStep === 0) return { id: 'ourfather', name: `${decadeIndex + 1}º Mistério: ${currentMysteryName}`, text: 'Pai Nosso que estais no céu, santificado seja o Vosso nome, venha a nós o Vosso reino, seja feita a Vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas dívidas assim como nós perdoamos aos nossos devedores, e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.' };
    if (subStep <= 10) return { id: 'hailmary', name: `Ave Maria ${subStep}/10`, text: 'Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.' };
    if (subStep === 11) return { id: 'glory', name: 'Glória ao Pai', text: 'Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.' };
    return { id: 'fatima', name: 'Jaculatória de Fátima', text: 'Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o céu e socorrei principalmente as que mais precisarem.' };
  };

  const currentStep = getStepData();

  const handleNext = async () => {
    // Native Vibration
    if (hapticsEnabled) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (e) {
        console.warn("Haptics not available");
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }
    
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      setShowCompletionModal(true);
    }
  };

  const finishPrayer = () => {
    onComplete();
    localStorage.removeItem('rosario_prayer_step'); // clear progress
    onNavigate('home');
  };

  const handleWatchAd = async () => {
    if (Capacitor.getPlatform() !== 'android' || isAdFailed) {
      finishPrayer();
      return;
    }
    
    try {
      const dismissListener = await AdMob.addListener(RewardInterstitialAdPluginEvents.Dismissed, () => {
         dismissListener.remove();
         finishPrayer();
      });
      
      await AdMob.showRewardInterstitialAd();
    } catch (e) {
      console.warn('Erro ao exibir anúncio', e);
      finishPrayer();
    }
  };

  const handleGoPremium = () => {
    localStorage.removeItem('rosario_prayer_step');
    onNavigate('home');
    setTimeout(() => onOpenPremium(), 200);
  };
  
  const handleExitPrayer = () => {
    onNavigate('home'); // step is already saved in localStorage for when they return!
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center p-4 justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-20 shadow-sm shrink-0">
        <button onClick={() => onNavigate('home')} className="text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <X size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-slate-900 dark:text-slate-100 text-[10px] font-black uppercase tracking-[0.2em]">{currentMysterySet.name}</h2>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
               <div key={i} className={`h-1 w-6 rounded-full transition-all duration-500 ${Math.floor((step - INITIAL_PRAYERS.length) / 13) >= i && step >= INITIAL_PRAYERS.length ? 'bg-primary shadow-sm shadow-primary/30' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
            ))}
          </div>
        </div>
        <div className="size-10"></div> {/* Spacer for symmetry */}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 flex flex-col items-center gap-3 border-b border-slate-100 dark:border-slate-800 z-10 shrink-0">
          <div className="flex justify-center flex-wrap gap-2 px-6 items-center">
            {step < INITIAL_PRAYERS.length ? (
               // Contas iniciais (Cruz + 6)
               [...Array(INITIAL_PRAYERS.length)].map((_, i) => {
                 const isActive = i === step;
                 const isCompleted = i < step;
                 return (
                   <div key={`init-${i}`} className={`flex items-center justify-center transition-all duration-500 rounded-full ${
                     i === 0 ? 'text-primary' : ''
                   } ${
                     i === 0 && isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] scale-125' : 
                     i === 0 && isCompleted ? 'opacity-50' :
                     isActive ? 'size-3.5 bg-primary scale-125 shadow-xl shadow-primary/50' : 
                     isCompleted ? 'size-2.5 bg-primary/40' : 'size-2.5 bg-slate-200 dark:bg-slate-800'
                   }`}>
                      {i === 0 ? <svg className={`w-8 h-8 ${isActive || isCompleted ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M5 8h14"/></svg> : null}
                   </div>
                 );
               })
            ) : step < totalSteps - 1 ? (
               // 13 contas da dezena
               [...Array(13)].map((_, i) => {
                 const subStep = (step - INITIAL_PRAYERS.length) % 13;
                 const isActive = i === subStep || (i === 12 && subStep >= 12);
                 const isCompleted = i < subStep;
                 const isSpecial = i === 0 || i === 11 || i === 12; 
                 return (
                   <div 
                     key={`dec-${i}`} 
                     className={`transition-all duration-500 rounded-full ${
                       isSpecial ? 'size-4 border-2 border-primary/20 bg-primary/10' : 'size-2.5'
                     } ${
                       isActive ? 'bg-primary scale-150 shadow-xl shadow-primary/50' : 
                       isCompleted ? 'bg-primary/40' : 'bg-slate-200 dark:bg-slate-800'
                     }`}
                   ></div>
                 );
               })
            ) : (
               // Salve Rainha
               <div className="size-4 rounded-full bg-primary scale-150 shadow-xl shadow-primary/50"></div>
            )}
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
            {step < INITIAL_PRAYERS.length ? 'Orações Iniciais' : step >= totalSteps - 1 ? 'Agradecimento Final' : `Dezena ${Math.floor((step - INITIAL_PRAYERS.length) / 13) + 1} de 5`}
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-[190px] overflow-hidden">

          <div className="w-full h-full max-w-[380px] md:max-w-2xl bg-white dark:bg-slate-900/60 rounded-[40px] px-6 md:px-12 py-4 border border-slate-100 dark:border-white/5 shadow-sm flex flex-col items-center overflow-hidden relative">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mt-4 mb-4 opacity-40 shrink-0">Meditando</span>
            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex-1 w-full overflow-y-auto custom-scrollbar"
            >
              <div className="min-h-full flex flex-col justify-center py-4">
                <p className={`text-slate-800 dark:text-slate-200 leading-relaxed text-center px-2 ${typography.fontFamily} ${typography.fontSize} ${typography.isBold ? 'font-black' : 'font-medium'}`}>
                  "{currentStep.text}"
                </p>
              </div>
            </div>
            {showArrow && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-primary/70 animate-bounce transition-opacity duration-300 pointer-events-none z-20">
                <ChevronDown size={28} strokeWidth={3} />
              </div>
            )}
            <div className="h-4 shrink-0" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-100 dark:border-white/5 shadow-[0_-15px_50px_-15px_rgba(0,0,0,0.1)] z-30">
        <button 
          onClick={handleNext}
          className="relative group w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-primary/40 active:scale-[0.97] transition-all flex items-center justify-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-active:translate-y-0 transition-transform"></div>
          <CircleDot className="shrink-0" size={24} />
          <span className="relative">Próxima Conta</span>
        </button>
        
        <div className="mt-4 flex justify-between items-center px-4">
          <div className="flex flex-col">
            <p className="text-slate-300 dark:text-slate-600 text-[8px] font-black uppercase tracking-widest">Caminho da Fé</p>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-tight">Passo {step + 1} de {totalSteps}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExitPrayer}
              className="px-3 py-2 text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Pausar
            </button>
            <button 
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className="px-4 py-2 text-primary/60 font-bold text-xs hover:bg-primary/5 rounded-xl transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>

      {showCompletionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] w-full max-w-sm shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
               <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M5 8h14"/></svg>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 relative z-10 text-center">Você completou!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center relative z-10">Obrigado por rezar e manter sua fé viva.<br/>Como deseja continuar?</p>
            
            <div className="flex flex-col gap-3 w-full relative z-10">
              {supporterLevel === 0 ? (
                <>
                  <button onClick={handleWatchAd} className="bg-primary shadow-xl shadow-primary/25 text-white py-4 rounded-3xl font-black text-sm hover:bg-primary-dark transition-all active:scale-[0.98] w-full">
                    Assistir um anúncio <span className="block text-[8px] opacity-70 italic font-medium pt-1 uppercase tracking-widest">Ajuda a manter o app gratuito</span>
                  </button>
                  
                  <button onClick={handleGoPremium} className="bg-accent-gold/10 text-accent-gold py-4 rounded-3xl font-black text-sm border-2 border-accent-gold/20 hover:bg-accent-gold/20 transition-all active:scale-[0.98] w-full mt-1">
                    Quero ser Premium
                  </button>
                  
                  <button onClick={finishPrayer} className="mt-2 text-slate-400 font-bold text-xs py-3 hover:text-slate-600 dark:hover:text-slate-300 transition-colors uppercase tracking-widest">
                    Deixar para a próxima
                  </button>
                </>
              ) : (
                <button onClick={finishPrayer} className="bg-primary shadow-xl shadow-primary/25 text-white py-4 rounded-3xl font-black text-sm hover:bg-primary-dark transition-all active:scale-[0.98] w-full mt-2 uppercase tracking-widest">
                  Você completou!
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
