@echo off
echo.
echo ========================================
echo     Enviando alteracoes para o GitHub
echo ========================================
echo.

git add .
git commit -m "feat: refactor Permit form with CMPC design system and operator verification sections"
git push origin main

echo.
echo ========================================
echo      Alteracoes enviadas com sucesso!
echo ========================================
echo.
pause
