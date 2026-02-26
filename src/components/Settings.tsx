import { ChevronLeft, Moon, Sun, Bell, User, Shield, Info, LogOut, Trash2, Check, X, Camera } from 'lucide-react';
import { Screen } from '../App';
import { useState } from 'react';
import avPadrao from '../assets/avatares/padrao.png';

interface SettingsProps {
  onNavigate: (screen: Screen) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userName: string;
  setUserName: (name: string) => void;
  userPhoto: string | null;
  setUserPhoto: (photo: string | null) => void;
  onPhotoUpload: () => void;
  notifications: {
    reminders: boolean;
    audioAlerts: boolean;
    dailyMystery: boolean;
  };
  setNotifications: (notifs: any) => void;
  activeSub: SubScreen;
  setActiveSub: (sub: SubScreen) => void;
}

type SubScreen = 'main' | 'edit-profile' | 'notifications' | 'privacy' | 'version';

export default function AppSettings({ 
  onNavigate, 
  isDarkMode, 
  onToggleDarkMode, 
  userName, 
  setUserName,
  notifications,
  setNotifications,
  activeSub,
  setActiveSub,
  userPhoto,
  onPhotoUpload
}: SettingsProps) {
  const [tempName, setTempName] = useState(userName);

  const sections = [
    {
      title: 'Preferências',
      items: [
        { 
          id: 'notifications',
          icon: Bell, 
          label: 'Notificações', 
          description: 'Gerenciar horários e lembretes', 
          color: 'text-blue-500',
          onClick: () => setActiveSub('notifications')
        },
        { 
          id: 'theme',
          icon: isDarkMode ? Sun : Moon, 
          label: 'Tema Visual', 
          description: isDarkMode ? 'Modo Escuro' : 'Modo Claro', 
          color: 'text-purple-500',
          isToggle: true,
          value: isDarkMode,
          onAction: onToggleDarkMode
        },
      ]
    },
    {
      title: 'Privacidade e Conta',
      items: [
        { id: 'profile', icon: User, label: 'Meu Perfil', description: 'Nome, foto e informações', color: 'text-orange-500', onClick: () => setActiveSub('edit-profile') },
        { id: 'privacy', icon: Shield, label: 'Privacidade', description: 'Segurança e dados', color: 'text-green-500', onClick: () => setActiveSub('privacy') },
      ]
    },
    {
      title: 'Aplicativo',
      items: [
        { id: 'version', icon: Info, label: 'Versão', description: 'v1.2.5 (Gold Edition)', color: 'text-slate-400', onClick: () => setActiveSub('version') },
      ]
    }
  ];

  if (activeSub === 'edit-profile') {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-950">
        <div className="flex items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setActiveSub('main')} className="text-slate-400 size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-lg font-black text-slate-900 dark:text-white mr-10 uppercase tracking-widest">Editar Perfil</h2>
        </div>
        <div className="p-6 space-y-8 flex-1">
          <div className="flex flex-col items-center">
             <div className="relative mb-6">
                <div className="size-24 rounded-full bg-cover bg-center border-4 border-primary/10 shadow-lg bg-no-repeat" style={{ backgroundImage: `url('${userPhoto || avPadrao}')` }}></div>
                <button 
                  onClick={onPhotoUpload}
                  className="absolute bottom-0 right-0 size-8 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white dark:border-slate-900 shadow-md"
                >
                  <Camera size={14} />
                </button>
             </div>
             <div className="w-full space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
             </div>
          </div>
          
          <button 
            onClick={() => {
              setUserName(tempName);
              setActiveSub('main');
            }}
            className="w-full bg-primary text-white font-black py-4 rounded-3xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-dark transition-all"
          >
            <Check size={20} /> Salvar Alterações
          </button>

          <div className="pt-10">
            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 ml-1 text-center">Área de Perigo</h3>
            <button 
              onClick={() => {
                if (confirm('Tem certeza que deseja apagar sua conta? Esta ação é irreversível.')) {
                  alert('Conta apagada com sucesso (Simulado).');
                  onNavigate('home');
                }
              }}
              className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-3xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
            >
              <Trash2 size={18} /> Apagar Minha Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeSub === 'notifications') {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-950">
        <div className="flex items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setActiveSub('main')} className="text-slate-400 size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-lg font-black text-slate-900 dark:text-white mr-10 uppercase tracking-widest">Notificações</h2>
        </div>
        <div className="p-6 divide-y divide-slate-50 dark:divide-slate-800">
          {[
            { id: 'reminders', label: 'Lembretes de Oração', desc: 'Alertas nos horários agendados' },
            { id: 'audioAlerts', label: 'Sinais Sonoros', desc: 'Reproduzir sons ao notificar' },
            { id: 'dailyMystery', label: 'Mistério do Dia', desc: 'Destaque visual do mistério atual' },
          ].map(item => (
            <div key={item.id} className="flex items-center justify-between py-6">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <button 
                onClick={() => setNotifications({ ...notifications, [item.id]: !((notifications as any)[item.id]) })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${(notifications as any)[item.id] ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${(notifications as any)[item.id] ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSub === 'privacy') {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-950">
        <div className="flex items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setActiveSub('main')} className="text-slate-400 size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-lg font-black text-slate-900 dark:text-white mr-10 uppercase tracking-widest">Privacidade</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
           <h3 className="text-xl font-black text-slate-800 dark:text-white">Termos de Uso e Dados</h3>
           <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
             O aplicativo <strong>Rosário Diário</strong> prioriza a sua privacidade espiritual. Todos os dados inseridos (nome, reflexões do diário, horários de alarme) são armazenados <strong>exclusivamente de forma local</strong> no seu dispositivo.
           </p>
           <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
             Não coletamos, vendemos ou processamos suas informações em servidores externos para fins comerciais. Versões futuras com sincronização em nuvem serão opcionais e exigirão consentimento explícito.
           </p>
           <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
             Ao utilizar este app, você concorda que a segurança dos seus dados locais é de sua responsabilidade através do backup do próprio smartphone.
           </p>
        </div>
      </div>
    );
  }

  if (activeSub === 'version') {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-950">
        <div className="flex items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setActiveSub('main')} className="text-slate-400 size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center text-lg font-black text-slate-900 dark:text-white mr-10 uppercase tracking-widest">Sobre o App</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
           <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-inner">
             <Info size={40} />
           </div>
           <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Rosário Diário</h3>
           <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">v1.2.5 Gold Edition</p>
           <div className="space-y-4 max-w-xs">
             <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] items-start text-left">
               <p className="font-bold text-slate-400 mb-2 uppercase tracking-widest">Nesta Versão:</p>
               <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 font-medium italic">
                 <li>Novo Dashboard de Jornada Premium</li>
                 <li>Edição de Perfil e Nome</li>
                 <li>Biblioteca com artes clássicas</li>
                 <li>Correções de Oração (Typo bugs fixed)</li>
               </ul>
             </div>
             <p className="text-[10px] text-slate-400 font-bold">Desenvolvido com ❤️ para a sua fé.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-center p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <button onClick={() => onNavigate('home')} className="text-slate-400 dark:text-slate-100 size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="flex-1 text-center text-lg font-black text-slate-900 dark:text-white mr-10 uppercase tracking-widest">Configurações</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        <div className="p-6 space-y-8">
          {sections.map(section => (
            <div key={section.title}>
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-4">{section.title}</h3>
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
                {section.items.map(item => (
                  <div 
                    key={item.label} 
                    onClick={() => {
                      if (item.onClick) item.onClick();
                    }}
                    className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${item.color}`}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.label}</p>
                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{item.description}</p>
                      </div>
                    </div>
                    
                    {item.isToggle ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onAction();
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${item.value ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${item.value ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </button>
                    ) : (
                      <ChevronLeft size={16} className="text-slate-300 rotate-180" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={() => onNavigate('home')}
            className="w-full flex items-center justify-center gap-3 p-5 text-red-500 font-bold bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-8"
          >
            <LogOut size={20} />
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
