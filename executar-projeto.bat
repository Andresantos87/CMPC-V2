@echo off
SETLOCAL EnableExtensions
TITLE PT DIGITAL V2 - Ambiente Local

:: Garante que estamos na pasta onde o script está localizado
cd /d "%~dp0"

echo ==============================================
echo    INICIANDO AMBIENTE DE DESENVOLVIMENTO
echo ==============================================
echo Pasta atual: %cd%
echo.

:: 1. Verificar Node.js
echo [1/3] Verificando Node.js...
node -v
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao foi encontrado. 
    echo Verifique se instalou corretamente e reiniciou o PC.
    pause
    exit /b
)

:: 2. Verificar dependencias
echo [2/3] Verificando node_modules...
if not exist "node_modules\" (
    echo [INFO] Pasta node_modules nao encontrada. Instalando...
    if exist "yarn.js" (
        node yarn.js install
    ) else (
        echo [ERRO] Arquivo yarn.js nao encontrado para instalacao segura.
        pause
        exit /b
    )
) else (
    echo [OK] Dependencias ja instaladas.
)

:: 3. Iniciar Servidor
echo [3/3] Iniciando servidor Next.js na porta 9002...
echo.
echo Se o servidor cair, veja o erro abaixo:
echo ----------------------------------------------

:: Tenta rodar o Next.js usando o binário local diretamente
node "node_modules\next\dist\bin\next" dev --turbopack -p 9002

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ----------------------------------------------
    echo [AVISO] O servidor parou com o codigo: %ERRORLEVEL%
    echo Verifique as mensagens de erro acima.
)

echo.
echo Pressione qualquer tecla para fechar esta janela.
pause
