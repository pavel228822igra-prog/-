# Исправление ошибки babel-preset-expo

## Проблема
Ошибка: `Cannot find module 'babel-preset-expo'`

## Решение
Установлен недостающий пакет `babel-preset-expo` как devDependency.

## Установлено
```bash
npm install --save-dev babel-preset-expo --legacy-peer-deps
```

## Текущая версия
- babel-preset-expo: ^54.0.9 (совместимо с Expo SDK 54)

Теперь приложение должно компилироваться без ошибок.

## Перезапуск
```bash
cd "/Users/pskripilev/Downloads/Мои файлы/healt" && lsof -ti:8081 | xargs kill -9 2>/dev/null; sleep 1; npm start
```

