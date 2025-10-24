/**
 * Basic Authentication Middleware for Vercel Serverless Functions
 *
 * This module provides Basic Auth verification for protecting API endpoints.
 * Use this in your Vercel serverless functions to add authentication.
 */

export interface BasicAuthConfig {
  user: string;
  password: string;
}

export interface AuthResult {
  authenticated: boolean;
  user?: string;
  error?: string;
}

/**
 * Verifies Basic Authentication credentials from request headers
 *
 * @param authHeader - The Authorization header value
 * @param config - Expected username and password
 * @returns Authentication result
 */
export function verifyBasicAuth(
  authHeader: string | null | undefined,
  config: BasicAuthConfig
): AuthResult {
  if (!authHeader) {
    return {
      authenticated: false,
      error: 'No authorization header provided',
    };
  }

  // Check if it's a Basic auth header
  if (!authHeader.startsWith('Basic ')) {
    return {
      authenticated: false,
      error: 'Invalid authentication type',
    };
  }

  // Extract and decode credentials
  const base64Credentials = authHeader.substring(6);
  let credentials: string;

  try {
    credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  } catch (error) {
    return {
      authenticated: false,
      error: 'Invalid base64 encoding',
    };
  }

  const [username, password] = credentials.split(':');

  if (!username || !password) {
    return {
      authenticated: false,
      error: 'Invalid credential format',
    };
  }

  // Verify credentials
  if (username === config.user && password === config.password) {
    return {
      authenticated: true,
      user: username,
    };
  }

  return {
    authenticated: false,
    error: 'Invalid credentials',
  };
}

/**
 * Creates an unauthorized response for Basic Auth
 *
 * @param realm - The authentication realm name
 * @returns Response object with 401 status
 */
export function createUnauthorizedResponse(realm = 'Secure Area') {
  return {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}"`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      error: 'Authentication required',
      message: 'Please provide valid credentials',
    }),
  };
}

/**
 * Gets Basic Auth configuration from environment variables
 *
 * @returns Auth config or null if not configured
 */
export function getAuthConfig(): BasicAuthConfig | null {
  const user = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (!user || !password) {
    console.warn('⚠️ BASIC_AUTH_USER or BASIC_AUTH_PASSWORD not set. Authentication disabled.');
    return null;
  }

  return { user, password };
}

/**
 * Middleware wrapper for serverless functions
 * Adds Basic Auth to any handler function
 *
 * @param handler - The original serverless function handler
 * @returns Wrapped handler with authentication
 *
 * @example
 * ```typescript
 * import { withBasicAuth } from './auth-middleware';
 *
 * async function handler(req, res) {
 *   res.json({ message: 'Protected data' });
 * }
 *
 * export default withBasicAuth(handler);
 * ```
 */
export function withBasicAuth(
  handler: (req: any, res: any) => Promise<any> | any
) {
  return async (req: any, res: any) => {
    // Get auth config
    const authConfig = getAuthConfig();

    // Skip auth if not configured (for development)
    if (!authConfig) {
      return handler(req, res);
    }

    // Verify authentication
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const authResult = verifyBasicAuth(authHeader, authConfig);

    if (!authResult.authenticated) {
      const response = createUnauthorizedResponse();
      res.status(response.status);
      Object.entries(response.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      return res.send(response.body);
    }

    // Authentication successful, proceed to handler
    return handler(req, res);
  };
}
