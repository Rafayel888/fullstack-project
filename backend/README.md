📂 Backend - Node.js + Express + TypeScript

🔧 Используемые технологии
Node.js (v20.17.0)
Express – фреймворк для создания REST API
TypeScript – для типизации кода
MySQL – база данных (конфигурируется через .env)

📦 Пакетный менеджер
npm (v10.8.2)

# 📌 Backend (Node.js + Express + TypeScript)

Этот раздел содержит инструкции по запуску серверной части проекта.

#### создайте каталог public/uploads/avatars

## 🚀 Запуск локально

### 1️⃣ Установка зависимостей

```sh
npm install
```

### 2️⃣ Запуск в режиме разработки

```sh
npm start
```

## 🐳 Запуск через Docker

### 1️⃣ Сборка образа

```sh
docker build -t backend .
```

### 2️⃣ Запуск контейнера

```sh
docker run -p 5000:5000 backend
```

### 3️⃣ Запуск через `docker-compose`

```sh
docker-compose up -d
```

### 1️⃣ docker exec -it <container_id> bash

### 2️⃣ npm run migrate

## ✅ Готово! Теперь ваш backend работает! 🎨🚀
