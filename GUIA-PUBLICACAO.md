# 🚀 Guia de Publicação — Lotofácil PRO v3

## O que você vai ter no final
✅ App online com link (ex: `lotofacil-pro.vercel.app`)  
✅ Funciona no celular como app nativo (ícone na tela inicial)  
✅ Atualiza resultados automaticamente  
✅ Funciona offline (PWA)  
✅ Totalmente gratuito  

---

## Pré-requisitos (instalar uma vez só)

### 1. Node.js
Baixe em: https://nodejs.org  
Escolha a versão **LTS** e instale normalmente.

### 2. Git
Baixe em: https://git-scm.com/downloads  
Instale com as opções padrão.

### 3. Conta no GitHub (gratuita)
Crie em: https://github.com/signup

### 4. Conta na Vercel (gratuita)
Crie em: https://vercel.com/signup  
(Use "Continue with GitHub" para vincular automaticamente)

---

## Passo a Passo

### ETAPA 1 — Configurar o projeto no seu computador

Abra o **Terminal** (Mac/Linux) ou **PowerShell** (Windows) e execute:

```bash
# Navegue até onde quer salvar o projeto (ex: Documentos)
cd ~/Documents

# Descompacte a pasta lotofacil-pro que você baixou
# (já está pronta, não precisa criar nada)

# Entre na pasta
cd lotofacil-pro

# Instale as dependências
npm install

# Teste localmente (abrirá em http://localhost:5173)
npm run dev
```

Se abriu no navegador e está funcionando ✅ — próxima etapa!

---

### ETAPA 2 — Subir para o GitHub

```bash
# Inicializa o Git na pasta
git init

# Adiciona todos os arquivos
git add .

# Cria o primeiro commit
git commit -m "Lotofácil PRO v3 - lançamento inicial"
```

Agora no site do GitHub:
1. Clique em **"New repository"** (botão verde)
2. Nome: `lotofacil-pro`
3. Deixe como **Public**
4. **NÃO** marque "Add README"
5. Clique em **"Create repository"**

O GitHub vai mostrar comandos. Execute os dois últimos:

```bash
git remote add origin https://github.com/SEU_USUARIO/lotofacil-pro.git
git push -u origin main
```

(substitua SEU_USUARIO pelo seu nome de usuário do GitHub)

---

### ETAPA 3 — Publicar na Vercel

1. Acesse https://vercel.com e faça login
2. Clique em **"Add New Project"**
3. Clique em **"Import"** ao lado do repositório `lotofacil-pro`
4. Em **Framework Preset** selecione **Vite**
5. Clique em **"Deploy"** 🚀

Aguarde ~1 minuto. Pronto! Você receberá um link como:
```
https://lotofacil-pro.vercel.app
```

---

### ETAPA 4 — Instalar como app no celular

#### iPhone (Safari):
1. Abra o link no **Safari**
2. Toque no ícone de **compartilhar** (quadrado com seta ↑)
3. Toque em **"Adicionar à Tela de Início"**
4. Confirme o nome e toque em **"Adicionar"**

#### Android (Chrome):
1. Abra o link no **Chrome**
2. Toque nos **3 pontinhos** ⋮ no canto superior direito
3. Toque em **"Adicionar à tela inicial"**
4. Confirme e toque em **"Adicionar"**

O app vai aparecer na tela inicial com ícone próprio, igual a um app nativo! 📱

---

## Atualizações futuras

Quando quiser atualizar o app com melhorias:

```bash
# Faça as alterações nos arquivos
# Depois execute:
git add .
git commit -m "descrição da atualização"
git push
```

A Vercel detecta automaticamente e publica a nova versão em ~1 minuto.

---

## Personalizar o domínio (opcional, gratuito)

Na Vercel você pode mudar a URL para algo mais fácil:
1. Vá em **Settings → Domains**
2. Clique em **"Edit"** ao lado do domínio atual
3. Digite o nome que quiser (ex: `meu-lotofacil`)
4. Salve → novo link: `meu-lotofacil.vercel.app`

---

## ⚠️ Nota sobre a API de atualização

O app usa a API da Anthropic para buscar resultados novos automaticamente.
Esta integração funciona dentro do Claude.ai (artifact).

**Para funcionar em produção (no servidor da Vercel), você precisa de uma chave da API Anthropic.**

### Como obter a chave (gratuita para começar):
1. Acesse: https://console.anthropic.com
2. Crie uma conta
3. Vá em **API Keys** → **Create Key**
4. Copie a chave (começa com `sk-ant-...`)

### Como configurar na Vercel:
1. No painel da Vercel, entre no seu projeto
2. Vá em **Settings → Environment Variables**
3. Adicione: `VITE_ANTHROPIC_KEY` = `sk-ant-sua-chave-aqui`
4. Clique em **Save** e faça um novo deploy

Sem a chave, o botão "Atualizar" não funcionará, mas todos os dados dos 500 concursos já embutidos continuam funcionando normalmente.

---

## Estrutura do projeto

```
lotofacil-pro/
├── src/
│   ├── App.jsx        ← Código principal do app
│   └── main.jsx       ← Ponto de entrada
├── public/
│   ├── manifest.json  ← Configuração PWA
│   ├── sw.js          ← Service Worker (offline)
│   └── favicon.svg    ← Ícone do site
├── index.html         ← HTML base
├── vite.config.js     ← Configuração do Vite
├── package.json       ← Dependências
└── vercel.json        ← Configuração do deploy
```

---

## Suporte

Qualquer dúvida, fale com o Claude! 😊

> ⚠️ *Lembre-se: análise estatística para entretenimento. Loteria é aleatória. Jogue com responsabilidade.*
