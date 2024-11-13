import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { Content } from "../types/content";
import ContentCard from "./ContentCard";
import { setFocusedIndex } from "../store/contentSlice";

interface VisibleContentProps {
  contents: Content[];
  focusedIndex: number;
  onSelect: (index: number) => void;
  leftPadding: number;
  bufferSize: number;
}

const ITEM_WIDTH = 192;
const ITEM_GAP = 16;
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_GAP;
const PRELOAD_OFFSET = 10;
const RENDER_CHUNK_SIZE = 5;

const VisibleContent: React.FC<VisibleContentProps> = ({
  contents,
  focusedIndex,
  onSelect,
  leftPadding,
  bufferSize,
}) => {
  const dispatch = useDispatch();
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: bufferSize,
  });
  const preloadImageRefs = useRef<Set<number>>(new Set());
  const lastFocusedIndex = useRef(focusedIndex);
  const renderTimeoutRef = useRef<number>();
  const isAnimating = useRef(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const updateVisibleRange = useCallback(
    (newFocusedIndex: number) => {
      const start = Math.max(0, newFocusedIndex - bufferSize);
      const end = Math.min(contents.length, newFocusedIndex + bufferSize);

      if (Math.abs(newFocusedIndex - lastFocusedIndex.current) <= 1) {
        setVisibleRange({ start, end });
      } else {
        if (renderTimeoutRef.current) {
          cancelAnimationFrame(renderTimeoutRef.current);
        }

        renderTimeoutRef.current = requestAnimationFrame(() => {
          setVisibleRange({ start, end });
        });
      }

      lastFocusedIndex.current = newFocusedIndex;
    },
    [bufferSize, contents.length]
  );

  useEffect(() => {
    updateVisibleRange(focusedIndex);
    return () => {
      if (renderTimeoutRef.current) {
        cancelAnimationFrame(renderTimeoutRef.current);
      }
    };
  }, [focusedIndex, updateVisibleRange]);

  const preloadImages = useCallback(
    (start: number, end: number) => {
      let currentIndex = start;

      const preloadChunk = () => {
        const chunkEnd = Math.min(currentIndex + RENDER_CHUNK_SIZE, end);

        for (let i = currentIndex; i < chunkEnd; i++) {
          if (!preloadImageRefs.current.has(i) && contents[i]) {
            const img = new Image();
            img.src = contents[i].images.artwork_portrait;
            img.onerror = () =>
              console.error(
                `Image failed to load: ${contents[i].images.artwork_portrait}`
              );
            preloadImageRefs.current.add(i);
          }
        }

        currentIndex = chunkEnd;

        if (currentIndex < end) {
          if (typeof requestIdleCallback === "function") {
            requestIdleCallback(() => preloadChunk());
          } else {
            setTimeout(() => preloadChunk(), 0);
          }
        }
      };

      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(() => preloadChunk());
      } else {
        setTimeout(() => preloadChunk(), 0);
      }
    },
    [contents]
  );

  useEffect(() => {
    const preloadStart = visibleRange.end;
    const preloadEnd = Math.min(contents.length, preloadStart + PRELOAD_OFFSET);
    preloadImages(preloadStart, preloadEnd);
  }, [visibleRange.end, contents.length, preloadImages]);

  const handleTransitionEvent = useCallback((e: TransitionEvent) => {
    if (e.propertyName === "transform") {
      isAnimating.current = e.type === "transitionrun";
    }
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.addEventListener(
        "transitionrun",
        handleTransitionEvent
      );
      sliderRef.current.addEventListener(
        "transitionend",
        handleTransitionEvent
      );

      return () => {
        if (sliderRef.current) {
          sliderRef.current.removeEventListener(
            "transitionrun",
            handleTransitionEvent
          );
          sliderRef.current.removeEventListener(
            "transitionend",
            handleTransitionEvent
          );
        }
      };
    }
  }, [handleTransitionEvent]);

  const translateX = useMemo(() => {
    return -focusedIndex * ITEM_TOTAL_WIDTH + leftPadding;
  }, [focusedIndex, leftPadding]);

  const visibleItems = useMemo(() => {
    const items: JSX.Element[] = [];

    for (
      let i = visibleRange.start;
      i < visibleRange.end && i < contents.length;
      i++
    ) {
      const content = contents[i];
      const position = i * ITEM_TOTAL_WIDTH;

      items.push(
        <div
          key={`${content.id}-${content.title}`}
          className="absolute flex-shrink-0"
          style={{
            transform: `translate3d(${position}px, 0, 0)`,
            width: ITEM_WIDTH,
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <ContentCard
            content={content}
            index={i}
            isFocused={i === focusedIndex}
            onSelect={() => onSelect(i)}
            onFocus={() => dispatch(setFocusedIndex(i))}
            isPreloaded
          />
        </div>
      );
    }

    return items;
  }, [visibleRange, contents, focusedIndex, onSelect, dispatch]);

  return (
    <div
      ref={sliderRef}
      className="content-slider relative w-full h-72 transition-transform duration-300 ease-out will-change-transform"
      style={{
        transform: `translate3d(${translateX}px, 0, 0)`,
        backfaceVisibility: "hidden",
      }}
    >
      {visibleItems}
    </div>
  );
};

export default React.memo(VisibleContent);
