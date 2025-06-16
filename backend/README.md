# 5.1 RESTful API

## 📝 description

A RESTful API developed in Laravel that manages users, activities, galleries, and photos, with secure OAuth2 authentication using Laravel Passport. It includes tests, and the controllers include annotations to generate Swagger documentation.

## 💻 Technologies Used
- **Backend:** Laravel (PHP)
- **Authentication:** Laravel Passport (OAuth2)
- **Database:** MySQL
- **Testing:** TDD
- **API Documentation:** l5-swagger (OpenAPI annotations)
- **Dependency Management:** Composer (PHP), npm (JS)
- **Version Control:** Git

## 📒 Requirements to run the project
- PHP ​​>= 8.2
- Composer
- Apache web server (or compatible)
- MySQL >= 8.0 (or PostgreSQL)
- Laravel 12
- Passport
- Git

## ⚗️ Installation
- **Clone the repository:** https://github.com/IvonneCaPa/apiSprint5.git
- **Install PHP dependencies:** composer install
- **Configure the environment file:** Copy the .env.example file to .env
- **Generate the application key:** php artisan key:generate
- **Run the migrations and seeder:** php artisan migrate:fresh --seed
- **Configure Laravel Passport:** php artisan passport:install, 
- **Accept** the passport migrations, and create the personal client.
- **Create the symbolic link for the storage:** php artisan storage:link

## 🎰 Execution and Deployment
- **Start the server:** php artisan serve
- **Run the tests:** php artisan test

## 📈 Optimize the application
- **Run the following command to optimize the application for production:** php artisan optimize
- **Configure caching**
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache


🐈‍⬛