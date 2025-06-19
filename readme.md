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

---

## 🤖 AI-Assisted Development

### **AI Tool Used: Claude**
This project was developed with the assistance of **Claude AI**, which provided significant advantages in the development process:

#### **1. Advanced Code Capabilities**
- **Deep understanding** of multiple programming languages
- **Clean and well-structured code generation**
- **Intelligent debugging** and improvement suggestions
- **Automatic code refactoring**

#### **2. Documentation and Explanations**
- **Clear and complete technical documentation**
- **Detailed explanations** of complex concepts
- **Documentation translation** between languages
- **README and user guide generation**

#### **3. Architecture and Design**
- **Application architecture design**
- **Design patterns and best practices**
- **Performance optimization**
- **Security and best practices**

#### **4. Problem Resolution**
- **Error analysis and solutions**
- **Step-by-step troubleshooting**
- **Alternative suggestions** when something doesn't work
- **Algorithm optimization**

#### **5. Learning and Education**
- **Pedagogical explanations** of technical concepts
- **Practical examples and use cases**
- **Step-by-step implementation guides**
- **Industry best practices**

#### **6. Productivity**
- **Rapid boilerplate code generation**
- **Automation of repetitive tasks**
- **Code review and improvement suggestions**
- **Assisted testing and debugging**

#### **7. Collaboration**
- **Clear technical communication**
- **API and endpoint documentation**
- **Contribution guides for teams**
- **Consistent code standards**

---

## 📚 React Frontend Development Guide

### **Initial Question to Claude:**
*"I have a RESTful API developed in Laravel that manages users, activities, galleries and photos, with secure OAuth2 authentication through Laravel Passport. Now I want to make the frontend with React. Tell me step by step how to start because I have never used React."*

### **Claude's Step-by-Step Response:**

#### **1. Initial Environment Setup**
```bash
# Install Node.js from nodejs.org (LTS version recommended)
# Verify installation
node --version
npm --version

# Create React project
npx create-react-app mi-frontend-app
cd mi-frontend-app
npm start
```

#### **2. Install Required Dependencies**
```bash
# For HTTP requests to your API
npm install axios

# For routing (navigation between pages)
npm install react-router-dom

# For easier form handling
npm install react-hook-form

# For styles (optional, you can use regular CSS)
npm install tailwindcss
```

#### **3. Basic Project Structure**
```
src/
  components/         # Reusable components
    Header.js
    Footer.js
  pages/             # Main pages
    Login.js
    Dashboard.js
    Users.js
    Activities.js
    Gallery.js
  services/          # API services
    api.js
    auth.js
  context/           # Global state
    AuthContext.js
  App.js
  index.js
```

#### **4. Configure API Communication**
Create `src/services/api.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Your Laravel URL

// restrest of the code
```

#### **5. Create Authentication System**
Create `src/services/auth.js`:
```javascript
import api from './api';

// restrest of the code
```

#### **6. Create Authentication Context**
Create `src/context/AuthContext.js`:
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

// restrest of the code
```

#### **7. Create Login Page**
Create `src/pages/Login.js`:
```javascript
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// restrest of the code
```

#### **8. Configure Main Routes**
Modify `src/App.js`:
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// restrest of the code
```

#### **9. Next Steps**
Once you have this working:
- Create services for each entity (users, activities, galleries)
- Develop pages to list, create, edit each resource
- Implement photo upload using FormData
- Add validations and error handling
- Improve UI with CSS styles or a library like Material-UI

#### **10. Important Commands**
```bash
npm start          # Run in development
npm run build      # Create production version
npm test           # Run tests
```

---
## Next Question
- At what point can I test if I'm doing it right?

### **Claude's Response:**
Excellent question. I'll explain the checkpoints you can use to test that everything is working correctly:
### 🧪 Testing Points During Development

### **🚀 POINT 1: Basic React Project Working**
After step 1, you can test:
```bash
npx create-react-app mi-frontend-app
cd mi-frontend-app
npm start
```

✅ **What you should see:**
- Opens http://localhost:3000 in your browser
- Default React page appears with spinning logo
- No errors in browser console (F12 → Console)

