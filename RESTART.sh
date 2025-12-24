#!/bin/bash
cd "/Users/pskripilev/Downloads/Мои файлы/healt"
lsof -ti:8081 | xargs kill -9 2>/dev/null
sleep 1
npm start

