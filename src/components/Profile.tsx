import { User, Flame, Award, Calendar, ChevronRight, Settings, Share2, Camera, Lock } from 'lucide-react';
import { Screen } from '../App';
import avPadrao from '../assets/avatares/padrao.png';

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
  userName: string;
  userPhoto: string | null;
  onPhotoUpload: () => void;
  totalPrayers: number;
  streak: number;
  dailyHistory: string[];
}

export default function ProfileComponent({ 
  onNavigate, 
  userName, 
  userPhoto, 
  onPhotoUpload,
  totalPrayers,
  streak,
  dailyHistory
}: ProfileProps) {
  const stats = [
    { label: 'Ofensiva', value: String(streak), icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Terços', value: String(totalPrayers), icon: Award, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Dias Ativo', value: String(dailyHistory.length), icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const defaultAvatar = avPadrao;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Background Decorative Element */}
      <div className="h-32 bg-primary/20 relative w-full shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 -mt-16">
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div 
              className="size-28 rounded-full border-4 border-white dark:border-slate-900 bg-cover bg-center bg-no-repeat shadow-xl bg-slate-100" 
              style={{ backgroundImage: `url('${userPhoto || defaultAvatar}')` }}
            ></div>
            <button 
              onClick={onPhotoUpload}
              className="absolute bottom-0 right-0 size-8 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white dark:border-slate-900 shadow-lg hover:scale-110 active:scale-95 transition-transform"
            >
              <Camera size={14} />
            </button>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{userName}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Fiel de Maria</p>
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => onNavigate('edit-profile')}
              className="px-6 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
            >
              Editar Perfil
            </button>
            <button 
              onClick={() => onNavigate('settings')}
              className="size-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 shadow-sm hover:text-primary transition-colors"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
              <div className={`size-10 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-2`}>
                <s.icon size={20} />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{s.value}</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-1">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Progress Card */}
        <div className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/20 mb-8 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-lg font-black mb-1">Próxima Conquista</h3>
            <p className="text-xs text-white/80 font-bold mb-4 italic">"Fiel em todas as horas"</p>
            <div className="w-full bg-white/20 h-2 rounded-full mb-2">
              <div className="w-[0%] bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span>0/12 Terços</span>
              <span>0%</span>
            </div>
          </div>
          <Award className="absolute right-[-20px] bottom-[-20px] size-40 text-white/10 rotate-12" />
        </div>

        {/* DashBoard for Journey- PREMIUM */}
        <div className="mb-8 relative">
           <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Minha Jornada</h3>
            <span className="bg-accent-gold/10 text-accent-gold text-[8px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1">
              <Lock size={10} /> Premium
            </span>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden">
             <div className="absolute inset-0 bg-slate-50/40 dark:bg-black/20 backdrop-blur-[1px] z-10"></div>
            {/* Real Chart Area */}
            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-end h-32 gap-2 px-2">
                 {[35, 65, 45, 85, 55, 75, 50].map((h, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                     <div className="w-full bg-primary/5 dark:bg-primary/10 rounded-t-xl relative overflow-hidden group/bar" style={{ height: `${h}%` }}>
                       <div className="absolute inset-x-0 bottom-0 bg-primary/20 transition-all duration-500 group-hover/bar:bg-primary/40 h-full"></div>
                     </div>
                     <span className="text-[8px] font-black text-slate-300 uppercase">{['S','T','Q','Q','S','S','D'][i]}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
          <button className="flex items-center justify-between p-5 w-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative group">
            <div className="flex items-center gap-4 opacity-50">
              <div className="size-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Calendar size={20} />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Histórico de Oração</span>
                <span className="text-[10px] font-black text-accent-gold uppercase tracking-widest flex items-center gap-1">
                  <Lock size={10} /> Recurso Premium
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
