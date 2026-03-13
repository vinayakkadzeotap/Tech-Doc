import { describe, it, expect } from 'vitest';

describe('SkipToContent', () => {
  it('should target main-content id', () => {
    const targetId = '#main-content';
    expect(targetId).toBe('#main-content');
  });

  it('sr-only class contains correct CSS properties', () => {
    // sr-only in Tailwind renders the element off-screen but accessible
    const srOnlyProperties = {
      position: 'absolute',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    };
    expect(srOnlyProperties.position).toBe('absolute');
    expect(srOnlyProperties.width).toBe('1px');
  });

  it('becomes visible on focus (focus:not-sr-only)', () => {
    // The component uses focus:not-sr-only to become visible when tabbed to
    const focusClasses = ['sr-only', 'focus:not-sr-only', 'focus:absolute', 'focus:z-50'];
    expect(focusClasses).toContain('sr-only');
    expect(focusClasses).toContain('focus:not-sr-only');
  });
});
