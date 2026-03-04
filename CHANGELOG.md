# Changelog - Rosário Diário

## [1.5.4] - 2026-03-04
- **Segurança e Privacidade:** Implementado novo modal de exclusão de conta com design premium, garantindo que o usuário tenha total controle e confirmação visual antes de limpar seus dados.
- **Performance de Carregamento:** Otimização na prioridade de inicialização (Assets Visuais > Novena > AdMob), garantindo uma experiência fluida sem engasgos durante o preloading de anúncios.
- **Refinamento de Perfil:** Adição do acesso rápido para exclusão de conta diretamente na aba de Perfil e correções no fluxo de onboarding.

## [1.5.3] - 2026-03-03
- **Novos Avatares:** Adicionados 3 novos avatares religiosos na galeria de escolha de perfil.
- **Melhorias de Estabilidade:** Ajustes finos no processamento de imagens e notificações nativas.

## [1.5.2] - 2026-03-03
- **Otimização de Espaço na Home:** Novo design compacto para os cartões de "Estatísticas" (Terços e Ofensiva), agora em formato retangular horizontal, permitindo que o banner de Novenas e outros conteúdos apareçam sem rolagem em telas menores.
- **Refinamento de Margens:** Ajustes nos paddings e gaps do cabeçalho e botões de ação para uma interface mais densa e elegante.

## [1.5.1] - 2026-03-03
- **Polimento Visual na Experiência Nativa:** Adicionada a nova imagem de Splash Screen de entrada nas orientações Vertical e Horizontal do dispositivo sem cortes nas bordas.
- **Identidade do Sistema:** Integração e ativação do ícone nativo (`ic_stat_rosario`) otimizado nos alertas de novenas e lembretes vindos das Notificações Push do celular.

## [1.5.0] - 2026-03-03
- **Novenas Inteligentes:** Agora você pode rezar grandes Novenas conectadas a base de dados em tempo real, mantendo o controle de dias concluídos com progresso virtual.
- **Agendamento Guiado:** O App lê a data de festa da Novena e agenda um alerta diretamente para o dia oficial no seu calendário!
- **Nova Conquista:** Painel de prêmios enriquecido com o troféu de "Perseverança da Novena" pra quem completar seus primeiros ciclos de 12 repetições.
- **Onboarding e Permissões Unificados:** Fluxo de boas vindas inicial mais claro e rápido para definir suas notificações (Adição das Mensagens Inspiradoras como Toggle separado).

## [1.4.0] - 2026-03-02
- **Nova Splash Screen Educada:** Transições mais suaves, layout centralizado e animado para apresentar o App com mais elegância logo na abertura.
- **Ajuda Gratuita (Ads):** Nova funcionalidade de anúncios recompensados para dar oportunidade a usuários que desejam apoiar o aplicativo mas não podem arcar com o plano premium pago.
- **Design Refinado Responsivo:** Correções de altura máxima (max-h) nas janelas modais da arte de hoje, limitando o rolamento (scroll) do cartão de Conquistas para evitar elementos vazando da tela.
- **Suporte ao Audio:** Correções com os Alarmes garantindo falhas resolvidas.

## [1.3.1] - 2026-02-28
- **Atualização nas Conquistas:** Refinamento na lógica das métricas de dias consecutivos (streak) de oração, e garantia de que os limites do progresso de cada insígnia apareçam corretamente.
- **Bugfixes Finais:** Inclusão correta das atualizações (que faltaram na build anterior) para integrar as correções com a nova compilação no Android Studio.

## [1.3.0] - 2026-02-28
- **Novo Dashboard de Conquistas:** Nova interface de gamificação refinada com medidores de progresso para retenção de rotina.
- **Novas Insígnias:** Adicionadas missões como 'Alma Generosa' e 'Estudioso da Palavra'. Alinhamento da contagem do 'Guardião da Alvorada' para considerar o ciclo local de 24 horas real.
- **Área Premium (Upsell aprimorado):** A aba Biblioteca agora apresenta Cânones em lugar de destaque, bloqueando o modo offline da Bíblia até aprovação, gerando desejo nos usuários *Free*.
- **Configurações Refinadas:** Nova funcionalidade drástica de *Deep Clean* ("Apagar Minha Conta" & "Sair da Conta") com alertas nativos, limpando devidamente caches do sistema.
- **Ícone e Splash Screen:** Geração de novos ícones baseados no vitral das missões, com dimensões configuradas em HD para as centenas de resoluções de telas do Android App Bundle.

## [1.2.1] - 2026-02-28
- **Melhorias de Estabilidade:** Correção definitiva do armazenamento dos alarmes, garantindo persistência mesmo após o app fechar totalmente.
- **Lembretes Diários Aprimorados:** Otimização dos lembretes nativos (9h, 15h, 20h) para tocarem de forma garantida no Android 8+.
- **Refinamento na Biblioteca:** Reposicionamento do anúncio na Biblioteca e melhor distribuição visual que valoriza mais o acesso à Bíblia.
- **Ajustes de UI:** Painel de assinatura do Premium aperfeiçoado (bordas corrigidas e botões organizados) e contador verdadeiro de Dias na ofensiva da Home.

## [1.2.0] - 2026-02-27
- **Nova Visualização Responsiva:** Aperfeiçoamento no layout principal e durante a oração para melhor aproveitamento de tela em iPads, Tablets e computadores.
- **Sons do Próprio Sistema:** Integração nativa remodelada; agora é possível selecionar exatamente os mesmos toques padrão do seu iOS/Android para despertar o Rosário.
- **Menu de Avatares:** Novo formato de carrossel no seletor de perfil, tornando mais rápido e atrativo configurar seu santo/avatar favorito.
- **Doações Facilitadas:** Reformulação visual da barra de edição de perfil e integração dos modais (Premium x Doação Única) para uma transição e entendimento mais simples para os apoiadores.
- **Aprimoramentos Em Background:** Fix no mecanismo de armazenamento da RAM para a memória local, garantindo que sons e ajustes do alarme sobrevivam ao desligar por completo o aplicativo.

## [1.1.11] - 2026-02-27
- **Nova Câmera de Perfil:** Correção no upload de fotos, garantindo estabilidade no Android.
- **Novos Avatares:** Adição de mais opções de avatares ilustrativos para o perfil.
- **Alarmes Avançados:** Novo sistema otimizado, possibilitando configurar até 3 alarmes diários independentes.
- **Notificações Confiáveis:** Suporte nativo completo a alertas visuais em tela cheia (Full-Screen Intent) para os alarmes saltarem no horário correto mesmo de tela apagada (Android 10+).
- **Vibração Configurável:** Adicionada a opção na tela de Configurações para ligar/desligar a vibração tátil (haptics) das contas durante o Terço.
- **Melhorias Visuais:** Refinamentos de textos, pré-visualização em edição de perfil e unificação dos botões de ativação (Toggle Switch) para o Alarme.

