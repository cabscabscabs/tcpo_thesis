import { useState, useEffect, useCallback } from 'react';

interface CSRFToken {
  token: string;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to manage CSRF token for secure form submissions
 */
export function useCSRFToken() {
  const [csrf, setCSRF] = useState<CSRFToken>({
    token: '',
    loading: true,
    error: null
  });

  const fetchToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/csrf-token', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
      
      const data = await response.json();
      
      setCSRF({
        token: data.csrfToken,
        loading: false,
        error: null
      });
    } catch (error) {
      setCSRF({
        token: '',
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const getHeaders = useCallback(() => {
    return {
      'X-CSRF-Token': csrf.token,
      'Content-Type': 'application/json'
    };
  }, [csrf.token]);

  return {
    csrfToken: csrf.token,
    loading: csrf.loading,
    error: csrf.error,
    getHeaders,
    refreshToken: fetchToken
  };
}

/**
 * Hook to manage user sessions
 */
export function useSession() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/sessions', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const terminateSession = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to terminate session');
      }
      
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout-all', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to logout from all devices');
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    terminateSession,
    logoutAll
  };
}

/**
 * Hook for password validation
 */
export function usePasswordValidation() {
  const validatePassword = useCallback((password: string) => {
    const result = {
      isValid: false,
      score: 0,
      feedback: [] as string[]
    };

    if (password.length < 8) {
      result.feedback.push('Password must be at least 8 characters long');
    } else {
      result.score += 1;
    }

    if (password.length >= 12) {
      result.score += 1;
    }

    if (/[A-Z]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Include at least one uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Include at least one lowercase letter');
    }

    if (/[0-9]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Include at least one number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Include at least one special character');
    }

    result.isValid = result.score >= 4;
    return result;
  }, []);

  const getPasswordStrength = useCallback((score: number) => {
    if (score < 2) return { label: 'Weak', color: 'red' };
    if (score < 4) return { label: 'Fair', color: 'orange' };
    if (score < 5) return { label: 'Good', color: 'yellow' };
    return { label: 'Strong', color: 'green' };
  }, []);

  return { validatePassword, getPasswordStrength };
}

/**
 * Secure fetch wrapper that includes CSRF token
 */
export async function secureFetch(
  url: string, 
  options: RequestInit = {},
  csrfToken?: string
): Promise<Response> {
  const headers: HeadersInit = {
    ...options.headers,
    'Content-Type': 'application/json'
  };

  // Add CSRF token for non-GET requests
  if (csrfToken && (!options.method || options.method !== 'GET')) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
}
