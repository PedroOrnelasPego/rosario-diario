import { Book, Lock, ChevronRight, X, BookOpen } from 'lucide-react';
import { Screen } from '../App';
import { useState, useEffect } from 'react';
import { BibleVerse } from '../services/bibleService';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

interface LibraryProps {
  onNavigate: (screen: Screen) => void;
  psalmOfDay: BibleVerse | null;
  onOpenPremium: () => void;
}

const LADAINHA_TEXT = [
  "Senhor, tende piedade de nós.",
  "Jesus Cristo, tende piedade de nós.",
  "Senhor, tende piedade de nós.",
  "Jesus Cristo, ouvi-nos.",
  "Jesus Cristo, atendei-nos.",
  "Pai do Céu, que sois Deus, tende piedade de nós.",
  "Filho, Redentor do mundo, que sois Deus, tende piedade de nós.",
  "Espírito Santo, que sois Deus, tende piedade de nós.",
  "Santíssima Trindade, que sois um só Deus, tende piedade de nós.",
  "Santa Maria, rogai por nós.",
  "Santa Mãe de Deus, rogai por nós.",
  "Santa Virgem das Virgens, rogai por nós.",
  "Mãe de Cristo, rogai por nós.",
  "Mãe da Igreja, rogai por nós.",
  "Mãe da divina graça, rogai por nós.",
  "Mãe puríssima, rogai por nós.",
  "Mãe castíssima, rogai por nós.",
  "Mãe imaculada, rogai por nós.",
  "Mãe intemerata, rogai por nós.",
  "Mãe amável, rogai por nós.",
  "Mãe admirável, rogai por nós.",
  "Mãe do bom conselho, rogai por nós.",
  "Mãe do Criador, rogai por nós.",
  "Mãe do Salvador, rogai por nós.",
  "Virgem prudentíssima, rogai por nós.",
  "Virgem venerável, rogai por nós.",
  "Virgem louvável, rogai por nós.",
  "Virgem poderosa, rogai por nós.",
  "Virgem clemente, rogai por nós.",
  "Virgem fiel, rogai por nós.",
  "Espelho de justiça, rogai por nós.",
  "Sede de sabedoria, rogai por nós.",
  "Causa da nossa alegria, rogai por nós.",
  "Vaso espiritual, rogai por nós.",
  "Vaso honorífico, rogai por nós.",
  "Vaso insigne de devoção, rogai por nós.",
  "Rosa mística, rogai por nós.",
  "Torre de David, rogai por nós.",
  "Torre de marfim, rogai por nós.",
  "Casa de ouro, rogai por nós.",
  "Arca da aliança, rogai por nós.",
  "Porta do Céu, rogai por nós.",
  "Estrela da manhã, rogai por nós.",
  "Saúde dos enfermos, rogai por nós.",
  "Refúgio dos pecadores, rogai por nós.",
  "Consoladora dos aflitos, rogai por nós.",
  "Auxílio dos cristãos, rogai por nós.",
  "Rainha dos Anjos, rogai por nós.",
  "Rainha dos Patriarcas, rogai por nós.",
  "Rainha dos Profetas, rogai por nós.",
  "Rainha dos Apóstolos, rogai por nós.",
  "Rainha dos Mártires, rogai por nós.",
  "Rainha dos Confessores, rogai por nós.",
  "Rainha das Virgens, rogai por nós.",
  "Rainha de todos os Santos, rogai por nós.",
  "Rainha concebida sem pecado original, rogai por nós.",
  "Rainha assunta ao Céu, rogai por nós.",
  "Rainha do Santíssimo Rosário, rogai por nós.",
  "Rainha da família, rogai por nós.",
  "Rainha da paz, rogai por nós.",
  "Cordeiro de Deus, que tirais o pecado do mundo, perdoai-nos, Senhor.",
  "Cordeiro de Deus, que tirais o pecado do mundo, ouvi-nos, Senhor.",
  "Cordeiro de Deus, que tirais o pecado do mundo, tende piedade de nós."
];

const ANGELUS_TEXT = [
  "O ANGELUS",
  "V. O Anjo do Senhor anunciou a Maria.",
  "R. E Ela concebeu do Espírito Santo.",
  "Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.",
  "V. Eis aqui a escrava do Senhor.",
  "R. Faça-se em mim segundo a vossa palavra.",
  "Ave Maria...",
  "V. E o Verbo se fez carne.",
  "R. E habitou entre nós.",
  "Ave Maria...",
  "V. Rogai por nós, Santa Mãe de Deus.",
  "R. Para que sejamos dignos das promessas de Cristo.",
  "ORAÇÃO",
  "Infundi, Senhor, a vossa graça em nossas almas, para que nós, que conhecemos pela anunciação do Anjo a encarnação de Jesus Cristo, vosso Filho, cheguemos, por sua paixão e cruz, à glória da ressurreição. Pelo mesmo Cristo, Senhor nosso. Amém."
];

