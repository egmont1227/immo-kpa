# Immo Kaufpreisrechner Installation Guide

Follow these steps to get your application running using Docker.

## 1. Folder Structure

Ensure your files are arranged exactly like this:

```text
/my-app
  ├── Dockerfile
  ├── package.json
  ├── package-lock.json (optional but recommended)
  ├── vite.config.js
  ├── tailwind.config.js
  ├── postcss.config.js
  ├── index.html
  └── src/
      ├── main.jsx
      ├── index.css
      └── App.jsx
```

## 2. Get an API Key

To make the "KI Check" work, you need a Google Gemini API Key.

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create a free API Key.

## 3. Build the Docker Image

Open your terminal in the `/my-app` folder. Run the build command, passing your key:

```bash
# Replace "YOUR_ACTUAL_API_KEY_HERE" with your key from Google
docker build --build-arg VITE_GOOGLE_API_KEY=YOUR_ACTUAL_API_KEY_HERE -t immo-kpa .
```

*Note: If you change the key later, you must run this build command again.* **Security Warning:** Passing secrets via `--build-arg` persists them in the Docker image history. For a strictly local setup this is acceptable, but avoid sharing the built image publicly.

## 4. Run the Container

Start the app:

```bash
docker run -p 8080:80 immo-kpa
```

## 5. Access the App

Open your web browser and go to:

**http://localhost:8080**
