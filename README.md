# Project Typescript | Expressjs | Sequelize

## Frontend => https://github.com/haetamm/thenorth

---

## 📋 Project Setup

### Prerequisites
- Docker & Docker Compose installed
- Node.js 22+ (if running locally without Docker)
- PostgreSQL 17+ (if running locally without Docker)

### 1. **Initial Setup**

Clone the repository:
```sh
git clone <repository-url>
cd thenorth-api
```
---

## 🐳 Development Setup (With Docker) - RECOMMENDED

### 1. **Create Environment File**

Copy and edit the environment file:
```sh
cp .env.dev.example .env.dev
```

Edit `.env.dev` with your configuration:
```env
NODE_ENV=development
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=app_dev
DB_HOST=db
DB_PORT=5432
JWT_SECRET=your-secret-key-here
JWT_EXPIRES=45m
```

### 2. **Start Docker Containers**

Build and start the containers:
```sh
docker-compose -f docker-compose.dev.yml up --build
```

Wait for the database to be ready (you'll see `service_healthy` in logs).

### 3. **Database Migration**

Run this command in a new terminal:
```sh
docker compose -f docker-compose.dev.yml run --rm app npm run migrate
```

Revert the most recently applied migration.
```sh
docker compose -f docker-compose.dev.yml run --rm app npm run migrate-undo
```

### 4. **Database Seeder**

Run this command in a new terminal:
```sh
docker compose -f docker-compose.dev.yml run --rm app npm run seed
```

This will:
- ✅ Run migrations
- ✅ Seed the database with initial data

### 5. **Access the Application**

Open your browser and go to:
- **API Base URL**: [http://localhost:8000](http://localhost:8000)

---

## 🏗️ Production Setup (With Docker) - RECOMMENDED

### 1. **Create Environment File**

Copy and edit the environment file:
```sh
cp .env.prod.example .env.prod
```

Edit `.env.prod` with your configuration:
```env
NODE_ENV=production

DATABASE_URL=[supbase url - Connection pooler]
JWT_SECRET=dkfjdkfjdlfjdkfjldjf
JWT_EXPIRES=45m
```

### 2. **Start Docker Containers**

Build and start the containers:
```sh
docker-compose -f docker-compose.prod.yml up --build
```

### 3. **Database Migration**

Run this command in a new terminal:
```sh
docker compose -f docker-compose.prod.yml run --rm app npm run migrate:prod
```
### 4. **Database Seeder**

Run this command in a new terminal:
```sh
docker compose -f docker-compose.prod.yml run --rm app npm run seed:prod
```

This will:
- ✅ Run migrations
- ✅ Seed the database with initial data

### 5. **Access the Application**

Open your browser and go to:
- **API Base URL**: [http://localhost:8000](http://localhost:8000)

---

## 🛠️ Available NPM Scripts

```sh
npm run tsc         # Compile TypeScript to JavaScript
npm run ts          # Compile TypeScript (watch mode)
npm run dev         # Run development server with ts-node-dev
npm run migrate     # Run database migrations
npm run migrate-undo # Undo last migration
npm run seed        # Seed the database
```

---

**Happy Coding! 🚀**