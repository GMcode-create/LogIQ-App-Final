import React, { createContext, useContext, useState, useEffect } from 'react';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';

declare global {
  interface Window {
    google: any;
    googleSignInCallback: ((success: boolean) => void) | null;
    googleAuthError?: string;
    googleAuthIsSignUp?: boolean;
  }
}

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider?: 'email' | 'google';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: (isSignUp?: boolean) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Google OAuth
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Disable automatic prompts to prevent conflicts
        window.google.accounts.id.disableAutoSelect();
      }
    };

    // Load Google OAuth script
    const loadGoogleScript = () => {
      if (!document.getElementById('google-oauth-script')) {
        const script = document.createElement('script');
        script.id = 'google-oauth-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleAuth;
        document.head.appendChild(script);
      } else {
        initializeGoogleAuth();
      }
    };

    loadGoogleScript();

    // Check for existing session on app load
    const savedUser = localStorage.getItem('logiq_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('logiq_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation - in a real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('logiq_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('logiq_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('logiq_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);

    if (existingUser) {
      setIsLoading(false);
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, this would be hashed
      name
    };

    users.push(newUser);
    localStorage.setItem('logiq_users', JSON.stringify(users));

    // Auto-login after signup
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userData);
    localStorage.setItem('logiq_user', JSON.stringify(userData));

    setIsLoading(false);
    return true;
  };

  // Handle Google Sign-In response
  const handleGoogleSignIn = async (response: any) => {
    // Get the signup context from the global variable
    const isSignUp = window.googleAuthIsSignUp || false;
    try {
      console.log('Google sign-in response received');
      setIsLoading(true);

      // Decode the JWT token from Google
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const googleUser = JSON.parse(jsonPayload);
      console.log('Decoded Google user:', googleUser);

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('logiq_users') || '[]');
      const existingUser = users.find((u: any) => u.email === googleUser.email);

      // If user exists and this is a sign-up attempt, show error
      if (existingUser && isSignUp) {
        console.log('User already exists, cannot sign up again');
        setIsLoading(false);

        if (window.googleSignInCallback) {
          window.googleSignInCallback(false);
          window.googleSignInCallback = null;
        }

        // Store error message for the modal to display
        window.googleAuthError = 'An account with this email already exists. Please use the Login tab instead.';
        return false;
      }

      // If user doesn't exist and this is a login attempt, show error
      if (!existingUser && !isSignUp) {
        console.log('User does not exist, must sign up first');
        setIsLoading(false);

        if (window.googleSignInCallback) {
          window.googleSignInCallback(false);
          window.googleSignInCallback = null;
        }

        // Store error message for the modal to display
        window.googleAuthError = 'No account found with this email. Please use the Sign Up tab to create an account first.';
        return false;
      }

      // Create user object from Google data
      const userData: User = {
        id: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        provider: 'google'
      };

      // Save user data
      setUser(userData);
      localStorage.setItem('logiq_user', JSON.stringify(userData));

      // Add to users list if new user (sign up)
      if (!existingUser) {
        users.push({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          provider: 'google',
          picture: userData.picture
        });
        localStorage.setItem('logiq_users', JSON.stringify(users));
      }

      console.log('User data saved successfully');
      setIsLoading(false);

      // Call the callback if it exists (for loginWithGoogle promise resolution)
      if (window.googleSignInCallback) {
        console.log('Calling Google sign-in callback with success');
        window.googleSignInCallback(true);
        window.googleSignInCallback = null; // Clean up
      }

      return true;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setIsLoading(false);

      // Call the callback with failure if it exists
      if (window.googleSignInCallback) {
        console.log('Calling Google sign-in callback with failure');
        window.googleSignInCallback(false);
        window.googleSignInCallback = null; // Clean up
      }

      return false;
    }
  };

  // Trigger Google Sign-In
  const loginWithGoogle = async (isSignUp: boolean = false): Promise<boolean> => {
    if (!window.google) {
      console.error('Google SDK not loaded');
      return false;
    }

    try {
      console.log('Starting Google sign-in...', isSignUp ? 'Sign Up' : 'Login');

      // Store the signup context globally so the callback can access it
      window.googleAuthIsSignUp = isSignUp;

      return new Promise<boolean>((resolve) => {
        // Set up timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          console.log('Google sign-in timeout');
          // Clean up
          if (window.googleAuthIsSignUp !== undefined) {
            delete window.googleAuthIsSignUp;
          }
          resolve(false);
        }, 10000);

        // Store the resolve function so the callback can use it
        window.googleSignInCallback = (success: boolean) => {
          console.log('Google callback received:', success);
          clearTimeout(timeout);
          window.googleSignInCallback = null;
          // Clean up the signup context
          if (window.googleAuthIsSignUp !== undefined) {
            delete window.googleAuthIsSignUp;
          }
          resolve(success);
        };

        // Create a temporary visible button that we can click
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '50%';
        tempContainer.style.left = '50%';
        tempContainer.style.transform = 'translate(-50%, -50%)';
        tempContainer.style.zIndex = '999999';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '20px';
        tempContainer.style.borderRadius = '8px';
        tempContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        document.body.appendChild(tempContainer);

        // Add loading text
        const loadingText = document.createElement('div');
        loadingText.textContent = `Opening Google ${isSignUp ? 'Sign-Up' : 'Sign-In'}...`;
        loadingText.style.textAlign = 'center';
        loadingText.style.marginBottom = '15px';
        loadingText.style.color = '#333';
        tempContainer.appendChild(loadingText);

        try {
          // Render the Google button
          window.google.accounts.id.renderButton(tempContainer, {
            theme: 'filled_blue',
            size: 'large',
            type: 'standard',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 280
          });

          // Auto-click the button after rendering
          setTimeout(() => {
            const button = tempContainer.querySelector('div[role="button"]') as HTMLElement;
            if (button) {
              console.log('Auto-clicking Google button');
              button.click();

              // Remove the container after clicking
              setTimeout(() => {
                if (document.body.contains(tempContainer)) {
                  document.body.removeChild(tempContainer);
                }
              }, 1000);
            } else {
              console.log('Google button not found');
              clearTimeout(timeout);
              if (document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
              }
              window.googleSignInCallback = null;
              if (window.googleAuthIsSignUp !== undefined) {
                delete window.googleAuthIsSignUp;
              }
              resolve(false);
            }
          }, 500);

        } catch (renderError) {
          console.error('Error rendering Google button:', renderError);
          clearTimeout(timeout);
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
          window.googleSignInCallback = null;
          if (window.googleAuthIsSignUp !== undefined) {
            delete window.googleAuthIsSignUp;
          }
          resolve(false);
        }
      });

    } catch (error) {
      console.error('Google sign-in error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('logiq_user');

    // Sign out from Google if user was signed in with Google
    if (user?.provider === 'google' && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};