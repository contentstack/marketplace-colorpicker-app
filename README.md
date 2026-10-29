# Marketplace Color Picker App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.25.0-green.svg)](https://playwright.dev/)

A modern, accessible color picker custom field extension for Contentstack marketplace apps. This React-based application provides an intuitive color selection interface that integrates seamlessly with Contentstack's content management system.

## 🎨 Features

- **Interactive Color Picker**: Built with `react-color` for smooth color selection
- **Accessibility**: Full keyboard navigation and screen reader support
- **TypeScript**: Fully typed for better development experience
- **Responsive Design**: Works across different screen sizes
- **Testing**: Vitest unit tests (`npm run test:coverage`, 90% threshold) and Playwright for E2E testing
- **Modern UI**: A compact swatch that opens the react-color picker

## 📋 Prerequisites

- Node.js 22.12 or higher (`engines`)
- npm
- Contentstack account (for marketplace deployment)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/contentstack/marketplace-colorpicker-app.git
cd marketplace-colorpicker-app

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start

# Run tests
npm test

# Run E2E tests
npm run test:chrome
```

### Building for Production

```bash
# Build the application
npm run build

# The built files will be in the `build` directory
```

## 🏗️ Project Structure

```
marketplace-colorpicker-app/
├── src/
│   ├── components/          # Reusable React components
│   ├── containers/          # Main app containers
│   │   ├── App/            # Main app component
│   │   ├── CustomField/    # Color picker custom field
│   │   └── 404/           # 404 error page
│   ├── common/
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── locales/        # Internationalization
│   │   ├── providers/      # Context providers
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── assets/             # Static assets
├── e2e/                    # End-to-end tests
├── public/                 # Public assets
└── config files...
```

## 🧪 Testing

This project includes comprehensive testing:

### Unit Tests

```bash
npm test                    # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run with coverage thresholds
```

### E2E Tests

```bash
npm run test:chrome        # Run E2E tests in Chrome
npm run test:firefox       # Run E2E tests in Firefox
npm run test:safari        # Run E2E tests in Safari
```

### Code Quality

```bash
npm run lint               # Run ESLint
npm run lint:fix          # Fix linting issues
npm run typecheck         # TypeScript type checking
npm run format            # Format code with Prettier
```

## 🔧 Configuration

### Environment Variables

Only the Playwright E2E suite reads a `.env` file (copy `.env.sample`): `EMAIL`, `PASSWORD`, `ORG_ID`, `STACK_API_KEY`, `APP_BASE_URL`, `BASIC_AUTH_USERNAME`, `BASIC_AUTH_PASSWORD`, `DEVELOPER_HUB_API`, `ENV_URL`, `BASE_API_URL`. The app itself optionally reads `VITE_DATADOG_RUM_APPLICATION_ID`, `VITE_DATADOG_RUM_CLIENT_TOKEN`, `VITE_DATADOG_RUM_SITE` and `VITE_DATADOG_RUM_SERVICE` for error tracking.

### Saved data

The field saves the whole react-color `ColorResult` object, for example `{ "hex": "#6c5ce7", "rgb": { "r": 108, "g": 92, "b": 231, "a": 1 }, "hsl": {...}, "hsv": {...} }`. When nothing is saved the swatch shows rgb(108, 92, 231).

### App Configuration

The app configuration is defined in `update-app-info.json`:

```json
{
  "name": "Colour Picker",
  "target_type": "stack",
  "ui_location": {
    "locations": [
      {
        "type": "cs.cm.stack.custom_field",
        "meta": [
          {
            "signed": true,
            "path": "/#/custom-field",
            "data_type": "json"
          }
        ]
      }
    ]
  }
}
```

## 🛠️ Development

### Adding New Features

1. Create feature branch from `main`
2. Implement your changes
3. Add tests for new functionality
4. Update documentation
5. Submit pull request

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new color picker feature
fix: resolve color picker accessibility issue
docs: update README with new features
test: add unit tests for color validation
```

## 📦 Deployment

### Contentstack Marketplace

1. Build the application: `npm run build`
2. Package the `build` directory
3. Upload to Contentstack marketplace
4. Install in your Contentstack stack

### Local Development

For local development with Contentstack:

1. Use Contentstack's local development tools
2. Configure your stack API key
3. Run `npm start` for development server

## 🤝 Contributing

We welcome contributions!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Set up git hooks
npm run prepare

# Start development
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Contentstack](https://www.contentstack.com/) for the marketplace platform
- [React Color](https://casesandberg.github.io/react-color/) for the color picker component
- [Venus Components](https://venus.contentstack.com/) for the UI components

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/contentstack/marketplace-colorpicker-app/issues)
- **Documentation**: [Contentstack Developer Hub](https://www.contentstack.com/docs/)
- **Community**: [Contentstack Community](https://community.contentstack.com/)

---

Made with ❤️ by the Contentstack team
