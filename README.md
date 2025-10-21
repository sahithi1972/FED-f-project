# ZeroWasteChef 🥘

A modern recipe application focused on reducing food waste by helping users discover recipes based on available ingredients and dietary preferences.

## Features 🌟

- **Smart Recipe Search**
  - Search by available ingredients
  - Filter by cuisine, cooking time, and dietary restrictions
  - Advanced sorting options (relevance, cooking time, rating)

- **User Authentication**
  - Email/Password login
  - Social login options (Google, GitHub)
  - Remember me functionality

- **Responsive UI**
  - Grid and List view modes
  - Skeleton loading states
  - Smooth animations and transitions
  - Mobile-friendly design

- **Accessibility**
  - ARIA labels
  - Keyboard navigation
  - Screen reader support
  - High contrast mode

## Technology Stack 💻

### Frontend
- React + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- shadcn/ui for UI components
- React Hook Form for form management
- Zod for validation
- Framer Motion for animations

### Planned Backend Features
- RESTful API for recipe and user management
- Database for storing recipes and user data
- ML model for recipe recommendations
- Image recognition for ingredient identification

## Getting Started 🚀

1. **Prerequisites**
   ```bash
   node.js >= 18.0.0
   npm >= 9.0.0
   ```

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/sahithi1972/FED-f-project.git
   cd z-wchef

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

3. **Development**
   ```bash
   # Run tests
   npm test

   # Build for production
   npm run build
   ```

## Project Structure 📁

```
src/
├── components/        # Reusable UI components
├── contexts/         # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and constants
├── pages/           # Route components
└── types/           # TypeScript type definitions
```

## Current Status 📊

- ✅ Frontend UI implementation
- ✅ Component architecture
- ✅ Form validation
- ✅ Responsive design
- 🔄 Component testing (in progress)
- 📝 Error boundaries (planned)
- 📝 Backend integration (planned)
- 📝 ML model integration (planned)

## Contributing 🤝

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- shadcn/ui for the beautiful component library
- Radix UI for accessible primitives
- Tailwind CSS for the utility-first CSS framework
