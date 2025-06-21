// Google Analytics utility for TellYouSomeday
// Tracks important user interactions and behaviors

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = 'G-DD17QBX1Q3';

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.log('Google Analytics not configured');
    return false;
  }

  // GA is initialized in index.html
  console.log('Google Analytics ready with ID:', GA_MEASUREMENT_ID);
  return true;
};

// Generic event tracking
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
    console.log('GA Event:', eventName, parameters);
  }
};

// Page view tracking
export const trackPageView = (pageName: string, pageUrl?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: pageName,
      page_location: pageUrl || window.location.href,
    });
    console.log('GA Page View:', pageName);
  }
};

// TellYouSomeday specific event tracking
export const analytics = {
  // User Authentication Events
  userSignIn: (method: string = 'google') => {
    trackEvent('login', {
      method,
      category: 'authentication',
    });
  },

  userSignOut: () => {
    trackEvent('logout', {
      category: 'authentication',
    });
  },

  // Message Creation Events
  messageStarted: (recipientType: string) => {
    trackEvent('message_creation_started', {
      recipient_type: recipientType,
      category: 'message_creation',
    });
  },

  messageCompleted: (recipientType: string, isPrivate: boolean, deliveryType: string) => {
    trackEvent('message_creation_completed', {
      recipient_type: recipientType,
      is_private: isPrivate,
      delivery_type: deliveryType,
      category: 'message_creation',
      value: 1, // Each message created has value
    });
  },

  messageAbandoned: (step: number, recipientType?: string) => {
    trackEvent('message_creation_abandoned', {
      step,
      recipient_type: recipientType,
      category: 'message_creation',
    });
  },

  // Message Search Events
  searchPerformed: (query: string, resultsCount: number) => {
    trackEvent('search', {
      search_term: query.substring(0, 50), // Limit length for privacy
      results_count: resultsCount,
      category: 'search',
    });
  },

  messageFound: (messageType: string, isPrivate: boolean) => {
    trackEvent('message_found', {
      message_type: messageType,
      is_private: isPrivate,
      category: 'search',
    });
  },

  messageUnlocked: (attempts: number = 1) => {
    trackEvent('message_unlocked', {
      unlock_attempts: attempts,
      category: 'engagement',
      value: 2, // Unlocking a message is valuable engagement
    });
  },

  messageUnlockFailed: (attempts: number) => {
    trackEvent('message_unlock_failed', {
      unlock_attempts: attempts,
      category: 'engagement',
    });
  },

  // Navigation Events
  pageVisited: (pageName: string) => {
    trackPageView(pageName);
    trackEvent('page_view', {
      page_name: pageName,
      category: 'navigation',
    });
  },

  buttonClicked: (buttonName: string, location: string) => {
    trackEvent('button_click', {
      button_name: buttonName,
      button_location: location,
      category: 'interaction',
    });
  },

  // Engagement Events
  timeSpentOnPage: (pageName: string, timeInSeconds: number) => {
    trackEvent('page_engagement', {
      page_name: pageName,
      time_spent: timeInSeconds,
      category: 'engagement',
    });
  },

  featureUsed: (featureName: string) => {
    trackEvent('feature_usage', {
      feature_name: featureName,
      category: 'feature',
    });
  },

  // Error Events
  errorOccurred: (errorType: string, errorMessage: string, page: string) => {
    trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage.substring(0, 100), // Limit length
      page,
      category: 'error',
    });
  },

  // Conversion Events (important actions)
  conversion: (action: string, value: number = 1) => {
    trackEvent('conversion', {
      action,
      value,
      category: 'conversion',
    });
  },
};

// React hook for page view tracking
export const usePageTracking = (pageName: string) => {
  if (typeof window !== 'undefined') {
    analytics.pageVisited(pageName);
  }
};

// React hook for time tracking
export const useTimeTracking = (pageName: string) => {
  if (typeof window !== 'undefined') {
    const startTime = Date.now();
    
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      analytics.timeSpentOnPage(pageName, timeSpent);
    };
  }
  return () => {};
};

export default analytics;
