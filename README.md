# Mensthetic - Ästhetische Medizin für Männer

## Overview
Mensthetic is a modern web application for aesthetic medicine services specifically designed for men. The website features a clean, professional design with advanced animations and e-commerce functionality.

## Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables, Tailwind CSS v4 (alpha)
- **Backend**: Supabase (for analytics and data storage)
- **Build Tools**: Webpack 5, Babel
- **Testing**: Jest with Testing Library
- **Code Quality**: ESLint, Prettier

## Project Structure
```
├── css/                    # Stylesheets
│   ├── main.css           # Main application styles
│   ├── menst-tokens.css   # CSS variables and design tokens
│   └── menst-animations.css # Animation definitions
├── js/                     # JavaScript modules
│   ├── main.js            # Main application logic
│   ├── analytics.js       # Analytics tracking
│   ├── shop.js            # E-commerce functionality
│   └── supabase-client.js # Supabase configuration
├── images/                 # Image assets
├── behandlungen/          # Treatment pages
├── ueber-uns/             # About pages
└── mensthetic-ui/         # Next.js application (separate)
```

## Getting Started

### Prerequisites
- Node.js 18+ (recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install
```

### Environment Setup
Create a `.env` file in the root directory with the following variables:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development
```bash
# Start development server on port 3000
npm run dev
```

### Building
```bash
# Production build
npm run build

# Development build (unminified)
npm run build:dev
```

### Testing
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Features
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **View Transitions**: Smooth page transitions using View Transitions API
- **Password Protection**: Secure content gating for premium features
- **E-commerce**: Shopping cart functionality with product management
- **Analytics**: Real-time user tracking and session analytics
- **Performance**: Optimized build with code splitting and minification

## Code Standards
- **ESLint**: Enforces consistent code style
- **Prettier**: Automatic code formatting
- **TypeScript**: Type checking support (configuration included)

## Build Optimization
The production build includes:
- JavaScript minification with Terser
- CSS minification with CSSNano
- Asset optimization
- Code splitting for better performance
- Console statement removal

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Security
- API keys are stored in environment variables
- No sensitive data in client-side code
- Supabase Row Level Security (RLS) enabled

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License
ISC License