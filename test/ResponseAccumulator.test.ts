import { describe, it, expect } from 'vitest';
import { ResAccumulator } from '../src/ResponseAccumulator';

describe('ResAccumulator', () => {
  describe('as a builder', () => {
    it('supports chainable API', () => {
      const res = new ResAccumulator();
      const result = res
        .status(201)
        .set('X-Custom', 'value')
        .type('application/json');
      
      expect(result).toBe(res);
    });
    
    it('maintains state between method calls', () => {
      const res = new ResAccumulator();
      res.status(201);
      res.set('X-Custom', 'value');
      
      expect(res.getStatus()).toBe(201);
      expect(res.getHeader('X-Custom')).toBe('value');
    });
  });
  
  describe('finalization', () => {
    it('produces a valid Response object', async () => {
      const res = new ResAccumulator();
      res.status(201)
        .set('X-Custom', 'value')
        .type('application/json');
      
      const data = { success: true };
      const response = res.json(data);
      
      // Verify the Response object has the expected properties
      expect(response instanceof Response).toBe(true);
      expect(response.status).toBe(201);
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(response.headers.get('Content-Type')).toBe('application/json');
      
      // Verify body content
      const responseData = await response.json();
      expect(responseData).toEqual(data);
    });
    
    it('supports multiple finalization methods', () => {
      // Test send()
      let res = new ResAccumulator();
      let response = res.send('Hello world');
      expect(response instanceof Response).toBe(true);
      
      // Test json()
      res = new ResAccumulator();
      response = res.json({ message: 'Hello' });
      expect(response instanceof Response).toBe(true);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      
      // Test stream()
      res = new ResAccumulator();
      const stream = new ReadableStream();
      response = res.stream(stream);
      expect(response instanceof Response).toBe(true);
      expect(response.body).toBe(stream);
      
      // Test redirect()
      res = new ResAccumulator();
      response = res.redirect('/new-location', 301);
      expect(response instanceof Response).toBe(true);
      expect(response.status).toBe(301);
      expect(response.headers.get('Location')).toBe('/new-location');
    });
    
    it('prevents modification after finalization', () => {
      const res = new ResAccumulator();
      res.send('Test');
      expect(res.isFinalized()).toBe(true);
      
      // All modification methods should throw after finalization
      expect(() => res.status(404)).toThrow();
      expect(() => res.set('X-Test', 'value')).toThrow();
      expect(() => res.type('text/plain')).toThrow();
      expect(() => res.headers({ 'X-Test': 'value' })).toThrow();
    });
  });
  
  describe('convenience methods', () => {
    it('provides type() shorthand for Content-Type', () => {
      const res = new ResAccumulator();
      res.type('application/xml');
      expect(res.getHeader('Content-Type')).toBe('application/xml');
    });
    
    it('provides status code helpers', () => {
      const res = new ResAccumulator();
      expect(res.getStatus()).toBe(200); // Default
      
      res.status(404);
      expect(res.getStatus()).toBe(404);
    });
    
    it('includes appropriate headers in the Response', () => {
      const res = new ResAccumulator();
      res.set('X-Custom', 'value');
      res.set('X-Another', 'another-value');
      
      const response = res.send('Test');
      expect(response.headers.get('X-Custom')).toBe('value');
      expect(response.headers.get('X-Another')).toBe('another-value');
    });
  });
});
