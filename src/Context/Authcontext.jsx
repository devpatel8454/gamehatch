import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Load user session from localStorage if exists
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
        }
      }
    }
  }, []);

  const login = async ({ endpoint, payload, onSuccess }) => {
    try {
      if (import.meta.env.DEV) {
        console.log('AuthContext - Login attempt:', { endpoint, payload });
      }

      // Make actual API call to backend
      const response = await fetch(`https://${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      if (import.meta.env.DEV) {
        console.log('Raw API Response:', response.status, responseText);
      }

      // Check if response is actually JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        if (import.meta.env.DEV) {
          console.error('Failed to parse JSON response:', parseError);
          console.error('Response text:', responseText.substring(0, 200) + '...');
        }
        throw new Error(`Server returned invalid JSON. Status: ${response.status}. Response: ${responseText.substring(0, 100)}...`);
      }

      if (import.meta.env.DEV) {
        console.log('Parsed API Response:', response.status, data);
      }

      if (!response.ok) {
        // Handle API errors
        const errorMessage = data.message || data.error || 'Invalid credentials';
        throw new Error(errorMessage);
      }

      // Extract token and user data from API response
      // Handle different response formats
      let jwtToken, userData, message;

      if (import.meta.env.DEV) {
        console.log('🔍 Raw API response data:', data);
      }

      if (data.token && data.user) {
        // Format: { token: "...", user: {...}, message: "..." }
        jwtToken = data.token;
        userData = data.user;
        message = data.message;
        if (import.meta.env.DEV) {
          console.log('✅ Format 1: token + user object');
        }
      } else if (data.accessToken && data.user) {
        // Format: { accessToken: "...", user: {...} }
        jwtToken = data.accessToken;
        userData = data.user;
        message = data.message || 'Login successful';
        if (import.meta.env.DEV) {
          console.log('✅ Format 2: accessToken + user object');
        }
      } else if (data.token) {
        // Format: { token: "...", userId: 123, username: "..." }
        jwtToken = data.token;
        userData = {
          id: data.userId || data.UserId || data.id || data.Id,
          username: data.username || data.Username,
          email: data.email || data.Email,
          firstName: data.firstName || data.FirstName,
          lastName: data.lastName || data.LastName,
        };
        message = data.message || 'Login successful';
        if (import.meta.env.DEV) {
          console.log('✅ Format 3: flat token + user fields');
        }
      } else {
        if (import.meta.env.DEV) {
          console.error('Unexpected API response format:', data);
        }
        throw new Error('Invalid response format from server');
      }
      
      if (import.meta.env.DEV) {
        console.log('📦 Extracted userData:', userData);
      }

      if (!jwtToken) {
        throw new Error('No token received from server');
      }

      // Store JWT token and user data in localStorage
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update context state
      setToken(jwtToken);
      setUser(userData);
      setIsAuthenticated(true);

      // Call success callback
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }

      return { data: { success: true, message } };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('AuthContext - Login error:', error);
      }
      return { error: error };
    }
  };

  const signup = async ({ endpoint, payload, onSuccess }) => {
    try {
      if (import.meta.env.DEV) {
        console.log('AuthContext - Signup attempt:', { endpoint, payload });
      }

      // Make actual API call to backend
      const response = await fetch(`https://${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      if (import.meta.env.DEV) {
        console.log('Raw API Response:', response.status, responseText);
      }

      // Check if response is actually JSON
      let data;
      try {
        data = JSON.parse(responseText);
        if (import.meta.env.DEV) {
          console.log('Parsed Signup API Response:', response.status, data);
        }
      } catch (parseError) {
        // If parsing fails, treat as plain text response
        if (import.meta.env.DEV) {
          console.log('Signup API returned plain text, not JSON:', responseText);
        }
        data = { message: responseText };
      }

      if (!response.ok) {
        // Handle API errors
        const errorMessage = data.message || data.error || 'Signup failed';
        throw new Error(errorMessage);
      }

      // For signup, we typically don't get a token back immediately
      // The user would need to login after successful signup
      let message = data.message || 'Signup successful';

      // Call success callback
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }

      return { data: { success: true, message } };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('AuthContext - Signup error:', error);
      }
      return { error: error };
    }
  };

  const logout = async () => {
    try {
      if (import.meta.env.DEV) {
        console.log('AuthContext - Logout');
      }

      // Get current token for logout API call
      const currentToken = localStorage.getItem("token");

      // Call logout API if token exists
      if (currentToken) {
        try {
          await fetch('https://localhost:7270/api/Auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: currentToken
            }),
          });
          if (import.meta.env.DEV) {
            console.log('Logout API call successful');
          }
        } catch (apiError) {
          if (import.meta.env.DEV) {
            console.warn('Logout API call failed, but continuing with local logout:', apiError);
          }
          // Continue with local logout even if API call fails
        }
      }

      // Clear local storage and token
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setToken("");
      setUser(null);
      setIsAuthenticated(false);

      return { data: { success: true } };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('AuthContext - Logout error:', error);
      }
      return { error: error };
    }
  };

  // Purge any old/invalid tokens and user data locally without calling the backend
  const purgeAuth = () => {
    try {
      if (import.meta.env.DEV) {
        console.log('AuthContext - Purge local auth storage');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Also remove any admin token if present
      localStorage.removeItem('adminToken');
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('AuthContext - Error clearing localStorage:', e);
      }
    }
    setToken("");
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = {
    token,
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    purgeAuth,
    searchValue,
    setSearchValue,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
