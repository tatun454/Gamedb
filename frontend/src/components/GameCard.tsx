import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Game, Tag } from "../types";

interface GameCardProps {
  game: Game;
  onToggleFavorite?: (gameId: number) => void;
  showFavoriteButton?: boolean;
  onGameUpdate?: (updatedGame: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onToggleFavorite,
  showFavoriteButton = false,
  onGameUpdate,
}) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | "">("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      fetchAvailableTags();
    }
  }, []);

  const fetchAvailableTags = async () => {
    try {
      const response = await api.get("/games/tags");
      setAvailableTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const addTag = async () => {
    if (!selectedTagId || !isAuthenticated) return;
    try {
      const response = await api.post(
        `/games/${game.id}/tags/${selectedTagId}`
      );
      if (onGameUpdate) {
        onGameUpdate(response.data);
      }
      setSelectedTagId("");
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const removeTag = async (tagId: number) => {
    if (!isAuthenticated) return;
    try {
      const response = await api.delete(`/games/${game.id}/tags/${tagId}`);
      if (onGameUpdate) {
        onGameUpdate(response.data);
      }
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  const releaseYear = game.releaseDate
    ? new Date(game.releaseDate).getFullYear()
    : null;

  return (
    <div className="card game-card">
      {game.imageUrl && (
        <img
          src={game.imageUrl}
          alt={game.title}
          className="game-image"
          crossOrigin="anonymous"
        />
      )}
      {game.videoUrl && (
        <video controls className="game-video" crossOrigin="anonymous">
          <source src={game.videoUrl} />
        </video>
      )}
      <div className="card-content">
        <h3 className="game-title">{game.title}</h3>
        <div className="game-meta">
          {releaseYear && <span className="game-release">{releaseYear}</span>}
          <span className="game-price">
            {game.price ? `$${game.price}` : "Free"}
          </span>
        </div>
        {game.tags && game.tags.length > 0 && (
          <div className="game-tags">
            {game.tags.map((tag) => (
              <span key={tag.id} className="tag-badge">
                {tag.name}
                {isAuthenticated && (
                  <button
                    className="tag-remove-btn"
                    onClick={() => removeTag(tag.id)}
                    title="Remove tag"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
        {isAuthenticated && (
          <div className="add-tag-section">
            <select
              value={selectedTagId}
              onChange={(e) =>
                setSelectedTagId(e.target.value ? parseInt(e.target.value) : "")
              }
              className="tag-select"
            >
              <option value="">Add tag...</option>
              {availableTags
                .filter(
                  (tag) => !game.tags.some((gameTag) => gameTag.id === tag.id)
                )
                .map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
            </select>
            <button
              className="btn btn-primary btn-small"
              onClick={addTag}
              disabled={!selectedTagId}
            >
              Add
            </button>
          </div>
        )}
        {showFavoriteButton && onToggleFavorite && (
          <button
            className="btn btn-secondary btn-small favorite-btn"
            onClick={() => onToggleFavorite(game.id)}
          >
            ❤️ Favorite
          </button>
        )}
      </div>
    </div>
  );
};

export default GameCard;
