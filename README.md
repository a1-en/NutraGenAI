# NutraGenAI

## AI-Powered Healthy Eating Companion

A comprehensive nutrition and wellness application built with Next.js, Tailwind CSS, and AI integration.

## 🚀 Features

### ✅ Completed Features

- **User Profile & Goals Management**
  - Comprehensive onboarding with age, weight, height, dietary preferences
  - Support for vegetarian, vegan, keto, paleo, mediterranean, halal, kosher, gluten-free, dairy-free diets
  - Health goals: weight loss, muscle gain, weight maintenance, health improvement

- **AI Meal Planner**
  - Personalized daily and weekly meal plans based on user profile
  - Calorie target customization (1,200 - 3,000 calories)
  - Meal type selection (breakfast, lunch, dinner, snacks)
  - AI-powered meal recommendations

- **Recipe Finder & Generator**
  - AI-powered recipe generation from available ingredients
  - Recipe difficulty levels and preparation times
  - Ingredient-based search functionality
  - Save and organize favorite recipes

- **Smart Food Logging**
  - Manual food entry with AI nutritional analysis
  - Image upload capability (placeholder for AI food recognition)
  - Real-time nutritional breakdown
  - Meal type categorization

- **Health Insights Dashboard**
  - Interactive charts for calorie trends, macro breakdown
  - Weekly and monthly progress tracking
  - Weight progress visualization
  - AI-generated insights and recommendations

- **Interactive AI Coach**
  - Chatbot-style interface for nutrition questions
  - Context-aware responses based on user profile
  - Quick question suggestions
  - Chat history management

- **Gamification & Motivation**
  - Comprehensive badge system (10+ achievement types)
  - Progress tracking for consistency, nutrition goals, hydration
  - Points system and streak tracking
  - Achievement categories: nutrition, hydration, consistency, goals

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **AI Integration**: OpenAI API (GPT-4)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nutri-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Required: AI API Configuration
   NEXT_PUBLIC_AI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_AI_API_BASE=https://api.openai.com/v1

   # Optional: Additional APIs
   NEXT_PUBLIC_NUTRITION_API_KEY=your_edamam_api_key_here
   NEXT_PUBLIC_NUTRITION_API_ID=your_edamam_app_id_here
   NEXT_PUBLIC_VISION_API_KEY=your_vision_api_key_here
   ```

4. **Get OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account and generate an API key
   - Add the key to your environment file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### First Time Setup
1. Complete the onboarding process by filling out your profile
2. Set your dietary preferences and health goals
3. The app will automatically generate personalized recommendations

### Key Features Usage

**Dashboard**: View daily nutrition summary, water intake, streaks, and upcoming meals

**Meal Planning**: Generate AI-powered meal plans customized to your goals and preferences

**Recipe Generator**: Enter available ingredients to get healthy recipe suggestions

**Food Logging**: Log meals manually or upload photos for AI analysis

**AI Coach**: Ask nutrition questions and get personalized advice

**Health Insights**: Track progress with visual charts and AI-generated insights

**Achievements**: Earn badges for consistent healthy habits

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── features/          # Main feature components
│   │   ├── Dashboard.tsx
│   │   ├── AICoach.tsx
│   │   ├── FoodLogger.tsx
│   │   ├── RecipeFinder.tsx
│   │   ├── HealthInsights.tsx
│   │   ├── Gamification.tsx
│   │   ├── MealPlanGenerator.tsx
│   │   ├── MealPlanViewer.tsx
│   │   └── UserProfileForm.tsx
│   ├── layout/            # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── Navigation.tsx
│   │   └── OnboardingCheck.tsx
│   └── ui/               # Reusable UI components
├── app/                  # Next.js 13+ App Router pages
├── lib/                  # Utilities and AI service
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

### State Management
- **User Store**: Profile, authentication, badges, progress tracking
- **Meal Store**: Meal plans, recipes, food logs, search results
- **Persistent Storage**: User preferences and data saved locally

### AI Integration
- **Meal Planning**: Generate personalized meal plans based on user profile
- **Recipe Generation**: Create recipes from available ingredients
- **Food Analysis**: Analyze food items for nutritional content
- **Chat Coach**: Provide contextual nutrition advice

## 🔧 Customization

### Adding New Dietary Preferences
1. Update the `DietaryPreference` type in `src/types/index.ts`
2. Add the option to `dietaryOptions` in `UserProfileForm.tsx`
3. Update AI prompts in `src/lib/ai.ts` to handle the new preference

### Adding New Badges
1. Add badge definition to `availableBadges` in `Gamification.tsx`
2. Implement progress calculation logic
3. Add badge criteria to the types

### Customizing AI Behavior
- Modify prompts in `src/lib/ai.ts`
- Adjust response parsing and formatting
- Add new AI endpoints for additional features

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- Netlify: Similar process to Vercel
- Docker: Use the included Dockerfile (if created)
- Traditional hosting: Build with `npm run build` and serve the `out` folder

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_AI_API_KEY` | Yes | OpenAI API key for AI features |
| `NEXT_PUBLIC_AI_API_BASE` | No | OpenAI API base URL (defaults to official) |
| `NEXT_PUBLIC_NUTRITION_API_KEY` | No | Edamam API key for nutrition data |
| `NEXT_PUBLIC_NUTRITION_API_ID` | No | Edamam App ID |
| `NEXT_PUBLIC_VISION_API_KEY` | No | Vision API for image food recognition |

## 📱 Features in Detail

### User Profile System
- Multi-step onboarding with validation
- BMI calculation and health recommendations
- Comprehensive dietary preference support
- Health goal tracking and progress monitoring

### AI Meal Planning
- Generates complete weekly meal plans
- Considers all dietary restrictions and preferences
- Calculates accurate macro and micronutrient targets
- Provides meal alternatives and substitutions

### Smart Food Logging
- AI-powered nutritional analysis
- Photo upload with food recognition (placeholder)
- Barcode scanning capability (extendable)
- Comprehensive food database integration

### Health Analytics
- Real-time nutrition tracking
- Historical trend analysis
- Goal progress visualization
- Predictive health insights

### Gamification Engine
- 10+ unique achievement badges
- Progress tracking across multiple metrics
- Streak counting and rewards
- Social sharing capabilities (extendable)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the GitHub Issues
2. Review the documentation
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- Real-time food image recognition
- Integration with fitness trackers
- Social features and community challenges
- Meal delivery service integration
- Nutrition professional consultations
- Mobile app development (React Native)
- Offline mode support
- Multi-language support