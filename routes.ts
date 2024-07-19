
/**
 * An array of routes that are accessible to the public [not logged in]
 * These routes do not require authentication
 */
export const publicRoutes = [
    "/"
];


/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
];

// important that all users can access the auth endpoint
/**
 * Prefix for API authentication routes
 * Routes that start with this prefix are used for API 
 * authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * the default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";