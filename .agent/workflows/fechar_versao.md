---
description: Como "fechar a versão" (incrementar versao de release app)
---

Sempre que o usuário digitar `fechar versão` ou `feche a versão`, o sistema deverá seguir esse fluxo para realizar a bump e o registro das modificações para o Play Console da próxima build.

## 1. Incrementar Version Code e Name no Gradle
1. Abra o arquivo `android/app/build.gradle`.
2. Busque pela propriedade `versionCode` (Ex: `versionCode 11`) e **incremente +1** no número inteiro (Ex: `versionCode 12`).
3. Verifique o que foi criado / editado do histórico e decida como atualizar a propriedade `versionName` (SemVer: M.m.p). 
   - Exemplo: de `1.1.11` para `1.1.12` (correções curtas), ou para `1.2.0` (features novas), ou `2.0.0` (major rewrite).
   - Use o contexto ou pergunte à pessoa qual tipo de bump deverá ser feito.

## 2. Refletir o Version Name em Package.json
1. Abra o arquivo `package.json`.
2. Mude a linha `"version": "x.y.z"` para coincidir com a que você recém atualizou no passo anterior.

## 3. Refletir na Tela de Configurações
1. No arquivo `src/components/Settings.tsx`, o aplicativo exibe a versão manualmente.
   - Encontre a opção de navegação `Versão` ou onde está descrito (Ex: `description: 'v1.1.11 (Gold Edition)'`).
   - Mude para o número novo, tanto nas abas / listas como no modal visual principal `v1.2.0 Gold Edition`.

## 4. Atualizar o CHANGELOG.md (Google Play Notes)
1. Edite o arquivo `/CHANGELOG.md` na raiz.
2. Crie um novo cabeçalho para esta versão. Ex: `## [1.2.0] - 2026-X-Y`.
3. Escreva em formato de tópicos objetivos e persuasivos quais foram as novidades (bugs resolvidos, visuais ajustados, features novas). Lembre-se que o usuário copia e cola essa pequena lista lá na tela de "Notas de Versão" do Google Play Console!

Feito tudo isso, avise-o! Crie um commit se for solicitado, e lembre ao desenvolvedor que os pacotes locais agora estão atualizados.
