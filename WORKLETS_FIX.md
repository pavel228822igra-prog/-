# Исправление ошибки Worklets version mismatch

## Проблема
Ошибка: `Mismatch between JavaScript part and native part of Worklets (0.7.1 vs 0.5.1)`

Это означает, что версия react-native-worklets в JavaScript коде (0.7.1) не совпадает с версией в нативной части Expo Go (0.5.1).

## Решение
Понижена версия react-native-worklets до 0.5.1, которая совместима с Expo Go SDK 54.

## Команда
```bash
npm install react-native-worklets@0.5.1 --legacy-peer-deps
```

## Перезапуск
```bash
cd "/Users/pskripilev/Downloads/Мои файлы/healt" && lsof -ti:8081 | xargs kill -9 2>/dev/null; sleep 1; npm start
```

После перезапуска ошибка должна исчезнуть.

