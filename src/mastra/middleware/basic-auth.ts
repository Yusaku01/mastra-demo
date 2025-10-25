// Lightweight Basic Auth middleware for Hono (Vercel runtime)
// Applies to all routes when BASIC_AUTH_USER/BASIC_AUTH_PASSWORD are set.

export const basicAuthMiddleware = async (c: any, next: any) => {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASSWORD;

  // Auto-disable in development when credentials are not configured
  if (!user || !pass) {
    return next();
  }

  const auth = c.req.header('Authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return unauthorized(c);
  }

  try {
    const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf-8');
    const [u, p] = decoded.split(':');
    if (u === user && p === pass) {
      return next();
    }
  } catch (_) {
    // fallthrough to 401
  }

  return unauthorized(c);
};

function unauthorized(c: any) {
  return c.json(
    { error: 'Authentication required', message: 'Provide valid Basic auth credentials.' },
    401,
    { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
  );
}

