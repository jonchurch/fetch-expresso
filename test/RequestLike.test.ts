import { describe, it, expect } from 'vitest';
import { createRequestLike } from '../src/RequestLike';

describe('RequestLike', () => {
  describe('properties', () => {
    it('should provide access to the original request', () => {
      const originalRequest = new Request('https://example.com');
      const req = createRequestLike(originalRequest);
      expect(req.raw).toBe(originalRequest);
    });

    it('should expose URL and URL parts', () => {
      const req = createRequestLike(new Request('https://example.com/users?sort=asc'));
      expect(req.originalUrl).toBe('https://example.com/users?sort=asc');
      expect(req.path).toBe('/users');
      expect(req.hostname).toBe('example.com');
      expect(req.protocol).toBe('https');
    });

    it('should expose headers', () => {
      const headers = new Headers({ 'content-type': 'application/json' });
      const req = createRequestLike(new Request('https://example.com', { headers }));
      expect(req.get('content-type')).toBe('application/json');
      expect(req.get('Content-Type')).toBe('application/json'); // Case insensitive
    });
  });

  describe('path parameters', () => {
    it('should expose path parameters', () => {
      const req = createRequestLike(new Request('https://example.com/users/123'), { id: '123' });
      expect(req.params.id).toBe('123');
    });

    it('should support multiple path parameters', () => {
      const req = createRequestLike(
        new Request('https://example.com/users/123/posts/456'), 
        { userId: '123', postId: '456' }
      );
      expect(req.params.userId).toBe('123');
      expect(req.params.postId).toBe('456');
    });
  });

  describe('query parameters', () => {
    it('should parse and expose query parameters', () => {
      const req = createRequestLike(new Request('https://example.com/users?sort=asc&limit=10'));
      expect(req.query.get('sort')).toBe('asc');
      expect(req.query.get('limit')).toBe('10');
    });

    it('should handle multiple values for the same parameter', () => {
      const req = createRequestLike(new Request('https://example.com/users?tag=js&tag=node'));
      const tags = req.query.getAll('tag');
      expect(tags).toEqual(['js', 'node']);
    });

    it('should allow checking if parameters exist', () => {
      const req = createRequestLike(new Request('https://example.com/users?filter=active'));
      expect(req.query.has('filter')).toBe(true);
      expect(req.query.has('nonexistent')).toBe(false);
    });
  });

  describe('body parsing', () => {
    it.skip('should support storing parsed JSON body', async () => {
      // Implementation will be needed for body parsing middleware
      // The interface already has body and rawBody properties ready
    });

    it.skip('should support storing parsed form data', async () => {
      // Implementation will be needed for body parsing middleware
    });

    it.skip('should support storing parsed URL-encoded data', async () => {
      // Implementation will be needed for body parsing middleware
    });

    it.skip('should provide access to raw body data', async () => {
      // Tests rawBody property for binary data access
    });
  });

  describe('cookies', () => {
    it.skip('should parse cookies from header', () => {
      // Cookie parsing not yet implemented in the interface
    });

    it.skip('should support multiple cookies', () => {
      // Cookie parsing not yet implemented in the interface
    });
  });

  describe('future convenience methods', () => {
    it.skip('should add content negotiation methods', () => {
      // Accept header parsing (req.accepts('json'))
    });

    it.skip('should provide content-type detection', () => {
      // Content type checking (req.is('json'))
    });

    it.skip('should detect XHR requests', () => {
      // XHR detection
    });
  });

  describe('extensibility', () => {
    it('should support adding properties in middleware', () => {
      // TypeScript interface supports additional properties via 'any' type for body
      const req = createRequestLike(new Request('https://example.com'));
      req.body = { userId: 123 };
      expect(req.body.userId).toBe(123);
    });

    it.skip('should allow attaching complex middleware data', () => {
      // More structured middleware data attachment
    });
  });
});
