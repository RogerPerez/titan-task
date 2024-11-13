import { memo } from "react";
import { Content } from "../types/content";
import FavoriteButton from "./FavoriteButton";

interface ContentCardProps {
  content: Content;
  isFocused: boolean;
  onSelect: () => void;
  onFocus: () => void;
  index: number;
  isPreloaded: boolean;
}

const ContentCard = memo(
  ({
    content,
    isFocused,
    onSelect,
    onFocus,
    index,
    isPreloaded,
  }: ContentCardProps) => {
    const handleClick = () => {
      if (!isFocused) {
        onFocus();
      } else {
        onSelect();
      }
    };

    return (
      <div
        onClick={handleClick}
        className="relative w-48 h-72 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-out will-change-transform"
        style={{
          transform: isFocused ? "scale(1.1)" : "scale(0.9)",
          opacity: isFocused ? 1 : 0.5,
        }}
        role="button"
        tabIndex={isFocused ? 0 : -1}
        data-testid={`content-card-${index}`}
        aria-label={content.title}
      >
        <img
          src={content.images.artwork_portrait}
          alt={content.title}
          className="w-full h-full object-cover"
          loading={isPreloaded ? "eager" : "lazy"}
          decoding="async"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
        />
        {isFocused && (
          <FavoriteButton
            content={content}
            className="absolute top-4 right-4 z-20"
          />
        )}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transform transition-all duration-300 ${
            isFocused ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h3 className="text-white font-bold text-lg leading-tight truncate">
            {content.title}
          </h3>
          <p className="text-white/70 text-sm">{content.year}</p>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isFocused === nextProps.isFocused &&
      prevProps.content.id === nextProps.content.id &&
      prevProps.isPreloaded === nextProps.isPreloaded
    );
  }
);

ContentCard.displayName = "ContentCard";

export default ContentCard;
