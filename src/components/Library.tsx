import { Book, Lock, ChevronRight, Search, FileText, X } from 'lucide-react';
import { Screen } from '../App';
import { useState } from 'react';

interface LibraryProps {
  onNavigate: (screen: Screen) => void;
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

export default function LibraryComponent({ onNavigate }: LibraryProps) {
  const [selectedText, setSelectedText] = useState<{ title: string; content: string[] } | null>(null);

  const categories = [
    { title: 'Livros e Textos', icon: Book, count: 8, color: 'bg-orange-500' },
    { title: 'Bíblia Sagrada', icon: FileText, count: 73, color: 'bg-primary' },
  ];

  const resources = [
    {
      id: 1,
      title: 'O Segredo do Rosário',
      type: 'Livro',
      pages: '120 págs',
      isPremium: true,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Federico_Barocci_-_The_Nativity_-_WGA01293.jpg/400px-Federico_Barocci_-_The_Nativity_-_WGA01293.jpg'
    },
    {
      id: 2,
      title: 'Ladainha de N. Senhora',
      type: 'Texto',
      pages: 'Completo',
      isPremium: false,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Annunciation_%28Leonardo%29.jpg/400px-Annunciation_%28Leonardo%29.jpg',
      content: LADAINHA_TEXT
    }
  ];

  const handleResourceClick = (res: any) => {
    if (res.isPremium) return;
    if (res.content) {
      setSelectedText({ title: res.title, content: res.content });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-40">
      {/* Header */}
      <div className="p-6 pb-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Biblioteca</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar orações, textos..." 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Categories */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map(cat => (
            <button key={cat.title} className="flex flex-col items-start p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:scale-[1.02] transition-all text-left group">
              <div className={`size-10 rounded-2xl ${cat.color} flex items-center justify-center text-white mb-3 shadow-lg shadow-black/5`}>
                <cat.icon size={20} />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">{cat.title}</span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{cat.count} itens</span>
            </button>
          ))}
        </div>

        {/* Featured Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Conteúdo em Destaque</h3>
          </div>
          
          <div className="space-y-4">
            {resources.map(res => (
              <div 
                key={res.id} 
                onClick={() => handleResourceClick(res)}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 group cursor-pointer transition-colors ${res.isPremium ? 'opacity-70' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <div className="size-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative shadow-inner">
                  <img src={res.image} alt={res.title} className="w-full h-full object-cover" />
                  {res.isPremium && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white backdrop-blur-[1px]">
                      <Lock size={14} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                     <span className="text-[9px] font-black text-primary uppercase tracking-widest">{res.type}</span>
                     {res.isPremium && <span className="bg-accent-gold/10 text-accent-gold text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Pro</span>}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{res.title}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{res.pages || 'Disponível'}</p>
                </div>
                <ChevronRight size={16} className={`text-slate-300 mr-2 group-hover:text-primary transition-colors ${res.isPremium ? 'hidden' : ''}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Ad Placeholder (AdMob hint) */}
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Espaço Publicitário (AdMob)</p>
        </div>
      </div>

      {/* Reader Modal */}
      {selectedText && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-slate-900 animate-in slide-in-from-bottom duration-300">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0">
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedText.title}</h3>
            <button 
              onClick={() => setSelectedText(null)}
              className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 font-serif leading-loose text-lg text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950">
            <div className="max-w-prose mx-auto space-y-4">
              {selectedText.content.map((line, i) => (
                 <p key={i} className={line.endsWith('rogai por nós.') ? 'pl-4 border-l-2 border-primary/10 italic' : 'font-bold'}>
                   {line}
                 </p>
              ))}
              <div className="h-20" /> {/* Spacer */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
