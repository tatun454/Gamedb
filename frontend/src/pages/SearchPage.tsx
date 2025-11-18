import React, { useState, useEffect } from "react";
import api from "../services/api";
import GameCard from "../components/GameCard";
import { Game, Tag } from "../types";

const SearchPage: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>();
  const [games, setGames] = useState<Game[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [user] = useState(localStorage.getItem("token") !== null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/admin/tags");
        setTags(response.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const search = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTitle) params.append("title", searchTitle);
      if (selectedTagId) params.append("tagId", selectedTagId.toString());

      const response = await api.get(`/games/search?${params}`);
      setGames(response.data.content || []);
    } catch (error) {
      console.error("Error searching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (gameId: number) => {
    if (!user) return;

    try {
      await api.post(`/user/favorites/game/${gameId}`);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="container section-spacing">
      <h1>Search Games</h1>

      <div className="search-form">
        <div className="form-group">
          <label htmlFor="searchTitle">Game Title</label>
          <input
            type="text"
            id="searchTitle"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Enter game title..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="tagSelect">Filter by Tag</label>
          <select
            id="tagSelect"
            value={selectedTagId || ""}
            onChange={(e) =>
              setSelectedTagId(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" onClick={search} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="game-grid">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onToggleFavorite={user ? toggleFavorite : undefined}
            showFavoriteButton={user}
          />
        ))}
      </div>

      {games.length === 0 && !loading && (
        <p>No games found. Try different search criteria.</p>
      )}
    </div>
  );
};

export default SearchPage;
