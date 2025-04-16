export interface RequestLike {
  raw: Request
  params: Record<string, string>
  query: URLSearchParams
  path: string
  hostname: string
  protocol: 'http' | 'https'
  originalUrl: string
  get(name: string): string | null

  body?: any
  rawBody?: Uint8Array
}

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

