# --- Stage 1: Build ---
# Wir verwenden das aktuelle Node 22 Image (LTS)
FROM node:22-alpine as builder

# Arbeitsverzeichnis im Container setzen
WORKDIR /app

# Kopiere zuerst nur die package-Dateien (für besseres Caching von Docker)
COPY package*.json ./

# Installiere die Abhängigkeiten (npm installation)
RUN npm install

# Kopiere den Rest des Projektcodes
COPY . .

# --- ARGUMENT FOR API KEY ---
# Accepts the key from the docker build command
ARG VITE_GOOGLE_API_KEY
# Sets it as an environment variable for the build process
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY

# Baue die App für die Produktion (erstellt den /dist Ordner)
# Vite ersetzt dabei import.meta.env.VITE_GOOGLE_API_KEY mit dem echten Wert
RUN npm run build

# --- Stage 2: Serve ---
# Wir verwenden einen leichten Nginx-Server für die Auslieferung
FROM nginx:alpine

# Kopiere die gebauten Dateien aus Stage 1 in das Nginx-Verzeichnis
COPY --from=builder /app/dist /usr/share/nginx/html

# Port 80 freigeben
EXPOSE 80

# Nginx im Vordergrund starten
CMD ["nginx", "-g", "daemon off;"]