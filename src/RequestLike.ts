/**
 * Express-like Request interface
 * 
 * Wraps the standard WHATWG Request with Express-style properties and methods.
 * Provides convenient access to URL components, parameters, and headers.
 */
export interface IRequestLike {
  /**
   * The original WHATWG Request object
   */
  raw: globalThis.Request;
  
  /**
   * Route parameters extracted from the URL path
   * Example: For route "/users/:id", accessing "/users/123" would have params.id = "123"
   */
  params: Record<string, string>;
  
  /**
   * URL query parameters parsed from the request URL
   * Provides access via get(), getAll(), has() and other URLSearchParams methods
   */
  query: URLSearchParams;
  
  /**
   * The path portion of the URL (without query string)
   * Example: For URL "https://example.com/users?sort=asc", path would be "/users"
   */
  path: string;
  
  /**
   * The hostname from the request URL
   * Example: For URL "https://example.com/users", hostname would be "example.com"
   */
  hostname: string;
  
  /**
   * The protocol from the request URL (http or https)
   */
  protocol: 'http' | 'https';
  
  /**
   * The complete original URL string
   */
  originalUrl: string;
  
  /**
   * Gets a header value by name (case-insensitive)
   * @param name - Header name
   * @returns Header value or null if not present
   */
  get(name: string): string | null;
  
  /**
   * Parsed request body (populated by body-parsing middleware)
   * Type depends on content type (object for JSON, FormData for multipart, etc.)
   */
  body?: any;
  
  /**
   * Raw binary body data (populated by body-parsing middleware)
   * Useful for custom body parsing or validation
   */
  rawBody?: Uint8Array;
}

export type RequestLike = IRequestLike;

/**
 * Creates a RequestLike object from a standard WHATWG Request
 * 
 * @param raw - The original WHATWG Request object
 * @param params - Route parameters extracted from URL patterns (e.g. from path matching)
 * @returns A RequestLike object with Express-like properties and methods
 */
export function createRequestLike(
  raw: Request,
  params: Record<string, string> = {}
): RequestLike {
  const url = new URL(raw.url)

  return {
    raw,
    params,
    query: url.searchParams,
    path: url.pathname,
    hostname: url.hostname,
    protocol: url.protocol.replace(':', '') as 'http' | 'https',
    originalUrl: raw.url,

    get(name: string) {
      return raw.headers.get(name.toLowerCase()) ?? null
    },

    body: undefined,
    rawBody: undefined,
  }
}