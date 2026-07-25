# Chundi Web Project

A modern, responsive React web application for **Chundi Educational Society**, built using Vite, Tailwind CSS, and React 19.

---

## 🚀 Key Features

*   **🛠️ Maintenance Mode**: By default, the application serves a beautifully designed maintenance page ("Great minds at work. We are working on it!") containing:
    *   Centered company brand identity using the SVGs.
    *   Embedded loop video animation.
    *   Contact information (Phone, Email).
    *   Interactive social icons (Facebook, OK, VK, X/Twitter, Telegram).
*   **🔍 Preview Mode**: Development/Preview homepage accessible by appending `?preview=true` to the URL query string (e.g. `http://localhost:5173/?preview=true`).

---

## 🛠️ Tech Stack & Styling

*   **Frontend Library**: React 19
*   **Build Tool**: Vite 8
*   **Styling**:
    *   Tailwind CSS (utility classes)
    *   Custom design tokens, variables, and components implemented in [index.css](file:///c:/Users/kalyan5256/OneDrive/Desktop/chundi_project/chundi_project/src/index.css)

---

## 📁 Project Structure

```text
chundi_project/
├── public/                 # Static assets (icons, public documents)
├── src/
│   ├── assets/             # Images, SVGs, and MP4 animations
│   │   ├── logo_text.svg   # Main SVG branding logo
│   │   └── now_set_background_only_white.mp4
│   ├── pages/              # Page views
│   │   ├── Home.jsx        # Landing page (visible in ?preview=true)
│   │   └── Maintenance.jsx # Maintenance landing page (default view)
│   ├── App.jsx             # Main router & page controller
│   ├── index.css           # Core stylesheet, Tailwind imports & utility styles
│   └── main.jsx            # React app entry point
├── package.json            # Configuration and script runner
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite custom compiler rules
```

---

## 💻 Available Scripts

In the project directory, you can run the following npm commands:

### `npm run dev`
Runs the app in development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

To view the preview homepage, visit:
[http://localhost:5173/?preview=true](http://localhost:5173/?preview=true)

### `npm run build`
Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview`
Locally preview the production build output.

### `npm run lint`
Runs ESLint to find and report static code issues.
