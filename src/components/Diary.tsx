import { PencilLine, Plus, Calendar, Trash2, Heart, Share2 } from 'lucide-react';
import { Screen } from '../App';
import { useState, useEffect } from 'react';

interface DiaryEntry {
  id: string;
  date: string;
  text: string;
  mood?: string;
}

interface DiaryProps {
  onNavigate: (screen: Screen) => void;
}

export default function DiaryComponent({ onNavigate }: DiaryProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('rosario_diary_entries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntries = (newEntries: DiaryEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('rosario_diary_entries', JSON.stringify(newEntries));
  };

  const addEntry = () => {
    if (!newText.trim()) return;
    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      text: newText
    };
    const updated = [entry, ...entries];
    saveEntries(updated);
    setNewText('');
    setIsAdding(false);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    saveEntries(updated);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="p-6 pb-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Meu Diário</h2>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Reflexões da Fé</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="size-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-40">
        {isAdding && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-primary/20 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <PencilLine size={18} className="text-primary" />
              Nova Reflexão
            </h3>
            <textarea 
              autoFocus
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="O que você meditou hoje? Quais foram as suas intenções?"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium min-h-[150px] resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 text-slate-400 font-bold text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={addEntry}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        {entries.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <Heart size={48} className="text-slate-300 mb-4" />
            <p className="text-sm font-bold text-slate-400">Nenhuma reflexão ainda.<br/>Que tal começar agora?</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative group animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{entry.date}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
                "{entry.text}"
              </p>
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-2 text-slate-300 hover:text-primary transition-colors"
                  title="Compartilhar"
                >
                  <Share2 size={16} />
                </button>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
