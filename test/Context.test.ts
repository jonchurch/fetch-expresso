import { describe, it, expect } from 'vitest';
import { createContext } from '../src/Context';

describe('Context', () => {
  it('should create a context with properly initialized req and res', () => {
    const request = new Request('https://example.com/path?q=test');
    const params = { id: '123' };
    
    const context = createContext(request, params);
    
    // Verify basic structure
    expect(context).toHaveProperty('req');
    expect(context).toHaveProperty('res');
    
    // Verify req initialization
    expect(context.req.raw).toBe(request);
    expect(context.req.params).toEqual(params);
    
    // Verify res initialization
    expect(context.res.getStatus()).toBe(200); // Default status
  });
});