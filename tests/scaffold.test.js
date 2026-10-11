import { describe, it, expect } from 'vitest';
import viteConfig from '../vite.config.js';

describe('Vite Build Configuration', () => {
  it('should have base path set to /preposition-world/ for GitHub Pages', () => {
    expect(viteConfig).toBeDefined();
    expect(viteConfig.base).toBe('/preposition-world/');
  });
});
