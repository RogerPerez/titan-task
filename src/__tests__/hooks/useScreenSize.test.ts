import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScreenSize } from '../../hooks/useScreenSize';

describe('useScreenSize', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });

  it('returns correct values for different screen sizes', () => {
    const testSizes = [
      { width: 2560, expectedVisible: 24, expectedPreload: 12 },
      { width: 1920, expectedVisible: 18, expectedPreload: 10 },
      { width: 1440, expectedVisible: 14, expectedPreload: 8 },
      { width: 1024, expectedVisible: 10, expectedPreload: 6 },
      { width: 768, expectedVisible: 8, expectedPreload: 4 },
      { width: 375, expectedVisible: 6, expectedPreload: 4 }
    ];

    testSizes.forEach(({ width, expectedVisible, expectedPreload }) => {
      window.innerWidth = width;
      const { result } = renderHook(() => useScreenSize());

      expect(result.current.visibleItems).toBe(expectedVisible);
      expect(result.current.preloadItems).toBe(expectedPreload);
    });
  });

  it('updates on window resize', () => {
    const { result } = renderHook(() => useScreenSize());
    
    act(() => {
      window.innerWidth = 1920;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.screenWidth).toBe(1920);
    expect(result.current.visibleItems).toBe(18);
    expect(result.current.preloadItems).toBe(10);
  });
});