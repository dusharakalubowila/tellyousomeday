# 🔗 Google Integration Guide for TellYouSomeday

## 1. 🔐 Google Authentication (OAuth 2.0)

### Frontend Setup

1. **Install Google OAuth library:**
```bash
npm install @google-cloud/oauth2 google-auth-library
npm install react-google-login # or @react-oauth/google for newer versions
```

2. **Get Google Client ID:**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add your domain to authorized origins

3. **Add to your React app:**
```jsx
// src/components/GoogleLogin.jsx
import { GoogleLogin } from 'react-google-login';

const GoogleLoginButton = ({ onSuccess, onFailure }) => {
  return (
    <GoogleLogin
      clientId="YOUR_GOOGLE_CLIENT_ID"
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      className="google-login-btn"
    />
  );
};
```

### Backend Setup

1. **Install backend dependencies:**
```bash
cd backend
npm install google-auth-library jsonwebtoken
```

2. **Add Google verification:**
```javascript
// backend/middleware/googleAuth.js
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    throw new Error('Invalid Google token');
  }
}

module.exports = { verifyGoogleToken };
```

## 2. 📊 Google Analytics 4

### Add to your React app:

1. **Install gtag:**
```bash
npm install gtag
```

2. **Add to index.html:**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

3. **Track events:**
```javascript
// src/utils/analytics.js
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }
};

// Usage examples:
trackEvent('message_created', { category: 'engagement' });
trackEvent('message_searched', { search_term: searchQuery });
trackEvent('message_unlocked', { message_type: 'private' });
```

## 3. 🔍 Google Search Console

### Setup steps:

1. **Verify domain ownership:**
- Go to [Google Search Console](https://search.google.com/search-console/)
- Add your domain: `tellyousomeday.com`
- Verify using DNS record or HTML file upload

2. **Submit sitemap:**
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tellyousomeday.com/</loc>
    <lastmod>2025-06-21</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tellyousomeday.com/about</loc>
    <lastmod>2025-06-21</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tellyousomeday.com/write</loc>
    <lastmod>2025-06-21</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://tellyousomeday.com/search</loc>
    <lastmod>2025-06-21</lastmod>
    <priority>0.9</priority>
  </url>
</urlset>
```

## 4. ☁️ Google Cloud Platform

### Useful services for TellYouSomeday:

1. **Cloud Storage** - Store message attachments
2. **Cloud Functions** - Serverless message processing
3. **Cloud SQL** - Managed database
4. **Cloud Run** - Deploy your app
5. **Firebase** - Real-time features

### Firebase Integration (Recommended):

```bash
npm install firebase
```

```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "tellyousomeday.firebaseapp.com",
  projectId: "tellyousomeday",
  storageBucket: "tellyousomeday.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 5. 📧 Gmail API Integration

For sending scheduled messages via Gmail:

```javascript
// backend/services/gmailService.js
const { google } = require('googleapis');

async function sendEmailViaGmail(messageData) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
  // Compose and send email
  const message = {
    to: messageData.recipientEmail,
    subject: 'A message from TellYouSomeday',
    text: messageData.message
  };

  return await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: Buffer.from(message).toString('base64') }
  });
}
```

## 6. 🗺️ Google Maps (for location-based messages)

```bash
npm install @googlemaps/js-api-loader
```

```javascript
// src/components/LocationPicker.jsx
import { Loader } from '@googlemaps/js-api-loader';

const LocationPicker = ({ onLocationSelect }) => {
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
      
      map.addListener('click', (event) => {
        onLocationSelect(event.latLng);
      });
    });
  }, []);

  return <div id="map" style={{ height: '400px' }} />;
};
```

## 🔧 Environment Variables

Add these to your `.env` files:

```bash
# Frontend (.env)
REACT_APP_GOOGLE_CLIENT_ID=your_client_id
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
REACT_APP_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Backend (.env)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
```

## 📋 Next Steps

1. Choose which Google services you want to integrate
2. Set up Google Cloud Console project
3. Configure OAuth credentials
4. Install required dependencies
5. Implement authentication flow
6. Add analytics tracking
7. Set up Search Console
8. Test integrations

Would you like me to help implement any of these specific integrations?
