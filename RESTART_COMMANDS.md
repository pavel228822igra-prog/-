# Команды для перезапуска

## Вариант 1: Одна строка (рекомендуется)

```bash
cd "/Users/pskripilev/Downloads/Мои файлы/healt" && lsof -ti:8081 | xargs kill -9 2>/dev/null; sleep 1; npm start
```

## Вариант 2: Скрипт

```bash
./RESTART.sh
```

## Вариант 3: Вручную

1. Остановите текущий сервер: нажмите `Ctrl+C` в терминале
2. Запустите заново:
```bash
cd "/Users/pskripilev/Downloads/Мои файлы/healt"
npm start
```

## Вариант 4: Если порт занят другим процессом

```bash
cd "/Users/pskripilev/Downloads/Мои файлы/healt"
lsof -ti:8081 | xargs kill -9
npm start
```