❌ **If something fails here:**
- Verify Node.js is installed correctly
- Ensure you have write permissions in the folder

### **🔧 POINT 2: Dependencies Installed**
After step 2:
```bash
npm install axios react-router-dom react-hook-form
```

✅ **What you should see:**
- Command executes without errors
- New dependencies appear in package.json
- npm start still works

### **🌐 POINT 3: Basic API Connection**
After creating `src/services/api.js`, you can do a simple test.
Create a temporary file `src/test-api.js`:
```javascript
import api from './services/api';

// Function to test connection
export const testConnection = async () => {
  try {
    // Change this URL to a public route from your Laravel API
    const response = await api.get('/test'); // or any public endpoint
    console.log('✅ API connected:', response.data);
    return true;
    // restrest of the code
```

Then temporarily add to `src/App.js`:
```javascript
import { testConnection } from './test-api';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    testConnection();
// restrest of the code
```

✅ **What you should see in browser console:**
- If your Laravel API is running: "✅ API connected"
- If there are CORS issues: CORS error (normal, we'll fix it)
- If Laravel is not running: Connection error

### **🔐 POINT 4: Basic Authentication**
After creating the authentication context, but BEFORE creating the complete login, you can test:
Temporarily modify `src/App.js`:
```javascript
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

const TestAuth = () => 
// restrest of the code
```

✅ **What you should see:**
- "Loading authentication..." briefly
- Then "User: Not connected" (because no token is saved)

### **🔑 POINT 5: Functional Login**
After creating the login page, you can test it completely:

✅ **What you should be able to do:**
- See the login form
- Write email and password
- When submitting the form:
  - If credentials are correct: redirects to dashboard
  - If incorrect: shows error message

In browser tools (F12 → Application → Local Storage) the access_token should appear

### **🔍 For debugging problems:**
Add temporary logs in `src/services/auth.js`:
```javascript
export const authService = {
  login: async (email, password) => {
    console.log('🔄 Trying login with:', email);
  // restrest of the code
```

### **🛡️ POINT 6: Protected Routes**
After configuring routes:

✅ **What you should be able to test:**
- Go to http://localhost:3000/dashboard without being logged in → redirects to login
- Login → takes you to dashboard
- Refresh page on dashboard → stays logged in (doesn't kick you out)
- Delete token from Local Storage → kicks you out of dashboard

### **🚨 Common Problems and How to Detect Them:**

**CORS Error**
- Symptom: Error in console mentioning CORS
- Solution: In your Laravel, configure CORS in `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
```

**Incorrect OAuth2 Token**
- Symptom: 401 error when logging in
- Verify:
  - client_id and client_secret from Laravel Passport
  - Command: `php artisan passport:client --password`

**API Not Responding**
- Symptom: Connection error
- Verify:
  - Laravel is running: `php artisan serve`
  - Correct URL in API_BASE_URL

---

## 🔄 Follow-up Questions to Claude AI

### **Other Questions: User, Activity, and Gallery Services**
*"How to create services for users, activities, and galleries"*

**Claude's Response:**
The AI provided detailed guidance on creating service files for each entity:

#### **User Service (`src/services/userService.js`)**
```javascript
import api from './api';

export const userService = 
  // ...
```

#### **Activity Service (`src/services/activityService.js`)**
```javascript
import api from './api';

export const activityService = 
 // ...
```

#### **Gallery Service (`src/services/galleryService.js`)**
```javascript
import api from './api';

export const galleryService = 
  //  ...
  
```

### **Question 3: Recommended Components**
*"What components should I create for the application?"*

**Claude's Response:**
The AI recommended creating these essential components:
- Avatar
- Footer
- FormReusable
- Header
- Loader
- Modal
- ScrollToTop
- Table
- TestUsers
- ToastProvider

#### **Additional Recommendations:**
1. **Use a UI library** like Material-UI, Ant Design, or Tailwind UI for faster development
2. **Implement proper error handling** in all components
3. **Add loading states** for better user experience
4. **Use React Hook Form** for form validation and management
5. **Implement responsive design** for mobile compatibility


