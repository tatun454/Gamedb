import React from "react";
import { Game } from "../types";

interface GameCardProps {
  game: Game;
  onToggleFavorite?: (gameId: number) => void;
  showFavoriteButton?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onToggleFavorite,
  showFavoriteButton = false,
}) => {
  return (
    <div className="card">
      <h3>{game.title}</h3>
      <p>{game.description}</p>
      {game.releaseDate && (
        <p>
          <small>
            Released: {new Date(game.releaseDate).toLocaleDateString()}
          </small>
        </p>
      )}
      {game.price && (
        <p>
          <strong>Price: ${game.price}</strong>
        </p>
      )}
      <div className="game-tags">
        {game.tags.map((tag) => (
          <span key={tag.id} className="tag-badge">
            {tag.name}
          </span>
        ))}
      </div>
      {showFavoriteButton && onToggleFavorite && (
        <button
          className="btn btn-primary btn-favorite"
          onClick={() => onToggleFavorite(game.id)}
        >
          Toggle Favorite
        </button>
      )}
    </div>
  );
};

export default GameCard;
