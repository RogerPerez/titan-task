import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useContentPreload } from '../../hooks/useContentPreload';

const mockContent = (id: number) => ({
  id,
  title: `Movie ${id}`,
  original_title: `Movie ${id}`,
  synopsis: 'Test synopsis',
  year: 2024,
  images: { artwork_portrait: `test-image-${id}` }
});

describe('useContentPreload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.Image = class {
      src: string = '';
      constructor() { return this; }
    } as any;
    global.requestIdleCallback = (cb: IdleRequestCallback) => setTimeout(cb, 0) as any;
  });


  it('calls onLoadMore when approaching end of content', async () => {
    const contents = Array.from({ length: 10 }, (_, i) => mockContent(i));
    const onLoadMore = vi.fn();

    renderHook(() => 
      useContentPreload(contents, 8, onLoadMore, true)
    );

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(onLoadMore).toHaveBeenCalled();
  });

  it('does not call onLoadMore when hasMoreContent is false', async () => {
    const contents = Array.from({ length: 10 }, (_, i) => mockContent(i));
    const onLoadMore = vi.fn();

    renderHook(() => 
      useContentPreload(contents, 8, onLoadMore, false)
    );

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(onLoadMore).not.toHaveBeenCalled();
  });


  it('resets loading state when content length changes', async () => {
    const contents = Array.from({ length: 5 }, (_, i) => mockContent(i));
    const onLoadMore = vi.fn();
    
    const { rerender } = renderHook(
      ({ contents }) => useContentPreload(contents, 3, onLoadMore, true),
      { initialProps: { contents } }
    );

    await new Promise(resolve => setTimeout(resolve, 100));
    
    rerender({ contents: [...contents, mockContent(5)] });
    
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});