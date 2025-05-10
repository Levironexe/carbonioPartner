# Carbonio Partner

## 🚀 Live Demo

Visit our online deployment: [https://carboniopartner.vercel.app/](https://carboniopartner.vercel.app/)

## 📋 Prerequisites

- Node.js (v16 or later)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/carbonio-partner.git
   cd carbonio-partner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

## 🔧 Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## 🧪 Testing

Run the tests:

```bash
npm test
# or
yarn test
```

## 🏗️ Building for Production

Create a production build:

```bash
npm run build
# or
yarn build
```

Preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## 🔍 ESLint Configuration

This project uses ESLint for code quality. The default configuration can be expanded for more strict type checking:

```javascript
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // For stricter rules:
    // ...tseslint.configs.strictTypeChecked,
    // For stylistic rules:
    // ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install React-specific lint plugins:

```javascript
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
``;
```
