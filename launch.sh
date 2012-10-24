#!/bin/bash


python2 pyfiles/main.py &
GUI_PID=$!
node server.js 
#python -c "import webbrowser; webbrowser.open_new('http://localhost:8000')" &
kill -TERM $GUI_PID