export default function LibraryComponent({ onNavigate, psalmOfDay, onOpenPremium }: LibraryProps) {
  const [selectedText, setSelectedText] = useState<{ title: string; content: string[] } | null>(null);

  useEffect(() => {
    const showAd = async () => {
      try {
        await AdMob.initialize({
          initializeForTesting: true,
        });

        await AdMob.showBanner({
          adId: 'ca-app-pub-3940256099942544/6300978111', // Testing ID
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 60 // Try to push it above navigation
        });
      } catch (e) {
        console.error("AdMob error:", e);
      }
    };

    showAd();

    return () => {
      AdMob.hideBanner().catch(console.error);
    };
  }, []);

  const categories = [
    { title: 'Livros e Textos', id: 'texts', icon: Book, count: 0, color: 'bg-slate-200 dark:bg-slate-800', disabled: true },
    { title: 'Bíblia Sagrada', id: 'bible', icon: BookOpen, count: 73, color: 'bg-primary' },
  ];

  const resources = [
    {
      id: 4,
      title: 'Salmo do Dia',
      type: 'Bíblia',
      pages: 'Capítulo Completo',
      isPremium: false,
      image: '/assets/images/salmo.png',
      content: psalmOfDay ? [psalmOfDay.reference, ...psalmOfDay.text.split('\n').filter(l => l.trim().length > 5)] : ['Carregando...', 'Buscando a sabedoria eterna...']
    },
    {
      id: 2,
      title: 'Ladainha de N. Senhora',
      type: 'Texto',
      pages: 'Completo',
      isPremium: false,
      image: '/assets/images/ladainha.png',
      content: LADAINHA_TEXT
    },
    {
      id: 5,
      title: 'O Angelus',
      type: 'Oração',
      pages: 'Tradicional',
      isPremium: false,
      image: '/assets/images/angelus.png',
      content: ANGELUS_TEXT
    }
  ];

  const handleResourceClick = (res: any) => {
    if (res.content) {
      setSelectedText({ title: res.title, content: res.content });
    }
  };

  const handleCategoryClick = (id: string) => {
    if (id === 'bible') {
      onNavigate('bible');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-8 pb-32">
        {/* Header */}
        <div className="p-6 pb-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none">Biblioteca</h2>
            <button 
              onClick={onOpenPremium}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
            >
              <Lock size={12} />
              Seja Premium
            </button>
          </div>
        </div>

        <div className="px-6 space-y-8">
          {/* Categories */}
          <div className="grid grid-cols-2 gap-4">
            {categories.map(cat => (
              <button 
                key={cat.title} 
                onClick={() => !cat.disabled && handleCategoryClick(cat.id)}
                disabled={cat.disabled}
                className={`flex flex-col items-start p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all text-left group ${cat.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
              >
                <div className={`size-10 rounded-2xl ${cat.color} flex items-center justify-center ${cat.disabled ? 'text-slate-400' : 'text-white'} mb-3 shadow-lg shadow-black/5`}>
                  <cat.icon size={20} />
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">{cat.title}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {cat.disabled ? 'Em breve!' : `${cat.count} Livros`}
                </span>
              </button>
            ))}
          </div>

          {/* Featured Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Alimento para a Alma</h3>
            </div>
            
            <div className="space-y-4">
              {resources.map(res => (
                <div 
                  key={res.id} 
                  onClick={() => handleResourceClick(res)}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50`}
                >
                  <div className="size-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative shadow-inner">
                    <img src={res.image} alt={res.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                       <span className="text-[9px] font-black text-primary uppercase tracking-widest">{res.type}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{res.title}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">{res.pages || 'Disponível'}</p>
                  </div>
                  <ChevronRight size={16} className={`text-slate-300 mr-2 group-hover:text-primary transition-colors`} />
                </div>
              ))}
            </div>
          </div>

          {/* AdMob Banner Placeholder - Reserving the bottom space */}
          <div className="mt-8">
            <div className="w-full h-24 bg-slate-200/50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Publicidade AdMob</span>
              <div className="flex gap-1.5">
                <div className="size-1.5 rounded-full bg-slate-300 animate-pulse"></div>
                <div className="size-1.5 rounded-full bg-slate-300 animate-pulse delay-75"></div>
                <div className="size-1.5 rounded-full bg-slate-300 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      {selectedText && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-slate-900 animate-in slide-in-from-bottom duration-300">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight truncate">{selectedText.title}</h3>
            </div>
            <button 
              onClick={() => setSelectedText(null)}
              className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 font-serif leading-loose text-lg text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950">
            <div className="max-w-prose mx-auto space-y-6 pb-20">
              {selectedText.content.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                const isHeading = trimmed === trimmed.toUpperCase() && trimmed.length > 3;
                const isInvocation = trimmed.endsWith('rogai por nós.') || trimmed.endsWith('tende piedade de nós.');
                const isDialogue = trimmed.startsWith('V.') || trimmed.startsWith('R.');
                
                return (
                 <p key={i} className={`
                    ${isHeading ? 'text-2xl font-black text-primary not-italic font-display mt-10 mb-6 text-center border-b-2 border-primary/10 pb-2' : ''}
                    ${isInvocation ? 'pl-6 border-l-4 border-primary/20 italic text-base py-1 bg-primary/5 rounded-r-lg' : ''}
                    ${isDialogue ? 'pl-4 border-l-2 border-slate-200 dark:border-slate-800' : ''}
                    ${!isHeading && !isInvocation && !isDialogue ? 'first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-primary' : ''}
                 `}>
                   {isDialogue ? (
                     <>
                      <span className="font-bold text-primary mr-2">{trimmed.substring(0, 2)}</span>
                      {trimmed.substring(2)}
                     </>
                   ) : trimmed}
                 </p>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
