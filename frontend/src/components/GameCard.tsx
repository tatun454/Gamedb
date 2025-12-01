import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
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
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await api.get("/user/favorites/games");
        const favoriteGames = response.data;
        const isFav = favoriteGames.some(
          (favGame: Game) => favGame.id === game.id
        );
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [isAuthenticated, game.id]);

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

  const toggleFavorite = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.post(`/user/favorites/game/${game.id}`);
      const wasAdded = response.data.includes("added");
      setIsFavorite(wasAdded);

      if (onToggleFavorite) {
        onToggleFavorite(game.id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="card game-card">
      {game.imageUrl && (
        <img
          src={game.imageUrl}
          alt={game.title}
          className="game-image"
          crossOrigin="anonymous"
          onClick={() => navigate(`/game/${game.id}`)}
        />
      )}
      <div className="card-content">
        <h3 className="game-title" onClick={() => navigate(`/game/${game.id}`)}>
          {game.title}
        </h3>
        <div className="game-meta">
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

        <div className="d-flex">
          {game.steamLink && (
            <a
              href={game.steamLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-small steam-link-btn"
            >
              <i className="bi bi-steam"></i>
            </a>
          )}
          {showFavoriteButton && (
            <button
              className="btn btn-secondary btn-small favorite-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite();
              }}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? (
                <SuitHeartFill size={20} />
              ) : (
                <SuitHeart size={20} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
