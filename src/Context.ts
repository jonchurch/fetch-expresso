import { createRequestLike, type IRequestLike } from "./RequestLike"
import { ResAccumulator, type IResAccumulator } from "./ResponseAccumulator"

/**
 * Request/response context for middleware
 * 
 * This context is passed to middleware functions, providing access to both
 * the request and response objects.
 */
export interface Context {
  /**
   * The request object containing information about the HTTP request
   */
  req: IRequestLike;
  
  /**
   * The response accumulator for building the HTTP response
   */
  res: IResAccumulator;
}

/**
 * Creates a new middleware context object from a raw request
 * 
 * @param raw - The original WHATWG Request object
 * @param params - Route parameters extracted from URL patterns (e.g. from path matching)
 * @returns A complete context with request and response objects
 */
export function createContext(raw: Request, params: Record<string, string> = {}): Context {
  return {
    req: createRequestLike(raw, params),
    res: new ResAccumulator(),
  }
}

