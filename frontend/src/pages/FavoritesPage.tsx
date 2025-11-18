import React, { useState, useEffect } from "react";
import api from "../services/api";
import GameCard from "../components/GameCard";
import { Game } from "../types";

const FavoritesPage: React.FC = () => {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteGames = async () => {
      try {
        const response = await api.get("/user/favorites/games");
        setFavoriteGames(response.data || []);
      } catch (error) {
        console.error("Error fetching favorite games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteGames();
  }, []);

  const toggleFavorite = async (gameId: number) => {
    try {
      await api.post(`/user/favorites/game/${gameId}`);

      setFavoriteGames((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container section-spacing">
      <h1>My Favorite Games</h1>

      {favoriteGames.length === 0 ? (
        <p>You haven't added any games to your favorites yet.</p>
      ) : (
        <div className="game-grid">
          {favoriteGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onToggleFavorite={toggleFavorite}
              showFavoriteButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
