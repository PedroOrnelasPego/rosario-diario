import { ChevronLeft, Search, BookOpen, ChevronRight, X, AlertCircle } from 'lucide-react';
import { Screen } from '../App';
import { useState, useEffect, useRef } from 'react';
import { BIBLE_BOOKS, getChapter, BibleChapter } from '../services/bibleService';

interface BibleProps {
  onNavigate: (screen: Screen) => void;
}

export default function BibleComponent({ onNavigate }: BibleProps) {
  const [selectedBook, setSelectedBook] = useState<{ name: string; id: string; chapters: number } | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [content, setContent] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredBooks = BIBLE_BOOKS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (selectedBook && chapter) {
      loadChapter(selectedBook.id, chapter);
    }
  }, [selectedBook, chapter]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [chapter, content]);

  const loadChapter = async (bookId: string, chapNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChapter(bookId, chapNum);
      if (!data.verses || data.verses.length === 0) {
        throw new Error('Conteúdo não encontrado para este capítulo.');
      }
      setContent(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Erro ao carregar o capítulo. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedBook(null);
    setChapter(null);
    setContent(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => {
              if (chapter) {
                setChapter(null);
                setContent(null);
                setError(null);
              } else if (selectedBook) {
                setSelectedBook(null);
              } else {
                onNavigate('library');
              }
            }}
            className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Bíblia Sagrada</h2>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              {selectedBook ? `${selectedBook.name} ${chapter ? `• Cap. ${chapter}` : ''}` : 'Católica (Almeida)'}
            </p>
          </div>
        </div>
        
        {!selectedBook && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar livro..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
            />
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!selectedBook ? (
          /* Book List */
          <div className="grid grid-cols-2 gap-3 p-6 pb-32">
            {filteredBooks.map(book => (
              <button 
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group active:scale-95 transition-all text-left"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{book.name}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{book.chapters} Capítulos</span>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        ) : !chapter ? (
          /* Chapter Selector (Corrected) */
          <div className="p-6 pb-32">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Escolha o Capítulo</h3>
             <div className="grid grid-cols-5 gap-3">
               {[...Array(selectedBook.chapters)].map((_, i) => (
                 <button 
                  key={i}
                  onClick={() => setChapter(i + 1)}
                  className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 active:bg-primary active:text-white transition-all hover:border-primary/30 shadow-sm"
                 >
                   {i + 1}
                 </button>
               ))}
             </div>
          </div>
        ) : (
          /* Chapter Content */
          <div className="p-8 pb-40 font-serif leading-loose text-lg text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 min-h-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                <BookOpen size={48} className="animate-bounce text-primary" />
                <span className="text-sm font-black uppercase tracking-widest">Carregando Escrituras...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="size-16 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-500 mb-2">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Ops! Erro de Conexão</h3>
                <p className="text-sm text-slate-500 max-w-[200px]">{error}</p>
                <button 
                  onClick={() => loadChapter(selectedBook.id, chapter!)}
                  className="mt-4 px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : (
              <div className="max-w-prose mx-auto">
                <h1 className="text-4xl font-black text-primary font-display mb-12 text-center">{selectedBook.name} {chapter}</h1>
                <div className="space-y-6">
                  {content?.verses.map(v => (
                    <p key={v.verse} className="relative">
                      <span className="absolute -left-6 top-1 text-[10px] font-black text-primary/40">{v.verse}</span>
                      {v.text}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer for Chapter */}
      {chapter && !loading && !error && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-full border border-slate-200 dark:border-slate-800 shadow-2xl z-50">
          <button 
            disabled={chapter <= 1}
            onClick={() => setChapter(chapter - 1)}
            className="size-12 rounded-full flex items-center justify-center text-slate-400 disabled:opacity-20 active:scale-95 transition-transform"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="px-4 border-x border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Cap.</span>
            <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{chapter}</span>
          </div>
          <button 
            disabled={chapter >= selectedBook!.chapters}
            onClick={() => setChapter(chapter + 1)}
            className="size-12 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95 transition-transform"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
