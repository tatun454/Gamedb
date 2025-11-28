import React, { useState, useEffect } from "react";
import api from "../services/api";
import GameCard from "../components/GameCard";
import { Game } from "../types";

const HomePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState(localStorage.getItem("token") !== null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get("/games");
        setGames(response.data.content || []);

        if (user) {
          try {
            const recommendedResponse = await api.get(
              "/user/favorites/recommendations"
            );
            setRecommendedGames(recommendedResponse.data || []);
          } catch (error) {
            console.log("Could not fetch recommendations");
          }
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    const handleFocus = () => {
      fetchGames();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  const toggleFavorite = async () => {};

  const updateGame = (updatedGame: Game) => {
    setGames((prevGames) =>
      prevGames.map((game) => (game.id === updatedGame.id ? updatedGame : game))
    );
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      {user && recommendedGames.length > 0 && (
        <section className="section-spacing">
          <h2>Recommended For You</h2>
          <div className="game-grid">
            {recommendedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onToggleFavorite={toggleFavorite}
                showFavoriteButton={true}
              />
            ))}
          </div>
        </section>
      )}

      <section className="section-spacing">
        <h2>All Games</h2>
        <div className="game-grid">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onToggleFavorite={user ? toggleFavorite : undefined}
              showFavoriteButton={user}
              onGameUpdate={updateGame}
              showRemoveButtons={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
