// Session utility functions for tracking active user sessions

/**
 * Get all active sessions from localStorage across all users
 * This counts sessions that haven't expired yet
 */
export const getActiveSessionsCount = () => {
  try {
    const sessions = [];
    
    // Check all localStorage keys for session data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Look for session keys (userSession or any session-related keys)
      if (key && key.includes('Session')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key));
          
          // Check if session has not expired
          if (sessionData && sessionData.expiryTime) {
            const expiryDate = new Date(sessionData.expiryTime);
            const now = new Date();
            
            if (expiryDate > now) {
              sessions.push(sessionData);
            }
          }
        } catch (e) {
          // Skip invalid session data
          continue;
        }
      }
    }
    
    // Also check cookies for sessions
    const cookieSessions = getSessionsFromCookies();
    
    // Combine and deduplicate sessions
    const allSessions = [...sessions, ...cookieSessions];
    const uniqueSessions = deduplicateSessions(allSessions);
    
    return uniqueSessions.length;
  } catch (error) {
    console.error('Error counting active sessions:', error);
    return 0;
  }
};

/**
 * Get sessions from cookies
 */
const getSessionsFromCookies = () => {
  try {
    const cookies = document.cookie.split(';');
    const sessions = [];
    
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      
      if (name && name.includes('Session') && value) {
        try {
          const sessionData = JSON.parse(decodeURIComponent(value));
          
          // Check if session has not expired
          if (sessionData && sessionData.expiryTime) {
            const expiryDate = new Date(sessionData.expiryTime);
            const now = new Date();
            
            if (expiryDate > now) {
              sessions.push(sessionData);
            }
          }
        } catch (e) {
          // Skip invalid session data
        }
      }
    });
    
    return sessions;
  } catch (error) {
    console.error('Error getting sessions from cookies:', error);
    return [];
  }
};

/**
 * Deduplicate sessions by sessionId or userId
 */
const deduplicateSessions = (sessions) => {
  const seen = new Set();
  return sessions.filter(session => {
    const identifier = session.sessionId || session.userId;
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
};

/**
 * Get current user's session data
 */
export const getCurrentSession = () => {
  try {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      
      // Check if session is still valid
      const expiryDate = new Date(session.expiryTime);
      const now = new Date();
      
      if (expiryDate > now) {
        return session;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

/**
 * Check if a session is expired
 */
export const isSessionExpired = (session) => {
  if (!session || !session.expiryTime) {
    return true;
  }
  
  const expiryDate = new Date(session.expiryTime);
  const now = new Date();
  
  return expiryDate <= now;
};

/**
 * Clean up expired sessions from localStorage
 */
export const cleanupExpiredSessions = () => {
  try {
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.includes('Session')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key));
          
          if (sessionData && isSessionExpired(sessionData)) {
            keysToRemove.push(key);
          }
        } catch (e) {
          // If we can't parse it, mark for removal
          keysToRemove.push(key);
        }
      }
    }
    
    // Remove expired sessions
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    return keysToRemove.length;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
};
