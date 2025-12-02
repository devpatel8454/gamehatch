# Google OAuth Setup Instructions

## Step 1: Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:3000`
   - Add authorized redirect URIs:
     - `http://localhost:5173`
     - `http://localhost:3000`
   - Click "Create"
   - Copy the Client ID

## Step 2: Update the Client ID

Open `src/main.jsx` and replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID:

```javascript
const GOOGLE_CLIENT_ID = "your-actual-client-id-here.apps.googleusercontent.com";
```

## Step 3: Backend API Endpoint

Make sure your backend has the following endpoint:

**POST** `/api/Auth/google-login`

Request body:
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "googleId": "google-user-id",
  "picture": "https://..."
}
```

Response:
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Step 4: Test the Integration

1. Run the frontend: `npm run dev`
2. Go to the signup page
3. Click the "Google" button
4. Sign in with your Google account
5. You should be redirected to the home page

## Troubleshooting

- **Error: "Invalid Client ID"**: Make sure you copied the correct Client ID from Google Cloud Console
- **Error: "Redirect URI mismatch"**: Add your localhost URL to authorized redirect URIs in Google Cloud Console
- **Backend error**: Check that your backend API endpoint is working correctly
