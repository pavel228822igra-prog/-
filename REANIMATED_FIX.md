# Исправление ошибки react-native-reanimated

## Проблема
Ошибка: `Cannot find module 'react-native-worklets/plugin'`

## Решение
Для react-native-reanimated версии 4.x требуется дополнительный пакет `react-native-worklets`.

## Установлено
```bash
npm install react-native-worklets --legacy-peer-deps
```

Теперь приложение должно запускаться без ошибок.

## Перезапуск
```bash
cd "/Users/pskripilev/Downloads/Мои файлы/healt" && lsof -ti:8081 | xargs kill -9 2>/dev/null; sleep 1; npm start
```

