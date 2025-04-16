import type { BodyInit } from 'undici-types/fetch';

/**
 * Express-like Response builder interface
 * 
 * Provides a chainable API for building HTTP responses using the WHATWG Fetch API.
 * Similar to Express.js response object, but produces a standard Response object.
 */
export interface IResAccumulator {
  /**
   * Sets the HTTP status code for the response
   * @param code - HTTP status code
   * @returns this for chaining
   */
  status(code: number): this;
  
  /**
   * Gets the current HTTP status code
   * @returns The current status code
   */
  getStatus(): number;
  
  /**
   * Sets a response header
   * @param name - Header name
   * @param value - Header value
   * @returns this for chaining
   */
  set(name: string, value: string): this;
  
  /**
   * Sets multiple headers at once
   * @param headers - Object containing header key-value pairs
   * @returns this for chaining
   */
  headers(headers: Record<string, string>): this;
  
  /**
   * Gets a response header value
   * @param name - Header name (case insensitive)
   * @returns Header value or null if not set
   */
  getHeader(name: string): string | null;
  
  /**
   * Gets all response headers
   * @returns A clone of the Headers object
   */
  getHeaders(): Headers;
  
  /**
   * Sets the Content-Type header (shorthand)
   * @param mime - MIME type string
   * @returns this for chaining
   */
  type(mime: string): this;
  
  /**
   * Sends response with the provided body and finalizes it
   * @param body - Response body content
   * @returns Finalized Response object
   */
  send(body: BodyInit): Response;
  
  /**
   * Sends JSON response and finalizes it
   * Sets Content-Type to application/json
   * @param data - Data to be JSON stringified
   * @returns Finalized Response object
   */
  json(data: unknown): Response;
  
  /**
   * Sends stream response and finalizes it
   * @param stream - ReadableStream to send as response
   * @returns Finalized Response object
   */
  stream(stream: ReadableStream): Response;
  
  /**
   * Creates redirect response and finalizes it
   * @param url - URL to redirect to
   * @param status - HTTP redirect status code (defaults to 302)
   * @returns Finalized Response object
   */
  redirect(url: string, status?: 301 | 302 | 303 | 307 | 308): Response;
  
  /**
   * Finalizes the response, preventing further modifications
   * @returns Finalized Response object
   */
  finalize(): Response;
  
  /**
   * Checks if the response has been finalized
   * @returns true if response is finalized
   */
  isFinalized(): boolean;
}

export class ResAccumulator implements IResAccumulator {
  private _status = 200
  private _headers = new Headers()
  private _body?: BodyInit
  private _finalized = false

  // --- Status ---
  status(code: number): this {
    this.assertWritable()
    this._status = code
    return this
  }

  getStatus(): number {
    return this._status
  }

  // --- Headers ---
  set(name: string, value: string): this {
    this.assertWritable()
    this._headers.set(name, value)
    return this
  }

  headers(headers: Record<string, string>): this {
    this.assertWritable()
    for (const [key, value] of Object.entries(headers)) {
      this._headers.set(key, value)
    }
    return this
  }

  getHeader(name: string): string | null {
    return this._headers.get(name)
  }

  getHeaders(): Headers {
    return new Headers(this._headers) // return a clone
  }

  // --- Content-Type Shortcut ---
  type(mime: string): this {
    this.assertWritable()
    this._headers.set('Content-Type', mime)
    return this
  }

  // --- Body / Finalization ---
  send(body: BodyInit): Response {
    this.assertWritable()
    this._body = body
    return this.finalize()
  }

  json(data: unknown): Response {
    this.assertWritable()
    this._headers.set('Content-Type', 'application/json')
    this._body = JSON.stringify(data)
    return this.finalize()
  }

  stream(stream: ReadableStream): Response {
    this.assertWritable()
    this._body = stream
    return this.finalize()
  }

  // redir status codes are 301, 302, 303, 307, and 308
  redirect(url: string, status: 301 | 302 | 303 | 307 | 308 = 302): Response {
    this.assertWritable()
    this._status = status
    this._headers.set('Location', url)
    this._body = undefined // Optional body; browsers handle this
    return this.finalize()
  }

  // -- TODO: Cookies ---
  // cookie(name: string, value: string, options: CookieSerializeOptions = {}): this {
  //   const cookieStr = serialize(name, value, options)
  //   this._headers.append('Set-Cookie', cookieStr)
  //   return this
  // }
  //
  // clearCookie(name: string, options: CookieSerializeOptions = {}): this {
  //   return this.cookie(name, '', {
  //     ...options,
  //     maxAge: 0,
  //     expires: new Date(1),
  //   })
  // }

  // --- Finalize ---
  finalize(): Response {
    this.assertWritable()
    this._finalized = true
    return new Response(this._body, {
      status: this._status,
      headers: this._headers,
    })
  }

  isFinalized(): boolean {
    return this._finalized
  }

  private assertWritable(): void {
    if (this._finalized) {
      throw new Error('Response has already been finalized')
    }
  }
}
