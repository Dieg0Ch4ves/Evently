# 🎉 Evently - APP de Gestão de Eventos

Bem-vindo ao **Evently**, uma plataforma completa para quem quer **criar**, **gerenciar** e **participar de eventos** com facilidade. Organizadores têm controle total sobre seus eventos, enquanto participantes podem se inscrever, visualizar detalhes e acompanhar tudo de forma prática!

---

## 🌐 Acesso ao Projeto

- 🔗 **Front-end:** [https://evently-frontend-latest.onrender.com/](https://evently-frontend-latest.onrender.com/)
- 🔗 **Back-end (API):** [https://evently-backend-latest.onrender.com](https://evently-backend-latest.onrender.com)

---

## 🚀 Funcionalidades

### 👤 **Usuários**

- Cadastro e login (com autenticação segura via JWT ou OAuth).
- Perfil completo com dados pessoais e histórico de eventos cadastrados ou participados.

### 📅 **Eventos (CRUD Completo)**

- Criação, edição, exclusão e listagem de eventos.
- Informações como: título, descrição, data, local, capacidade máxima e imagem/banner.
- Controle de participantes com limite de inscritos por evento.

### ✅ **Inscrições**

- Inscrição e cancelamento de participação em eventos.
- Sistema de vagas disponíveis em tempo real.

### 📊 **Dashboard Administrativo**

- Visão geral com estatísticas como número de inscritos por evento.
- Gerenciamento de usuários e eventos com facilidade.

### 🔍 **Busca e Filtros**

- Busca por nome, categoria ou local.
- Filtros por data ou capacidade para facilitar a descoberta de eventos.

---

## 🛠️ Tecnologias Utilizadas

### 🖥️ **Front-End**

- **React JS** — Para desenvolvimento de aplicativos web mais fácil e eficiente.
- **Material UI** — Interface moderna e responsiva.

### ⚙️ **Back-End**

- **Java com Spring Boot** — Estrutura robusta para APIs REST.
- **Spring Security com JWT** — Autenticação e autorização seguras.
- **Endpoints RESTful** — Para usuários, eventos e inscrições.

### 🗄️ **Banco de Dados**

- **PostgreSQL** — Banco relacional poderoso e confiável.
- **JPA + Hibernate** — Mapeamento de entidades com boas práticas.

### 🐳 **DevOps**

- **Docker** — Containerização do front, back e banco de dados.
- **CI/CD com GitHub Actions** — Deploy automatizado e eficiente.

### ☁️ **Hospedagem**

- **Front-end:** Render.
- **Back-end:** Render.
- **Banco de Dados:** Render.

### 🧪 **Testes**

- **Back-end:**
  - Testes unitários com `JUnit` e `Mockito`.
  - Testes de integração com Postman.

---

## 🧭 Como Rodar o Projeto Localmente

### 🔧 Pré-requisitos

- Node.js (v18+)
- Java 17+
- Docker (opcional, mas recomendado)
- PostgreSQL (se não usar Docker)
- Git

---

### 📦 1. Clone o repositório

```bash
git clone https://github.com/Dieg0Ch4ves/evently.git
cd evently
```

### 🖥️ 2. Rodar o Front-End (React)

```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

### ☕ 3. Rodar o Back-End (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

A API estará disponível em: http://localhost:8080

### 🐘 4. Banco de Dados

Você pode usar o banco PostgreSQL local ou subir com Docker:

#### Usando Docker:

```bash
docker-compose up -d
```

### ⚙️ 5. Configurar Variáveis de Ambiente

#### Frontend (.env)

```env
VITE_BASE_URL=http://localhost:8080 # OU OUTRA URL
```

#### Backend (.env)

```env
DATABASE_URL=seu_db
DATABASE_USERNAME=seu_username_db
DATABASE_PASSWORD=sua_senha_db

EMAIL_USER=seu_email_servico
EMAIL_PASSWORD=sua_senha_app

FRONT_URL=sua_url_front

JWT_SECRET=sua_secret
```

### ✅ Pronto!

Agora você tem o Evently rodando localmente! 🎉
Sinta-se à vontade para contribuir, testar e expandir a aplicação. 🚀

### 🤝 Contribuições

Contribuições são super bem-vindas!
Abra uma issue, envie um pull request ou entre em contato se quiser colaborar.
