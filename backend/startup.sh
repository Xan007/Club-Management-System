#!/bin/bash

# Instalar dependencias del sistema para Chromium (requiere root)
apt-get update -qq && apt-get install -yy \
  libnss3-dev \
  libgdk-pixbuf2.0-dev \
  libgtk-3-dev \
  libxss-dev \
  libasound2t64 \
  > /dev/null 2>&1

# Iniciar la aplicación
node bin/server.js
