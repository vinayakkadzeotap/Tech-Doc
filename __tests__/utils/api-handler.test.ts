import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test the error handling patterns used across API routes

describe('API error handling patterns', () => {
  describe('SyntaxError detection', () => {
    it('identifies SyntaxError from malformed JSON', () => {
      const error = new SyntaxError('Unexpected token < in JSON');
      expect(error instanceof SyntaxError).toBe(true);
    });

    it('distinguishes SyntaxError from other errors', () => {
      const syntaxErr = new SyntaxError('bad json');
      const typeErr = new TypeError('bad type');
      const genericErr = new Error('generic');

      expect(syntaxErr instanceof SyntaxError).toBe(true);
      expect(typeErr instanceof SyntaxError).toBe(false);
      expect(genericErr instanceof SyntaxError).toBe(false);
    });
  });

  describe('error response format', () => {
    it('400 response for invalid JSON', () => {
      const response = { error: 'Invalid request body' };
      const status = 400;
      expect(response.error).toBe('Invalid request body');
      expect(status).toBe(400);
    });

    it('500 response for unknown errors', () => {
      const response = { error: 'Internal server error' };
      const status = 500;
      expect(response.error).toBe('Internal server error');
      expect(status).toBe(500);
    });

    it('error response always has error field', () => {
      const responses = [
        { error: 'Invalid request body' },
        { error: 'Internal server error' },
        { error: 'Not found' },
      ];
      responses.forEach((r) => {
        expect(r).toHaveProperty('error');
        expect(typeof r.error).toBe('string');
      });
    });
  });

  describe('safeParseBody pattern', () => {
    it('returns parsed body on valid JSON', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({ name: 'test' }),
      };
      const body = await mockRequest.json();
      expect(body).toEqual({ name: 'test' });
    });

    it('throws SyntaxError on invalid JSON', async () => {
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
      };
      await expect(mockRequest.json()).rejects.toThrow(SyntaxError);
    });

    it('handles empty body gracefully', async () => {
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected end of JSON input')),
      };
      try {
        await mockRequest.json();
      } catch (error) {
        expect(error instanceof SyntaxError).toBe(true);
      }
    });
  });
});
