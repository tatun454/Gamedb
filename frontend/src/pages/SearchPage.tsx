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
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);

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

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    if (value) {
      const filtered = tags.filter((tag) =>
        tag.name.toLowerCase().includes(value.toLowerCase())
      );
      setTagSuggestions(filtered);
    } else {
      setTagSuggestions([]);
    }
  };

  const selectTag = (tag: Tag) => {
    setSelectedTagId(tag.id);
    setTagInput(tag.name);
    setTagSuggestions([]);
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
          <label htmlFor="tagInput">Filter by Tag</label>
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={handleTagInputChange}
            placeholder="Type to search tags..."
          />
          {tagSuggestions.length > 0 && (
            <div className="tag-suggestions">
              {tagSuggestions.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className="tag-suggestion-btn"
                  onClick={() => selectTag(tag)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
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
