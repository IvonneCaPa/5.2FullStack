# 🚀 Guía de Instalación - Proyecto FullStack 5.2

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
git clone [URL_DEL_REPOSITORIO]
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
cp .env.example .env # Si existe .env.example
# Si no existe, crea un archivo .env manualmente con la siguiente configuración mínima:
```

```env
APP_NAME="5.2 FullStack"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Base de datos (SQLite por defecto)
DB_CONNECTION=sqlite
DB_DATABASE=/ruta/completa/a/backend/database/database.sqlite

# O si prefieres MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=sprint5_fullstack
# DB_USERNAME=root
# DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### 2.3 Generar clave de aplicación
```bash
php artisan key:generate
```

### 2.4 Configurar la base de datos

#### **Opción A - SQLite (más simple):**
```bash
touch database/database.sqlite
```

#### **Opción B - MySQL usando phpMyAdmin (recomendado para usuarios de XAMPP/WAMP):**
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

### 2.5 Ejecutar migraciones y seeders
```bash
php artisan migrate:fresh --seed
```

### 2.6 Instalar Passport y crear los clientes necesarios
```bash
php artisan passport:install
```
> Si reseteas la base de datos, **siempre** ejecuta este comando después.

### 2.7 Crear enlace simbólico para storage
```bash
php artisan storage:link
```

---

## ⚛️ Paso 3: Configurar el Frontend (React)

### 3.1 Instalar dependencias de Node.js
```bash
cd ../frontend
npm install
```

### 3.2 Configurar variables de entorno del frontend
Crea un archivo `.env` en la carpeta `frontend`:
```env
VITE_API_URL=http://localhost:8000/api
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

### 5.1 Probar el backend
- Visita: `http://localhost:8000/api/documentation` (Swagger)
- Prueba los endpoints de la API

### 5.2 Probar el frontend
- Visita: `http://localhost:5173`
- Deberías ver la aplicación React funcionando

---

## 📝 Notas y Solución de Problemas

- **Error "Personal access client not found for 'users' user provider"**:
  - Ejecuta: `php artisan passport:install` en la carpeta backend.
  - Si reseteas la base de datos, repite este comando.

- **Credenciales por defecto (si se ejecutaron los seeders):**
  - Admin: admin@example.com / password
  - Usuario: user@example.com / password

- **Comandos útiles:**
```bash
# Ejecutar tests del backend
cd backend && php artisan test

# Ejecutar tests del frontend
cd frontend && npm run test

# Optimizar para producción
cd backend && php artisan optimize
cd frontend && npm run build
```

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

- **Solución de problemas comunes:**
  1. Error de permisos en storage: `chmod -R 775 storage/`
  2. Error de Composer: `composer dump-autoload`
  3. Error de Node modules: `rm -rf node_modules && npm install`
  4. Base de datos no conecta: Verifica que MySQL esté corriendo y la configuración en `.env`.
  5. Error de migración: `php artisan migrate:reset` y luego `php artisan migrate:fresh --seed`

---

¡Con estos pasos deberías tener el proyecto funcionando completamente! 🎉