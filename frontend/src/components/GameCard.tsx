import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Game } from "../types";

interface GameCardProps {
  game: Game;
  onToggleFavorite?: (gameId: number) => void;
  showFavoriteButton?: boolean;
  onGameUpdate?: (updatedGame: Game) => void;
  showRemoveButtons?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onToggleFavorite,
  showFavoriteButton = false,
  onGameUpdate,
  showRemoveButtons = false,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

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

  const formatReleaseDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="card game-card"
      onClick={() => navigate(`/game/${game.id}`)}
      style={{ cursor: "pointer" }}
    >
      {game.imageUrl && (
        <img
          src={game.imageUrl}
          alt={game.title}
          className="game-image"
          crossOrigin="anonymous"
        />
      )}
      <div className="card-content">
        <h3 className="game-title">{game.title}</h3>
        <div
          className="game-meta"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {game.releaseDate && (
            <span className="game-release">
              {formatReleaseDate(game.releaseDate)}
            </span>
          )}
          <span className="game-price">
            {game.price ? `$${game.price}` : "Free"}
          </span>
        </div>
        {game.tags && game.tags.length > 0 && (
          <div className="game-tags">
            {game.tags.map((tag) => (
              <span key={tag.id} className="tag-badge">
                {tag.name}
                {showRemoveButtons && (
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

        {game.steamLink && (
          <a
            href={game.steamLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-small steam-link-btn"
          >
            View on Steam
          </a>
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
