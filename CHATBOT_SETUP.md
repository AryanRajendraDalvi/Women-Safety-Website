# SOS Chatbot Setup Guide

## Overview
The SafeSpace SOS Chatbot is a compassionate AI companion designed to support women who have experienced workplace sexual harassment. It provides emotional support, practical guidance, and information about legal rights while maintaining user privacy and safety.

## Features
- **Emotional Support**: Provides empathetic, non-judgmental responses
- **Legal Guidance**: Offers information about POSH Act and workplace rights
- **Safety First**: Detects emergency situations and provides immediate help
- **Confidential**: All conversations are private and secure
- **Quick Responses**: Pre-built response buttons for common concerns
- **Professional Resources**: Suggests appropriate helplines and support services

## Setup Instructions

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory with:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Backend API URL (if different from default)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 4. Start the Development Server
```bash
npm run dev
# or
pnpm dev
```

## Usage

### For Users
1. **Access the Chatbot**: Click the floating chat button (purple/pink gradient) in the bottom-right corner of any page
2. **Start a Conversation**: Type your message or use the quick response buttons
3. **Get Support**: The chatbot will provide empathetic responses and practical guidance
4. **Emergency Help**: If you mention immediate danger, the chatbot will provide emergency contacts

### Quick Response Options
- "I need help with workplace harassment"
- "How do I report an incident?"
- "What are my legal rights?"
- "I'm feeling scared and alone"
- "How can I stay safe?"
- "I need emotional support"

## Safety Features

### Emergency Detection
The chatbot automatically detects:
- **Suicidal thoughts**: Provides crisis helpline numbers
- **Immediate danger**: Offers emergency services contacts
- **Urgent situations**: Prioritizes safety and immediate action

### Emergency Contacts Provided
- **Emergency Services**: 112
- **National Women's Helpline**: 181
- **Suicide Prevention**: 1800-599-0019
- **Crisis Helpline**: 988

## Technical Details

### API Integration
- **Primary**: Google Gemini Pro API for intelligent responses
- **Fallback**: Pre-built supportive responses if API is unavailable
- **Safety**: Built-in content filtering and safety settings

### Privacy & Security
- **No Data Storage**: Conversations are not stored permanently
- **Client-Side**: Chat interface runs entirely in the browser
- **Secure API**: All API calls use HTTPS encryption
- **No Personal Info**: Chatbot never asks for identifying information

### Response Categories
1. **Emotional Support**: Validation, empathy, and understanding
2. **Legal Information**: POSH Act, workplace rights, reporting procedures
3. **Practical Guidance**: Safety measures, documentation, next steps
4. **Resource Referral**: Professional help, counselors, legal aid
5. **Emergency Response**: Immediate safety and crisis intervention

## Customization

### Modifying Responses
Edit the `SAFETY_PROMPT` in `/app/api/chatbot/route.ts` to customize the chatbot's personality and responses.

### Adding Languages
The chatbot supports multiple languages. Add new language templates to the fallback responses.

### Styling
Customize the chatbot appearance by modifying the CSS classes in `/components/SOSChatbot.tsx`.

## Troubleshooting

### API Key Issues
- Ensure your Gemini API key is valid and has sufficient quota
- Check that the environment variable is properly set
- Verify the API key has access to the Gemini Pro model

### Chatbot Not Responding
- Check browser console for errors
- Verify the API route is accessible
- Ensure all dependencies are installed

### Performance Issues
- The chatbot uses fallback responses if the API is slow
- Consider implementing response caching for better performance

## Support
For technical issues or questions about the chatbot implementation, please refer to the main project documentation or create an issue in the repository.

## Legal Disclaimer
The SafeSpace chatbot is designed to provide support and information but is not a substitute for professional legal, medical, or mental health advice. Users in crisis should contact appropriate emergency services or professional help immediately. 