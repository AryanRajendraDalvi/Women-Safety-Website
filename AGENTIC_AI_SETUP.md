# Agentic AI System Setup Guide

## Overview
The SafeSpace platform now includes an advanced agentic AI system that automatically analyzes incident descriptions, assesses severity, and helps lodge FIRs (First Information Reports) for severe cases. This system provides intelligent, proactive assistance to women experiencing workplace harassment.

## 🤖 AI System Features

### 1. **Intelligent Incident Analysis**
- **Severity Assessment**: AI analyzes incident descriptions and classifies them as:
  - **Critical**: Physical violence, threats to life, immediate danger
  - **High**: Serious harassment, stalking, repeated incidents
  - **Medium**: Moderate harassment, inappropriate behavior
  - **Low**: Minor incidents, isolated inappropriate comments

- **Legal Analysis**: Provides legal implications and relevant IPC sections
- **Recommendations**: Offers specific, actionable advice based on severity
- **Risk Assessment**: Identifies potential risk factors and safety concerns

### 2. **Automatic Police Station Detection**
- **Location Access**: Automatically gets user's GPS coordinates (with permission)
- **Nearby Search**: Finds the nearest police stations within 10km radius
- **Distance Calculation**: Uses Haversine formula for accurate distance calculation
- **Contact Information**: Provides police station details (name, address, phone)

### 3. **FIR Generation & Submission**
- **Automatic Generation**: Creates formal FIR drafts for severe incidents
- **Police Station Integration**: Submits FIRs to the nearest police station
- **FIR Number Assignment**: Generates official FIR numbers upon successful submission
- **Status Tracking**: Tracks FIR status (draft, submitted, approved, lodged)

### 4. **Dashboard Integration**
- **Activity Tracking**: Shows FIR activities in the dashboard's recent activity section
- **Status Updates**: Real-time updates on FIR submission status
- **Quick Actions**: Direct links to call police stations and get directions

## 🚀 How It Works

### Step 1: Automatic Incident Description Analysis
1. User enters incident description in the log incident page
2. **AI automatically analyzes the text after 2 seconds of inactivity** (debounced)
3. System determines severity level and provides recommendations
4. For critical/high severity cases, automatically requests location access

### Step 2: Police Station Detection
1. System gets user's current GPS coordinates
2. Searches for nearby police stations in the database
3. Calculates distances and ranks stations by proximity
4. Selects the nearest station for FIR submission

### Step 3: FIR Generation
1. Creates a formal FIR draft with all incident details
2. Includes police station information and contact details
3. Preserves user privacy by using anonymous complainant details
4. Shows FIR review dialog for user approval

### Step 4: FIR Submission
1. User reviews and approves FIR details
2. System submits FIR to the selected police station
3. Receives confirmation and FIR number
4. Updates dashboard with FIR activity

## 🔧 Technical Implementation

### API Endpoints

#### 1. Incident Analysis (`/api/incident-analysis`)
```typescript
POST /api/incident-analysis
{
  "description": "Incident description text",
  "location": "Incident location",
  "witnesses": "Witness information"
}

Response:
{
  "severity": "critical|high|medium|low",
  "confidence": 0.95,
  "recommendation": "Detailed recommendation",
  "legalImplications": "Legal context",
  "immediateActions": ["Action 1", "Action 2"],
  "policeIntervention": true/false,
  "poshApplicable": true/false,
  "riskFactors": ["Factor 1", "Factor 2"],
  "evidenceNeeded": ["Evidence 1", "Evidence 2"]
}
```

#### 2. Police Station Search (`/api/police-stations`)
```typescript
POST /api/police-stations
{
  "latitude": 19.0760,
  "longitude": 72.8777,
  "radius": 10
}

Response:
{
  "policeStations": [
    {
      "name": "Central Police Station",
      "address": "123 Main Street, City Center",
      "phone": "022-22621855",
      "distance": 2.5,
      "coordinates": { "lat": 19.0760, "lng": 72.8777 }
    }
  ]
}
```

#### 3. FIR Submission (`/api/submit-fir`)
```typescript
POST /api/submit-fir
{
  "incidentId": "INC-1234567890",
  "complainantName": "Anonymous Complainant",
  "incidentDescription": "Detailed incident description",
  "incidentLocation": "Location details",
  "policeStation": { /* police station object */ },
  // ... other FIR fields
}

Response:
{
  "success": true,
  "firNumber": "PS/2024/1234",
  "message": "FIR successfully lodged",
  "firData": { /* complete FIR object */ }
}
```

### Components

#### 1. IncidentAnalysisAI Component
- **Location**: `components/IncidentAnalysisAI.tsx`
- **Purpose**: Main AI analysis interface
- **Features**: 
  - Incident severity analysis
  - Police station detection
  - FIR generation and submission
  - Real-time status updates

#### 2. FIRActivityCard Component
- **Location**: `components/FIRActivityCard.tsx`
- **Purpose**: Display FIR activities in dashboard
- **Features**:
  - FIR status display
  - Police station contact information
  - Quick action buttons (call, directions)
  - Timeline tracking

### Database Integration

