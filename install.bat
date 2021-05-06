@echo off

@echo Instaling YARN...
call npm install --global yarn
@echo YARN installation ended!

@echo Instaling packages...
call yarn add puppeteer --ignore-scripts

cd node_modules/puppeteer
call yarn exec node install.js

@echo DONE!