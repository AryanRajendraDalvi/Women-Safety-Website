# SafeSpace - Women Safety Platform

A privacy-first digital platform for women's workplace safety in India, built with Next.js frontend and Node.js/Express backend with MongoDB integration.

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **UI**: Tailwind CSS + Radix UI components
- **Language**: TypeScript
- **State Management**: React hooks + localStorage
- **Authentication**: JWT tokens

### Backend (Node.js/Express)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or pnpm
- Google Gemini API key (optional, for enhanced chatbot features)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd women-safety-platform
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your MongoDB connection
# MONGODB_URI=mongodb://localhost:27017/safespace
# JWT_SECRET=your-super-secret-jwt-key

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
# From root directory
npm install

# Create .env.local for API URL and optional Gemini API
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
# Add GEMINI_API_KEY=your_key_here to .env.local for enhanced chatbot

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
women-safety-platform/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard
│   ├── evidence-vault/    # Evidence storage
│   ├── ai-assistant/      # AI-powered complaint helper
│   ├── log-incident/      # Incident logging
│   ├── login/ & signup/   # Authentication
│   └── ...
├── backend/               # Express.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & validation
│   └── server.js         # Main server file
├── components/           # Reusable UI components
├── lib/                  # Utilities & API service
└── hooks/               # Custom React hooks
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/safespace
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/safespace

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
```

#### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Gemini API for SOS Chatbot (optional)
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🗄️ Database Schema

### Users
- `username` (unique)
- `password` (hashed)
- `language` (english, hindi, marathi, tamil)
- `isActive`, `lastLogin`, timestamps

### Incidents
- `userId` (reference to User)
- `title`, `description`, `location`, `witnesses`
- `severity` (low, medium, high, critical)
- `category` (verbal_harassment, sexual_harassment, etc.)
- `status` (draft, submitted, under_review, resolved, closed)
- `tags`, timestamps

### Evidence
- `userId`, `incidentId` (references)
- `fileName`, `originalName`, `fileType`
- `fileSize`, `filePath`, `hash`
- `description`, `tags`, timestamps

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Incidents
- `GET /api/incidents` - Get user incidents
- `POST /api/incidents` - Create new incident
- `GET /api/incidents/:id` - Get specific incident
- `GET /api/incidents/stats/summary` - Get incident statistics

### Evidence
- `GET /api/evidence` - Get user evidence
- `POST /api/evidence/upload` - Upload evidence file
- `GET /api/evidence/incident/:id` - Get evidence by incident
- `DELETE /api/evidence/:id` - Delete evidence

### AI Assistant
- `POST /api/ai-assistant/generate-complaint` - Generate POSH complaint
- `POST /api/ai-assistant/generate-summary` - Generate incident summary
- `POST /api/ai-assistant/legal-advice` - Get legal advice

### SOS Chatbot
- `POST /api/chatbot` - AI-powered emotional support and guidance

## 🔒 Security Features

- **Password Hashing**: bcryptjs with configurable rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Configurable request limits
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **File Upload Security**: Type and size validation

## 🎨 UI Components

The frontend includes a comprehensive UI component library:
- **Forms**: Input, textarea, select, checkbox, radio
- **Navigation**: Sidebar, breadcrumb, navigation menu
- **Feedback**: Toast, alert, progress, skeleton
- **Layout**: Card, accordion, collapsible, tabs
- **Data Display**: Table, chart, carousel
- **Overlays**: Dialog, popover, tooltip, sheet

## 🌐 Internationalization

Supports multiple languages:
- English (default)
- Hindi (हिंदी)
- Marathi (मराठी)
- Tamil (தமிழ்)

## 📱 Features

### Core Functionality
1. **Anonymous Authentication** - No email/phone required
2. **Evidence Logging** - Text, audio, photos, files
3. **AI Assistant** - POSH-compliant complaint generation
4. **SOS Chatbot** - AI-powered emotional support and guidance
5. **Emergency Location Sharing** - Instant location sharing via WhatsApp
6. **Emergency Features** - Quick access to help
7. **Resource Library** - Legal guides and templates
8. **Multi-language Support** - Internationalization ready

### Privacy & Security
- Client-side encryption
- Anonymous user accounts
- Secure evidence storage
- Privacy-first design principles

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
cd backend
npm install --production
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build
npm start
```

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set strong JWT secret
4. Configure CORS origins
5. Set up file upload storage (S3 recommended)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
npm run test
```

## 📝 API Documentation

### Authentication Headers
```javascript
headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

### Error Responses
```javascript
{
  "error": "Error message",
  "details": [
    {
      "field": "field_name",
      "message": "validation message"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🤖 SOS Chatbot

The platform includes an AI-powered SOS chatbot that provides:
- **Emotional Support**: Empathetic responses for women experiencing workplace harassment
- **Legal Guidance**: Information about POSH Act and workplace rights
- **Safety Features**: Emergency detection and immediate help resources
- **Confidential Conversations**: Private, secure chat interface

For detailed setup instructions, see [CHATBOT_SETUP.md](./CHATBOT_SETUP.md)

## 🚨 Emergency Features

### Emergency Location Sharing
- **One-Click Alert**: Red emergency button for immediate location sharing
- **WhatsApp Integration**: Automatically opens WhatsApp with location and emergency message
- **Contact Management**: Set up emergency contacts for instant sharing
- **Fallback Support**: Works even without location access

### Emergency Support Section
- **Direct Helpline Access**: One-click calling to police, women's helpline, and emergency services
- **Visual Emergency Guide**: Clear emergency procedures and contact information
- **24/7 Availability**: Always accessible from the homepage

### Safety Features
- **Location Privacy**: Location only shared when emergency button is pressed
- **Contact Security**: Emergency contacts stored locally on user's device
- **Immediate Response**: Instant sharing with pre-configured emergency contacts

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- Backend with MongoDB integration
- Frontend with Next.js 15
- Complete authentication system
- File upload and evidence management
- AI-powered complaint generation 