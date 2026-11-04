@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [MindCalm] PPT 界面节点 → http://127.0.0.1:8767/
start "" cmd /c "timeout /t 1 /nobreak >nul & start http://127.0.0.1:8767/"
python -m http.server 8767
pause
