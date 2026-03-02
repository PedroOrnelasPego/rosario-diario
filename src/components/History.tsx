import { ChevronLeft, Calendar as CalendarIcon, Award, Flame, CheckCircle2 } from 'lucide-react';
import { Screen } from '../App';
import { useEffect, useRef } from 'react';

interface HistoryProps {
  onNavigate: (screen: Screen) => void;
  dailyHistory: string[];
  totalPrayers: number;
  streak: number;
}

export default function HistoryComponent({ onNavigate, dailyHistory, totalPrayers, streak }: HistoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the heatmap to the end (current date)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [dailyHistory]);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset()); // adjust for TZ
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) return 'Hoje';
    if (d.toDateString() === yesterday.toDateString()) return 'Ontem';
    
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-center p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0 sticky top-0 z-10 shadow-sm">
        <button onClick={() => onNavigate('profile')} className="text-slate-400 dark:text-slate-100 size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="flex-1 text-center text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest pr-10">Histórico de Oração</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary text-white p-5 rounded-[24px] shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-1 text-center min-h-[140px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <Award size={24} className="opacity-90 absolute top-4 left-4" />
            <span className="block text-4xl font-black leading-none mb-1 mt-4">{totalPrayers}</span>
            <span className="block text-xl font-bold leading-none mb-2">Terços</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 decoration-white/30 underline underline-offset-4">
              Total Histórico
            </span>
          </div>

          <div className="bg-orange-500 text-white p-5 rounded-[24px] shadow-xl shadow-orange-500/20 flex flex-col items-center justify-center gap-1 text-center min-h-[140px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <Flame size={24} className="opacity-90 absolute top-4 left-4" />
            <span className="block text-4xl font-black leading-none mb-1 mt-4">{streak}</span>
            <span className="block text-xl font-bold leading-none mb-2">Dias</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 decoration-white/30 underline underline-offset-4">
              Ofensiva Atual
            </span>
          </div>

          {[
            { 
              val: `${Math.floor(totalPrayers * 20 / 60)}h ${totalPrayers * 20 % 60}m`, 
              label: "Tempo em Oração",
              helper: "Melhor aqui do que nas redes!",
              color: "bg-emerald-500 shadow-emerald-500/20"
            },
            {
              val: totalPrayers > 0 ? "Gozosos" : "Nenhum",
              label: "Mistério Favorito",
              helper: "Mais rezado no último mês",
              color: "bg-indigo-500 shadow-indigo-500/20"
            }
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-[24px] shadow-xl text-white flex flex-col items-center justify-center text-center col-span-1 min-h-[120px] ${stat.color}`}>
              <span className="block text-2xl font-black leading-none mb-1">{stat.val}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-2">{stat.label}</span>
              <span className="text-[8px] opacity-70 italic">"{stat.helper}"</span>
            </div>
          ))}
        </div>

        {/* Heatmap Github Style */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 pb-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-6">
             <CalendarIcon size={16} className="text-primary" />
             <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Seu Ano de Devoção</h3>
          </div>

          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
          >
            <div className="min-w-max pb-2 pr-6">
              {(() => {
                const today = new Date();
                
                // End grid on the upcoming Sunday
                const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday
                const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
                const endOfGrid = new Date(today);
                endOfGrid.setDate(endOfGrid.getDate() + diffToSunday);
                
                // Start date: 52 weeks back from endOfGrid (Monday)
                const start = new Date(endOfGrid);
                start.setDate(endOfGrid.getDate() - 363);

                // Build weeks array
                const weeksData: Date[][] = [];
                let current = new Date(start);
                for (let w = 0; w < 52; w++) {
                  const week: Date[] = [];
                  for (let d = 0; d < 7; d++) {
                    week.push(new Date(current));
                    current.setDate(current.getDate() + 1);
                  }
                  weeksData.push(week);
                }

                // Month labels calculation:
                // Find roughly where (which week index) each month starts.
                const monthLabels = [];
                const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                let lastMonth = -1;
                for (let w = 0; w < 52; w++) {
                  // check the first day of that week
                  const m = weeksData[w][0].getMonth();
                  if (m !== lastMonth) {
                    monthLabels.push({ text: monthNames[m], weekIndex: w });
                    lastMonth = m;
                  }
                }

                return (
                  <div className="flex flex-col">
                    {/* Months Row */}
                    <div className="flex relative h-6 w-full text-[10px] font-bold text-slate-400 mb-1 ml-8">
                      {monthLabels.map((lbl, idx) => (
                        <div 
                          key={idx} 
                          className="absolute"
                          style={{ left: `${lbl.weekIndex * (16 + 6)}px` }} // 16px (w-4) + 6px (gap-1.5)
                        >
                          {lbl.text}
                        </div>
                      ))}
                    </div>

                    {/* Matrix (Rows: Days, Columns: Weeks) */}
                    <div className="flex">
                      {/* Day Labels */}
                      <div className="flex flex-col gap-[6px] text-[9px] font-bold text-slate-400 capitalize w-8 text-left shrink-0 mt-[2px]">
                        <span className="h-4 flex items-center bg-transparent"></span>
                        <span className="h-4 flex items-center">Seg</span>
                        <span className="h-4 flex items-center bg-transparent"></span>
                        <span className="h-4 flex items-center">Qua</span>
                        <span className="h-4 flex items-center bg-transparent"></span>
                        <span className="h-4 flex items-center">Sex</span>
                        <span className="h-4 flex items-center bg-transparent"></span>
                      </div>
                      
                      {/* Weeks Columns */}
                      <div className="flex gap-1.5">
                        {weeksData.map((week, wIndex) => (
                          <div key={wIndex} className="flex flex-col gap-1.5">
                            {week.map((dayDate, dIndex) => {
                               // Check if future
                               const isFuture = dayDate.getFullYear() > today.getFullYear() || 
                                              (dayDate.getFullYear() === today.getFullYear() && dayDate.getMonth() > today.getMonth()) ||
                                              (dayDate.getFullYear() === today.getFullYear() && dayDate.getMonth() === today.getMonth() && dayDate.getDate() > today.getDate());
                               
                               if (isFuture) {
                                  return <div key={dIndex} className="w-4 h-4 rounded-sm bg-transparent"></div>;
                               }

                               const mm = String(dayDate.getMonth() + 1).padStart(2, '0');
                               const dd = String(dayDate.getDate()).padStart(2, '0');
                               const dateStr = `${dayDate.getFullYear()}-${mm}-${dd}`;
                               
                               const didPray = dailyHistory.includes(dateStr);
                               const utcDateStr = dayDate.toISOString().split('T')[0];
                               const didPrayFallback = didPray || dailyHistory.includes(utcDateStr);

                               return (
                                 <div 
                                    key={dateStr}
                                    title={formatDate(dateStr)}
                                    className={`w-4 h-4 rounded-sm transition-all duration-300 hover:ring-2 hover:ring-primary/50 hover:scale-110 cursor-default shrink-0
                                      ${didPrayFallback 
                                        ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.3)]' 
                                        : 'bg-slate-100 dark:bg-slate-800'
                                      }`}
                                 ></div>
                               );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              <span>Ausente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-primary shadow-sm shadow-primary/40"></div>
              <span>Oração Realizada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