#### Police Station Database
The system includes a comprehensive database of police stations across major Indian cities:
- Mumbai (Central, Bandra, Andheri)
- Delhi (Connaught Place, Dwarka)
- Bangalore (Koramangala)
- Chennai (T Nagar)
- Hyderabad (Banjara Hills)
- Kolkata (Park Street)
- Pune (Koregaon Park)

#### FIR Storage
- **Local Storage**: FIRs are stored in `localStorage` for immediate access
- **Backend Integration**: FIR data can be synced with backend database
- **Status Tracking**: Complete status lifecycle from draft to lodged

## 🔒 Privacy & Security

### Data Protection
- **Anonymous Submission**: FIRs are submitted with anonymous complainant details
- **Location Privacy**: GPS coordinates are only used for police station detection
- **Local Storage**: Sensitive data stored locally on user's device
- **Encryption**: All data encrypted during transmission

### User Consent
- **Location Permission**: Explicit permission required for GPS access
- **FIR Review**: Users must approve FIR details before submission
- **Data Control**: Users can delete FIR data anytime

## 🛠️ Setup Instructions

### 1. Environment Configuration
```env
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. API Key Setup
1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the key to your `.env.local` file
3. The system will work without the API key using fallback analysis

### 3. Testing the System
1. Navigate to the log incident page
2. Enter a detailed incident description
3. **AI automatically analyzes the description after 2 seconds of inactivity**
4. For severe cases, the system will automatically request location access
5. Review and approve FIR details
6. Check the dashboard for FIR activities

## 📱 User Experience Flow

### For Users
1. **Log Incident**: Enter incident details as usual
2. **Automatic AI Analysis**: AI analyzes description automatically after 2 seconds of inactivity
3. **Location Access**: Grant location permission if prompted for severe cases
4. **FIR Review**: Review generated FIR details
5. **Submit FIR**: Approve and submit to police station
6. **Track Progress**: Monitor FIR status in dashboard

### For Severe Cases
1. **Immediate Alert**: System detects critical severity
2. **Location Request**: Automatically requests GPS access
3. **Police Station Search**: Finds nearest station
4. **FIR Generation**: Creates formal complaint
5. **Emergency Contact**: Provides police station contact details
6. **Status Updates**: Real-time tracking of submission

## 🔄 Integration Points

### Dashboard Integration
- **Recent Activity**: FIR activities appear in dashboard
- **Status Badges**: Visual indicators for FIR status
- **Quick Actions**: Direct links to police station contacts
- **Timeline View**: Complete history of FIR activities

### Emergency Features
- **Location Sharing**: Integrates with emergency button system
- **Police Contact**: Direct calling to police stations
- **Directions**: Google Maps integration for police station locations
- **Status Tracking**: Real-time updates on complaint progress

## 🚨 Emergency Scenarios

### Critical Incident Response
1. **Immediate Detection**: AI identifies critical severity
2. **Location Access**: Automatic GPS request
3. **Police Alert**: Direct connection to nearest station
4. **FIR Generation**: Instant formal complaint creation
5. **Emergency Support**: Integration with emergency features

### High Severity Response
1. **Severity Assessment**: AI determines high severity
2. **Legal Guidance**: Provides relevant legal information
3. **Police Recommendation**: Suggests police intervention
4. **FIR Preparation**: Generates complaint draft
5. **Support Resources**: Connects to legal aid and support services

## 📊 Analytics & Monitoring

### System Metrics
- **Analysis Accuracy**: Track AI severity assessment accuracy
- **Response Time**: Monitor FIR generation and submission times
- **Success Rate**: Track successful FIR submissions
- **User Engagement**: Monitor feature usage patterns

### Quality Assurance
- **Fallback Analysis**: Keyword-based analysis when AI unavailable
- **Error Handling**: Graceful degradation for API failures
- **Data Validation**: Comprehensive input validation
- **User Feedback**: Continuous improvement based on user input

## 🔮 Future Enhancements

### Planned Features
- **Multi-language Support**: AI analysis in Hindi, Marathi, Tamil
- **Voice Input**: Speech-to-text for incident descriptions
- **Image Analysis**: AI-powered evidence analysis
- **Predictive Analytics**: Risk assessment and prevention recommendations
- **Integration APIs**: Direct police department API integration

### Advanced AI Capabilities
- **Context Understanding**: Better understanding of workplace dynamics
- **Pattern Recognition**: Identifying recurring harassment patterns
- **Legal Expertise**: Advanced legal advice and case law integration
- **Emotional Support**: AI-powered counseling and support

## 🆘 Support & Troubleshooting

### Common Issues
1. **Location Access Denied**: System provides manual police station selection
2. **AI Analysis Failure**: Fallback to keyword-based analysis
3. **FIR Submission Error**: Retry mechanism with alternative stations
4. **Network Issues**: Offline mode with local storage

### Getting Help
- **Documentation**: Refer to this guide for setup instructions
- **API Status**: Check Gemini API status for analysis issues
- **Police Database**: Verify police station information accuracy
- **User Support**: Contact support for technical assistance

---

This agentic AI system represents a significant advancement in workplace safety technology, providing intelligent, proactive assistance to women experiencing harassment while maintaining privacy and security standards. 