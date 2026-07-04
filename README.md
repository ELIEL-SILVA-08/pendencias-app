# GestorEduc - Backlog de Pendências

Este repositório contém o sistema independente de Backlog e Tarefas do GestorEduc, desenvolvido para gerenciar e acompanhar melhorias, bugs e atividades da equipe de desenvolvimento.

## 🚀 Tecnologias Utilizadas
- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (com design Glassmorphism e Dark Mode premium)
- **Banco de Dados:** PostgreSQL hospedado no Neon (aproveitando a mesma instância do sistema escolar)
- **ORM:** Prisma

## 📌 Funcionalidades
O sistema utiliza uma abordagem ágil visual semelhante a um quadro **Kanban**:
- **Três Colunas Principais:** Pendente, Em Andamento e Concluído.
- **Identificação Visual:** Tags de urgência automáticas (Baixa, Média, Alta e Crítica) baseadas em cores de fácil leitura.
- **Atribuição:** Exibição clara de qual Desenvolvedor (Dev) foi designado para cada tarefa.
- **Mobilidade:** Transição de status das tarefas com apenas 1 clique através das setas direcionais nos cards.

---

## 🛠️ Como rodar o projeto localmente

1. **Instale as dependências**
   Certifique-se de ter o Node.js instalado e rode:
   ```bash
   npm install
   ```

2. **Configuração do Banco de Dados (.env)**
   O projeto exige a URL de conexão com o seu banco Neon. No diretório raiz do projeto, garanta que o arquivo `.env` contenha a sua URL de produção:
   ```env
   DATABASE_URL="postgresql://USUARIO:SENHA@HOST/neondb?sslmode=require"
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🚀 Como fazer o Deploy (Hospedar na Vercel)

A Vercel é a plataforma ideal (e gratuita) para hospedar sistemas Next.js. Siga os passos abaixo para colocar o sistema no ar:

1. **Crie o Repositório no seu GitHub**
   Faça o push (envio) dos arquivos desta pasta para um novo repositório na sua conta do GitHub chamado `gestoreduc-backlog` (ou qualquer nome de sua preferência).

2. **Vercel: Importar o Projeto**
   - Acesse [Vercel.com](https://vercel.com/) e faça login com sua conta do GitHub.
   - Clique no botão **Add New...** e selecione **Project**.
   - Procure pelo repositório que você acabou de criar e clique em **Import**.

3. **Vercel: Variáveis de Ambiente (MUITO IMPORTANTE)**
   - Antes de clicar no botão final de *Deploy*, abra a seção **Environment Variables**.
   - Crie uma variável chamada exata de `DATABASE_URL` e cole a mesma URL de conexão do Neon DB que você tem no seu `.env` local.
   - Agora sim, clique em **Deploy** e aguarde 1 a 2 minutos.

---

## 🌐 Como configurar o subdomínio `pendencias.gestoreduc.com.br`

Depois que o site estiver online na Vercel, o último passo é configurar o link bonito:

1. Na Vercel, acesse a aba **Settings** do seu projeto e vá em **Domains**.
2. Digite `pendencias.gestoreduc.com.br` no campo e adicione.
3. A Vercel exibirá um aviso dizendo que você precisa configurar um **CNAME** no seu DNS. Ela fornecerá um valor, que normalmente é `cname.vercel-dns.com`.
4. Vá até a plataforma onde o seu domínio principal (gestoreduc.com.br) está registrado e hospedado (ex: Cloudflare, Hostinger, Registro.br, etc).
5. Na aba de configuração avançada de **Zonas DNS**, adicione um novo registro do tipo **CNAME**:
   - **Nome:** `pendencias`
   - **Alvo / Valor:** `cname.vercel-dns.com` (ou o valor fornecido pela Vercel)
6. Salve. As alterações de DNS podem levar de alguns minutos até algumas horas para se propagarem completamente pelo mundo.

🎉 **Fim! Seu backlog está no ar, pronto para a equipe.**
