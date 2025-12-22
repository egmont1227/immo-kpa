# Immo-KPA - Kaufpreisaufteilung for property investors

## Features
- 3 Valuation Methods (Asset, Income, Comparative)
- Multi-Property Management
- AI Analysis (Gemini)
- PDF Export

## Tech stack
- React
- Vite
- Tailwind CSS
- Docker

## Folder Structure

Ensure your files are arranged exactly like this:

```text
/immo-kpa
  ├── Dockerfile
  ├── package.json
  ├── vite.config.js
  ├── tailwind.config.js
  ├── postcss.config.js
  ├── index.html
  └── src/
      ├── main.jsx
      ├── index.css
      ├── App.jsx
      ├── lib/
      │   ├── constants.js
      │   ├── validation.js
      │   ├── calculations.js
      │   └── storage.js
      ├── hooks/
      │   ├── useCalculator.js
      │   ├── useAIAnalysis.js
      │   └── usePropertyManager.js
      └── components/
          ├── ui/
          │   ├── GlassCard.jsx
          │   ├── GradientButton.jsx
          │   ├── Tooltip.jsx
          │   └── InputField.jsx
          ├── MethodToggle.jsx
          ├── InputSection.jsx
          ├── ResultsSection.jsx
          ├── AICallToAction.jsx
          ├── AIAnalysisModal.jsx
          ├── PropertySelector.jsx
          ├── PropertyDialog.jsx
          └── DeleteConfirmDialog.jsx
```

## Installation

Follow these steps to get your application running using Docker.

### 1. Get an API Key

To make the "KI Check" work, you need a Google Gemini API Key.

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create a free API Key.

### 2. Build the Docker Image

Open your terminal in the `/immo-kpa` folder. Run the build command, passing your key:

```bash
# Replace "YOUR_ACTUAL_API_KEY_HERE" with your key from Google
docker build --build-arg VITE_GOOGLE_API_KEY=YOUR_ACTUAL_API_KEY_HERE -t immo-kpa .
```

*Note: If you change the key later, you must run this build command again.* **Security Warning:** Passing secrets via `--build-arg` persists them in the Docker image history. For a strictly local setup this is acceptable, but avoid sharing the built image publicly.

### 3. Run the Container

Start the app:

```bash
docker run -p 8080:80 immo-kpa
```

### 4. Access the App

Open your web browser and go to:

**http://localhost:8080**
