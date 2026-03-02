import { Lock, ChevronRight, X, Download } from 'lucide-react';
import { Screen } from '../App';
import { useState } from 'react';
import { BibleVerse } from '../services/bibleService';

interface LibraryProps {
  onNavigate: (screen: Screen) => void;
  psalmOfDay: BibleVerse | null;
  onOpenPremium: () => void;
  supporterLevel: number;
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

const SAO_BENTO_VERSIONS = [
  {
    label: "Português",
    content: [
      "A Cruz Sagrada seja a minha luz,",
      "Não seja o dragão o meu guia.",
      "Retira-te, satanás!",
      "Nunca me aconselhes coisas vãs.",
      "É mau o que tu me ofereces,",
      "Bebe tu mesmo o teu veneno!",
      "Amém."
    ]
  },
  {
    label: "Latim",
    content: [
      "Crux Sacra Sit Mihi Lux",
      "Non Draco Sit Mihi Dux",
      "Vade Retro Satana",
      "Numquam Suade Mihi Vana",
      "Sunt Mala Quae Libas",
      "Ipse Venena Bibas",
      "Amen."
    ]
  }
];

const VINDE_ESPIRITO_SANTO = [
  "VINDE, ESPÍRITO SANTO",
  "Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.",
  "V. Enviai o vosso Espírito e tudo será criado.",
  "R. E renovareis a face da terra.",
  "OREMOS",
  "Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre da sua consolação. Por Cristo, Senhor Nosso. Amém."
];

const PAI_NOSSO_TEXT = [
  "PAI NOSSO",
  "Pai Nosso que estais nos Céus, santificado seja o vosso Nome, venha a nós o vosso Reino, seja feita a vossa vontade assim na Terra como no Céu.",
  "O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do Mal.",
  "Amém."
];

const AVE_MARIA_TEXT = [
  "AVE MARIA",
  "Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus.",
  "Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte.",
  "Amém."
];

export default function LibraryComponent({ onNavigate, psalmOfDay, onOpenPremium, supporterLevel }: LibraryProps) {
  const [selectedText, setSelectedText] = useState<{ title: string; content?: string[]; versions?: { label: string, content: string[] }[] } | null>(null);
  const [activeVersion, setActiveVersion] = useState<number>(0);

  const resources = [
    {
      id: 7,
      title: 'Vinde, Espírito Santo',
      type: 'Invocação',
      pages: 'Completo',
      isPremium: false,
      image: '/assets/images/espiritosanto.png',
      content: VINDE_ESPIRITO_SANTO
    },
    {
      id: 8,
      title: 'Pai Nosso',
      type: 'Oração',
      pages: 'Jesus ensinou',
      isPremium: false,
      image: '/assets/images/painosso.png',
      content: PAI_NOSSO_TEXT
    },
    {
      id: 9,
      title: 'Ave Maria',
      type: 'Oração',
      pages: 'Devoção Mariana',
      isPremium: false,
      image: '/assets/images/avemaria.png',
      content: AVE_MARIA_TEXT
    },
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
    },
    {
      id: 6,
      title: 'Oração de São Bento',
      type: 'Proteção',
      pages: 'Latim/PT',
      isPremium: false,
      image: '/assets/images/saobento.png',
      versions: SAO_BENTO_VERSIONS
    }
  ];

  const bottomResources = [
    {
      id: 100,
      title: 'Bíblia Sagrada',
      type: 'Sagrado',
      pages: '73 Livros',
      isPremium: true,
      image: '/assets/images/biblia.png',
      action: 'bible'
    },
    {
      id: 101,
      title: 'Livros e Textos',
      type: 'Estudo',
      pages: 'Em breve',
      isPremium: false,
      image: '/assets/images/livros.png',
      action: 'texts',
      disabled: true
    }
  ];

  const handleResourceClick = (res: any) => {
    setActiveVersion(0);
    setSelectedText({ title: res.title, content: res.content, versions: res.versions });
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
          {/* Bottom Catalog Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Cânones da Igreja</h3>
            </div>
            
            <div className="space-y-4">
              {bottomResources.map(res => (
                <div 
                  key={res.id} 
                  onClick={() => {
                    if (res.disabled) return;
                    if (res.action === 'bible') onNavigate('bible');
                  }}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 group transition-colors ${res.disabled ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <div className="size-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative shadow-inner">
                    <img src={res.image} alt={res.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                       <span className="text-[9px] font-black text-primary uppercase tracking-widest">{res.type}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{res.title}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">{res.pages}</p>
                  </div>
                  
                  {res.action === 'bible' && supporterLevel > 0 && (
                    <button 
                      className="mr-2 p-2.5 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Bíblia Premium pronta para modo offline no seu celular!');
                      }}
                    >
                      <Download size={16} />
                    </button>
                  )}
                  {res.action === 'bible' && supporterLevel === 0 && (
                    <button 
                      className="mr-2 p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPremium();
                      }}
                    >
                      <Lock size={16} />
                    </button>
                  )}
                  
                  {!res.disabled && <ChevronRight size={16} className={`text-slate-300 mr-2 group-hover:text-primary transition-colors`} />}
                </div>
              ))}
            </div>
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
          <div className="flex-1 overflow-y-auto p-8 font-serif leading-loose text-lg text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 flex flex-col items-center">
            
            {selectedText.versions && (
              <div className="flex w-full max-w-sm bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 shadow-sm shrink-0">
                {selectedText.versions.map((ver, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVersion(idx)}
                    className={`flex-1 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeVersion === idx ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    {ver.label}
                  </button>
                ))}
              </div>
            )}

            <div className="max-w-prose w-full mx-auto space-y-6 pb-20">
              {(selectedText.versions ? selectedText.versions[activeVersion].content : selectedText.content || []).map((line, i) => {
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
