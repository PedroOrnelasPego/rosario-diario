import { Home as HomeIcon, Library, BookOpen, User, Church, PencilLine } from 'lucide-react';
import { Screen } from '../App';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Início', icon: Church },
    { id: 'library', label: 'Biblioteca', icon: Library },
    { id: 'diary', label: 'Diário', icon: PencilLine },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-3 pb-8 z-40">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            (item.id === 'home' && (currentScreen === 'home' || currentScreen === 'prayer' || currentScreen === 'alarm')) || 
            currentScreen === item.id;
          
          return (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id as Screen)} 
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive 
                  ? 'text-primary scale-110' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={24} className={isActive ? 'fill-primary/10' : ''} />
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
