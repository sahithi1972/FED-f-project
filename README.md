# ZeroWasteChef

A smart recipe platform designed to reduce household food waste by helping users discover recipes based on available ingredients, providing intelligent substitution suggestions, and tracking sustainability impact.

## Project Overview

ZeroWasteChef addresses the critical issue of household food waste by providing an intelligent recipe discovery system. Users can search for recipes using leftover ingredients, receive substitution suggestions for missing items, and track their environmental impact through wastage reduction metrics.

## Key Features

**Intelligent Recipe Search**
- Search recipes using multiple available ingredients simultaneously
- Advanced filtering by cuisine type, cooking time, difficulty level, and dietary preferences
- Voice input support for hands-free ingredient entry
- Relevance-based sorting to prioritize recipes matching available ingredients

**Smart Ingredient Substitution**
- Real-time alternative suggestions for missing ingredients
- Dietary-specific substitutions including vegan, gluten-free, and allergen-free options
- Confidence scoring for each substitution to maintain recipe quality
- Detailed notes explaining why a substitution works

**User Authentication and Personalization**
- Secure email and password-based authentication using JWT tokens
- User profile management with dietary preferences and health restrictions
- Guest access with 3 free recipe searches before requiring registration
- Personalized recipe recommendations based on search history and preferences

**Recipe Management**
- Detailed recipe views with step-by-step instructions
- Nutritional information including calories, protein, carbohydrates, and fats
- Health caution warnings for common allergens and dietary restrictions
- Save favorite recipes for quick access
- View search history to track past ingredient searches

**Sustainability Tracking**
- Impact dashboard displaying food waste reduction metrics
- Visual representation of environmental contributions
- Statistics on ingredients saved from wastage
- Badges and achievements for sustainable cooking milestones

**Responsive Design**
- Mobile-first interface optimized for all screen sizes
- Grid and list view options for recipe browsing
- Smooth page transitions and loading states
- Touch-friendly controls for mobile devices

## Technology Stack

**Frontend**
- React 18 with TypeScript for type-safe component development
- Vite for fast development builds and hot module replacement
- TailwindCSS for utility-first responsive styling
- shadcn/ui component library for consistent UI elements
- Framer Motion for smooth animations and transitions
- React Hook Form for efficient form state management
- Zod for runtime type validation and schema definitions
- React Router for client-side routing
- Axios for HTTP requests to backend API

**Backend**
- Node.js with Express.js for RESTful API development
- TypeScript for type safety across backend code
- Prisma ORM for database schema management and queries
- PostgreSQL as the primary relational database
- JWT (JSON Web Tokens) for secure authentication
- Bcrypt for password hashing with salt rounds
- Cloudinary for image storage and optimization
- Express Validator for request validation middleware
- CORS configuration for cross-origin resource sharing

**Database Schema**
- Users: Authentication credentials, profile information, dietary preferences
- Recipes: Title, description, cooking instructions, difficulty, servings, images
- Ingredients: Name, category, shelf life, perishability, nutritional information
- RecipeIngredients: Junction table linking recipes and ingredients with quantities
- IngredientSubstitutions: Mapping of ingredient alternatives with confidence scores
- Tags: Categorization labels for recipes (cuisine, dietary type, meal category)
- RecipeLikes: User favorite recipes tracking
- RecipeSaves: User bookmarked recipes for later viewing
- ImpactLogs: Sustainability metrics and wastage tracking per user
- UserBadges: Achievement system for sustainable cooking milestones

**Deployment**
- Frontend hosted on Vercel with CDN distribution
- Backend containerized using Docker for consistent environments
- PostgreSQL database hosted on cloud infrastructure
- Environment-based configuration for development and production

## Installation and Setup

**Prerequisites**
- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher
- PostgreSQL database (local or cloud-hosted)
- Git for version control

