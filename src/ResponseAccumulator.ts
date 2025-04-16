import { BodyInit } from './types';

export class ResAccumulator {
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

