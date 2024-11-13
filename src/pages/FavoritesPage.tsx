import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import ContentPopup from "../components/ContentPopup";
import FavoriteButton from "../components/FavoriteButton";
import { Content } from "../types/content";

const FavoritesPage = () => {
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white pt-24">
        <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
        <p className="text-gray-400">No favorites added yet</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-8 pb-8">
      <h2 className="text-2xl font-bold text-white mb-8">My Favorites</h2>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 auto-rows-max"
        role="grid"
      >
        {favorites.map((content) => (
          <div
            key={content.id}
            className="group relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105"
            role="gridcell"
          >
            <img
              src={content.images.artwork_portrait}
              alt={content.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => setSelectedContent(content)}
            >
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
                  {content.title}
                </h3>
                <p className="text-white/70 text-sm mt-1">{content.year}</p>
              </div>
            </div>
            <FavoriteButton
              content={content}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        ))}
      </div>

      {selectedContent && (
        <ContentPopup
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
