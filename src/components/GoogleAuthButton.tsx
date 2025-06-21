import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '795120485568-51shvqf84fu506jsvf4nc70b0ijdvepd.apps.googleusercontent.com';

interface GoogleAuthButtonProps {
  onSuccess?: (userInfo: any) => void;
  onError?: (error: any) => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, user, isAuthenticated } = useAuth();

  const handleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      // Decode the JWT token to get user info
      const userInfo = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      console.log('Google login success:', userInfo);
      
      const userData = {
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        googleToken: credentialResponse.credential
      };
      
      // Use the auth context to login
      login(userData);
      
      if (onSuccess) {
        onSuccess(userInfo);
      }
      
    } catch (error) {
      console.error('Error processing Google login:', error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.error('Google login failed');
    if (onError) {
      onError(new Error('Google login failed'));
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated && user) {
    return (
      <div className="google-auth-container authenticated">
        <div className="user-info">
          <img src={user.picture} alt={user.name} className="user-avatar" />
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="google-auth-container">
        {!isLoading ? (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            size="large"
            theme="outline"
            shape="rectangular"
            text="signin_with"
          />
        ) : (
          <div className="google-loading">
            <span>Signing in...</span>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

// CSS for the component
const googleAuthStyles = `
.google-auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.google-auth-container.authenticated {
  flex-direction: row;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(66, 133, 244, 0.2);
  min-width: 250px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(66, 133, 244, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

.user-email {
  font-size: 0.75rem;
  color: #7f8c8d;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.google-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.google-loading::before {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = googleAuthStyles;
  document.head.appendChild(styleSheet);
}

export default GoogleAuthButton;