**Frontend Setup**

Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/sahithi1972/FED-f-project.git
cd z-wchef
```

Install frontend dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

**Backend Setup**

Navigate to the backend directory:
```bash
cd backend
```

Install backend dependencies:
```bash
npm install
```

Create a .env file with the following configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/zerowastechef"
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

Generate Prisma client:
```bash
npx prisma generate
```

Run database migrations:
```bash
npx prisma db push
```

Seed the database with sample data:
```bash
npm run db:seed
```

Start the backend server:
```bash
npm run dev
```

Run backend tests:
```bash
npm test
```

## Project Structure

```
z-wchef/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui base components
│   │   ├── RecipeCard.tsx         # Recipe display card
│   │   ├── RecipeDetail.tsx       # Detailed recipe view
│   │   ├── IngredientSearch.tsx   # Ingredient search interface
│   │   ├── ProfileDialog.tsx      # User profile management
│   │   ├── AuthDialog.tsx         # Login and signup forms
│   │   └── ImpactDashboard.tsx    # Sustainability metrics display
│   ├── contexts/
│   │   ├── auth-context.tsx       # Authentication state management
│   │   └── auth-modal-context.tsx # Modal state for auth flows
│   ├── hooks/
│   │   ├── use-recipe-search.ts   # Recipe search logic
│   │   └── use-mobile.tsx         # Responsive breakpoint detection
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── services/
│   │   └── api.ts                 # API client configuration
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── App.tsx                    # Main application component
│   └── main.tsx                   # Application entry point
├── backend/
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   ├── routes/                # API route definitions
│   │   ├── middleware/            # Authentication and validation
│   │   ├── services/              # Business logic layer
│   │   ├── utils/                 # Helper functions
│   │   └── app.ts                 # Express application setup
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed/                  # Database seeding scripts
│   └── tests/
│       ├── unit/                  # Unit tests
│       └── integration/           # Integration tests
├── public/                        # Static assets
└── package.json                   # Project dependencies
```

## API Endpoints

**Authentication**
- POST /api/auth/register - Create new user account
- POST /api/auth/login - User login with credentials
- POST /api/auth/refresh - Refresh JWT access token
- GET /api/auth/profile - Get current user profile
- PUT /api/auth/profile - Update user profile information

**Recipes**
- GET /api/recipes - Get all recipes with filters and pagination
- GET /api/recipes/:id - Get single recipe by ID
- POST /api/recipes - Create new recipe (authenticated)
- PUT /api/recipes/:id - Update existing recipe (authenticated)
- DELETE /api/recipes/:id - Delete recipe (authenticated)
- GET /api/recipes/search - Search recipes by ingredients

**Ingredients**
- GET /api/ingredients - Get all ingredients
- GET /api/ingredients/:id - Get ingredient details
- GET /api/ingredients/:id/substitutes - Get substitution options

**User Interactions**
- POST /api/recipes/:id/like - Like a recipe
- DELETE /api/recipes/:id/like - Unlike a recipe
- POST /api/recipes/:id/save - Save recipe to favorites
- DELETE /api/recipes/:id/save - Remove from favorites
- GET /api/users/favorites - Get user's saved recipes
- GET /api/users/search-history - Get user's search history

**Impact Tracking**
- GET /api/impact/stats - Get user's sustainability statistics
- POST /api/impact/log - Log wastage reduction event
- GET /api/badges - Get available achievement badges
- GET /api/users/badges - Get user's earned badges

## Database Design

The database follows a normalized relational schema with the following key relationships:

- Users have many Recipes (one-to-many)
- Recipes have many Ingredients through RecipeIngredients (many-to-many)
- Ingredients have many Substitutions through IngredientSubstitutions (many-to-many)
- Users can like and save multiple Recipes (many-to-many)
- Recipes are categorized using Tags (many-to-many)
- Users earn Badges based on achievements (many-to-many)
- Users track environmental impact through ImpactLogs (one-to-many)

The schema is designed for scalability with proper indexing on frequently queried columns and foreign key constraints to maintain referential integrity.

## Security Implementation

- Password hashing using bcrypt with 10 salt rounds
- JWT-based authentication with access and refresh tokens
- HTTP-only cookies for token storage to prevent XSS attacks
- CORS configuration restricting requests to allowed origins
- Input validation and sanitization on all API endpoints
- SQL injection prevention through Prisma's parameterized queries
- Rate limiting on authentication endpoints to prevent brute force attacks
- Environment variables for sensitive configuration data

## Testing

**Frontend Testing**
- Component unit tests using Jest and React Testing Library
- Integration tests for user flows
- Accessibility testing with jest-axe

**Backend Testing**
- API endpoint tests with Supertest
- Database integration tests
- Authentication flow validation
- Error handling verification

Run all tests:
```bash
npm test
```

## Performance Optimization

- Database query optimization with indexed columns
- Lazy loading for recipe images
- Code splitting for faster initial page load
- Frontend caching for frequently accessed data
- Image optimization through Cloudinary CDN
- Pagination for large dataset queries
- Debounced search inputs to reduce API calls

## Future Enhancements

- Machine learning-based recipe recommendations using collaborative filtering
- Computer vision for ingredient recognition through image uploads
- Multi-language support for international accessibility
- Mobile application using React Native
- Meal planning calendar with grocery list generation
- Integration with grocery delivery services
- Community features for user-generated recipes and reviews
- Nutritional goal tracking and dietary analytics
- Voice-guided cooking mode with step-by-step audio instructions
- Smart kitchen appliance integration

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository to your GitHub account
2. Create a feature branch with a descriptive name
3. Write clean, documented code following existing patterns
4. Add tests for new functionality
5. Ensure all tests pass before submitting
6. Submit a pull request with detailed description of changes

## License

This project is developed as an academic project for educational purposes.

## Acknowledgments

This project uses the following open-source libraries and services:
- shadcn/ui for accessible component primitives
- Radix UI for headless UI components
- Tailwind CSS for utility-first styling framework
- Prisma for type-safe database access
- Cloudinary for image management and optimization
