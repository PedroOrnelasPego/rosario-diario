import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ArrowRight, User, Check, Sparkles, Moon, Sun, BellOff, Bell, ChevronUp, ChevronDown } from 'lucide-react';
import { Camera as CapCamera } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';

import av1 from '../assets/avatares/1.png';
import av2 from '../assets/avatares/2.png';
import av3 from '../assets/avatares/3.png';
import av4 from '../assets/avatares/4.png';
import av5 from '../assets/avatares/5.png';
import av6 from '../assets/avatares/6.png';
import av7 from '../assets/avatares/7.png';
import avPadrao from '../assets/avatares/padrao.png';

interface OnboardingProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onPhotoUpload: () => Promise<void>;
  onComplete: (data: { 
    name: string; 
    photo: string | null; 
    notifications: boolean;
    dailyProverbs: boolean;
    novenaNotifications: boolean;
    theme: 'light' | 'dark';
  }) => void;
}

export default function Onboarding({ isDarkMode, onToggleDarkMode, onPhotoUpload, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [useNotifications, setUseNotifications] = useState(true);
  const [useDailyMessages, setUseDailyMessages] = useState(true);
  const [useNovenaNotifications, setUseNovenaNotifications] = useState(true);
  
  const avatars = [av1, av2, av3, av4, av5, av6, av7];

  const requestPermissions = async () => {
    try {
      // Request Notifications
      const notifStatus = await LocalNotifications.checkPermissions();
      if (notifStatus.display !== 'granted') {
        const notifPerm = await LocalNotifications.requestPermissions();
        console.log('Notification permission result:', notifPerm.display);
      }

      // Request Camera
      const camStatus = await CapCamera.checkPermissions();
      if (camStatus.camera !== 'granted') {
        const camPerm = await CapCamera.requestPermissions();
        console.log('Camera permission result:', camPerm.camera);
      }
    } catch (e) {
      console.error("Error requesting native permissions:", e);
    }
    nextStep();
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleFinish = () => {
    onComplete({ 
      name, 
      photo, 
      notifications: useNotifications,
      dailyProverbs: useDailyMessages,
      novenaNotifications: useNovenaNotifications,
      theme: isDarkMode ? 'dark' : 'light' 
    });
  };

  const steps = [
    { id: 1, title: 'Permissões', subtitle: 'Para uma melhor experiência, precisamos de algumas autorizações.' },
    { id: 2, title: 'Bem-vindo(a)', subtitle: 'Como gostaria de ser chamado(a)?' },
    { id: 3, title: 'Estilo do App', subtitle: 'Escolha o tema que mais lhe agrada' },
    { id: 4, title: 'Sua Identidade', subtitle: 'Escolha um avatar ou use sua foto' },
    { id: 5, title: 'Tudo Pronto!', subtitle: 'Suas preferências foram salvas com sucesso. Agora você já pode iniciar sua jornada espiritual.' }
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-white dark:bg-slate-950 flex flex-col p-6 sm:p-10 overflow-x-hidden transition-colors duration-500">
      {/* Progress Bar Top */}
      <div className="flex justify-center gap-1.5 mb-8">
        {steps.map(s => (
          <div key={s.id} className={`h-1 rounded-full transition-all duration-500 ${step >= s.id ? 'w-10 bg-primary' : 'w-4 bg-slate-100 dark:bg-slate-800'}`}></div>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full"
          >
            <div className={`flex flex-col items-center text-center ${step === 5 ? '' : 'mb-10'}`}>
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-inner">
                {step === 1 && (useNotifications || useNovenaNotifications ? <Bell size={32} /> : <BellOff size={32} />)}
                {step === 2 && <Sparkles size={32} className="animate-pulse" />}
                {step === 3 && (isDarkMode ? <Moon size={32} /> : <Sun size={32} />)}
                {step === 4 && <User size={32} />}
                {step === 5 && <Check size={32} className="stroke-[3]" />}
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                {steps[step-1].title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium px-4">
                {steps[step-1].subtitle}
              </p>
            </div>

            {/* Step Content */}
            <div className={`flex items-center justify-center ${step === 5 ? 'h-0' : 'min-h-[220px]'}`}>
              {step === 1 && (
                <div className="w-full space-y-6 text-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        {useNotifications ? <Bell size={20} /> : <BellOff size={20} />}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Notificações Diárias</p>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tight">Para seus lembretes de oração</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setUseNotifications(!useNotifications);
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${useNotifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${useNotifications ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </button>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        {useDailyMessages ? <Bell size={20} /> : <BellOff size={20} />}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Mensagens Inspiradoras</p>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tight">Receber versículos durante o dia</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setUseDailyMessages(!useDailyMessages);
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${useDailyMessages ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${useDailyMessages ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </button>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        {useNovenaNotifications ? <Bell size={20} /> : <BellOff size={20} />}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Notificações da Novena</p>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tight">Receber lembretes de oração da Novena</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setUseNovenaNotifications(!useNovenaNotifications);
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${useNovenaNotifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${useNovenaNotifications ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-6 leading-relaxed mt-4">
                    Clique em continuar para autorizar os alertas e o uso da câmera.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="w-full space-y-4">
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome ou apelido"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[28px] py-5 px-6 font-bold text-center text-xl text-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-300"
                  />
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] px-8 leading-relaxed opacity-70">
                    Sua jornada espiritual começa com este nome.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  <button 
                    onClick={() => isDarkMode && onToggleDarkMode()}
                    className={`p-6 rounded-[32px] border-2 flex flex-col items-center gap-4 transition-all shadow-sm ${!isDarkMode ? 'bg-white border-primary shadow-primary/10 ring-4 ring-primary/5' : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-400'}`}
                  >
                    <div className={`size-12 rounded-2xl flex items-center justify-center ${!isDarkMode ? 'bg-primary/10 text-primary' : 'bg-slate-200 dark:bg-slate-800'}`}>
                      <Sun size={28} />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest">Claro</span>
                  </button>
                  <button 
                    onClick={() => !isDarkMode && onToggleDarkMode()}
                    className={`p-6 rounded-[32px] border-2 flex flex-col items-center gap-4 transition-all shadow-sm ${isDarkMode ? 'bg-slate-900 border-primary shadow-primary/10 ring-4 ring-primary/5' : 'bg-slate-50 dark:bg-slate-100 border-transparent text-slate-400'}`}
                  >
                    <div className={`size-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-primary/20 text-primary' : 'bg-slate-200 dark:bg-slate-300'}`}>
                      <Moon size={28} />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-white">Escuro</span>
                  </button>
                </div>
              )}

              {step === 4 && (
                <div className="w-full flex flex-col items-center gap-8">
                  <div className="relative">
                    <div 
                      className="size-40 rounded-[48px] border-4 border-slate-100 dark:border-slate-800 bg-cover bg-center shadow-2xl overflow-hidden transition-all duration-500"
                      style={{ backgroundImage: `url('${photo || avPadrao}')` }}
                    >
                    </div>
                    <button 
                      onClick={async () => {
                        await onPhotoUpload();
                        // Re-fetch photo from localStorage if needed, or better, 
                        // App.tsx should pass the updated userPhoto back if we are using it here.
                        // For simplicity, we'll let the user pick from avatars or App state updates.
                        const savedData = localStorage.getItem('rosario_user_data');
                        if (savedData) {
                          const parsed = JSON.parse(savedData);
                          if (parsed.photo) setPhoto(parsed.photo);
                        }
                      }}
                      className="absolute -bottom-1 -right-1 size-12 bg-primary border-4 border-white dark:border-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-all"
                    >
                      <Camera size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-3 mt-4">
                    {/* Sem avatar: usa o padrão */}
                    <button 
                      onClick={() => setPhoto(null)}
                      className={`size-12 rounded-2xl border-2 bg-cover bg-center transition-all shadow-sm ${!photo ? 'border-primary bg-primary/10 scale-110 shadow-lg' : 'border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100'}`}
                      style={{ backgroundImage: `url('${avPadrao}')` }}
                    />
                    {avatars.map((src, i) => (
                      <button 
                        key={i}
                        onClick={() => setPhoto(src)}
                        className={`size-12 rounded-2xl border-2 bg-cover bg-center transition-all shadow-sm ${photo === src ? 'border-primary scale-110 z-10 shadow-lg' : 'border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100'}`}
                        style={{ backgroundImage: `url('${src}')` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="w-full">
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="max-w-md mx-auto w-full space-y-4 pt-10">
        <button
          disabled={step === 2 && !name.trim()}
          onClick={step === 1 ? requestPermissions : (step === 5 ? handleFinish : nextStep)}
          className="w-full bg-primary disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-300 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-primary/25 flex items-center justify-center gap-3 hover:bg-primary-dark transition-all active:scale-[0.97]"
        >
          {step === 5 ? 'Começar Minha Jornada' : 'Continuar'}
          {step === 5 ? <Check size={22} strokeWidth={3} /> : <ArrowRight size={22} strokeWidth={3} />}
        </button>
        
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="w-full py-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Voltar
          </button>
        )}
      </div>
    </div>
  );
}
