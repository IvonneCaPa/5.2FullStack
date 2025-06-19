# 🚀 Proyecto FullStack 5.2

## 📋 Descripción del Proyecto
Este es un proyecto **FullStack** que incluye:
- **Backend**: API RESTful en Laravel 12 con autenticación OAuth2 (Passport)
- **Frontend**: Aplicación React con Vite, TailwindCSS y React Router
- **Base de datos**: Soporte para SQLite (por defecto) o MySQL
- **Documentación**: Swagger/OpenAPI integrado

---

## 🛠️ Requisitos Previos

### 1. **Software Necesario**
- **PHP >= 8.2** (con extensiones: pdo, pdo_sqlite, pdo_mysql, openssl, mbstring, tokenizer, xml, ctype, json, bcmath)
- **Composer** (gestor de dependencias de PHP)
- **Node.js >= 18** y **npm**
- **Git**

### 2. **Opcional pero Recomendado**
- **XAMPP/WAMP/MAMP** (para entorno de desarrollo local)
- **MySQL >= 8.0** (si prefieres usar MySQL en lugar de SQLite)

---

## 📥 Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/IvonneCaPa/5.2FullStack.git
cd 5.2FullStack
```

---

## 🐘 Paso 2: Configurar el Backend (Laravel)

### 2.1 Instalar dependencias de PHP
```bash
cd backend
composer install
```

### 2.2 Configurar el archivo de entorno
```bash
cp .env.example .env 
```

### 2.3 Generar clave de aplicación
```bash
php artisan key:generate
```

### 2.4 Configurar la base de datos

#### **Opción - MySQL usando phpMyAdmin (recomendado para usuarios de XAMPP/WAMP):**
1. Inicia XAMPP/WAMP/MAMP y asegúrate de que Apache y MySQL estén activos.
2. Abre tu navegador y ve a: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Haz clic en "Nueva" y crea una base de datos llamada `sprint5_fullstack` con cotejamiento `utf8mb4_unicode_ci`.
4. Configura tu archivo `.env` así:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sprint5_fullstack
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Guarda los cambios.

### 2.5 Crear enlace simbólico para storage
```bash
php artisan storage:link
```

### 2.6 Copia la carpeta photos
  La carpeta photos que esta en la raiz del proyecto copiala o muevela a:
  backend/public/storage

### 2.7 Ejecutar migraciones y seeders
```bash
php artisan migrate:fresh --seed
```

### 2.8 Instalar Passport y crear los clientes necesarios
```bash
php artisan passport:install
```
> Si reseteas la base de datos, **siempre** ejecuta este comando después.


---
## ⚛️ Paso 3: Configurar el Frontend (React)

### 3.1 Instalar dependencias de Node.js
```bash
cd ../frontend
npm install
```

---
## 🚀 Paso 4: Ejecutar el Proyecto

### 4.1 Iniciar el servidor backend
```bash
cd backend
php artisan serve
```
El backend estará disponible en: `http://localhost:8000`

### 4.2 En otra terminal, iniciar el frontend
```bash
cd frontend
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

---

## 🧪 Paso 5: Verificar la Instalación

- Visita: `http://localhost:5173`

- Ingresa con los siguientes datos:
- Email: admin@admin.com
- Password: admin123


- **Estructura del proyecto:**
```
5.2FullStack/
├── backend/          # API Laravel
│   ├── app/         # Controladores, Modelos, etc.
│   ├── database/    # Migraciones y Seeders
│   └── routes/      # Rutas de la API
└── frontend/        # Aplicación React
    ├── src/         # Código fuente React
    └── components/  # Componentes reutilizables
```
