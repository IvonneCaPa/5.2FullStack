# 🚀 FullStack Project 5.2

## 📋 Project Description
This is a **FullStack** project that includes:
- **Backend**: RESTful API in Laravel 12 with OAuth2 authentication (Passport)
- **Frontend**: React application with Vite, TailwindCSS and React Router
- **Database**: Support for SQLite (default) or MySQL
- **Documentation**: Integrated Swagger/OpenAPI

---

## 🛠️ Prerequisites

### 1. **Required Software**
- **PHP >= 8.2** (with extensions: pdo, pdo_sqlite, pdo_mysql, openssl, mbstring, tokenizer, xml, ctype, json, bcmath)
- **Composer** (PHP dependency manager)
- **Node.js >= 18** and **npm**
- **Git**

### 2. **Optional but Recommended**
- **XAMPP/WAMP/MAMP** (for local development environment)
- **MySQL >= 8.0** (if you prefer to use MySQL instead of SQLite)

---

## 📥 Step 1: Clone the Repository
```bash
git clone https://github.com/IvonneCaPa/5.2FullStack.git
cd 5.2FullStack
```

---

## 🐘 Step 2: Configure the Backend (Laravel)

### 2.1 Install PHP dependencies
```bash
cd backend
composer install
```

### 2.2 Configure the environment file
```bash
cp .env.example .env 
```

### 2.3 Generate application key
```bash
php artisan key:generate
```

### 2.4 Configure the database

#### **Option - MySQL using phpMyAdmin (recommended for XAMPP/WAMP users):**
1. Start XAMPP/WAMP/MAMP and make sure Apache and MySQL are active.
2. Open your browser and go to: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Click "New" and create a database called `sprint5_fullstack` with collation `utf8mb4_unicode_ci`.
4. Configure your `.env` file like this:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sprint5_fullstack
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Save the changes.

### 2.5 Create symbolic link for storage
```bash
php artisan storage:link
```

### 2.6 Copy the photos folder
  Copy or move the photos folder that is in the project root to:
  backend/public/storage

### 2.7 Run migrations and seeders
```bash
php artisan migrate:fresh --seed
```

### 2.8 Install Passport and create necessary clients
```bash
php artisan passport:install
```
> If you reset the database, **always** run this command afterwards.


---
## ⚛️ Step 3: Configure the Frontend (React)

### 3.1 Install Node.js dependencies
```bash
cd ../frontend
npm install
```

---
## 🚀 Step 4: Run the Project

### 4.1 Start the backend server
```bash
cd backend
php artisan serve
```
The backend will be available at: `http://localhost:8000`

### 4.2 In another terminal, start the frontend
```bash
cd frontend
npm run dev
```
The frontend will be available at: `http://localhost:5173`

---

## 🧪 Step 5: Verify the Installation

- Visit: `http://localhost:5173`

- Login with the following credentials:
- Email: admin@admin.com
- Password: admin123


- **Project structure:**
```
5.2FullStack/
├── backend/          # Laravel API
│   ├── app/         # Controllers, Models, etc.
│   ├── database/    # Migrations and Seeders
│   └── routes/      # API Routes
└── frontend/        # React Application
    ├── src/         # React source code
    └── components/  # Reusable components
```
