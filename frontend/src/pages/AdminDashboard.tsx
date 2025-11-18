import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Game, Tag } from "../types";

const AdminDashboard: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newGame, setNewGame] = useState({
    title: "",
    description: "",
    releaseDate: "",
    price: "",
  });
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesResponse, tagsResponse] = await Promise.all([
        api.get("/games"),
        api.get("/admin/tags"),
      ]);
      setGames(gamesResponse.data.content || []);
      setTags(tagsResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const createGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gameData = {
        ...newGame,
        price: newGame.price ? parseFloat(newGame.price) : null,
        releaseDate: newGame.releaseDate || null,
      };
      await api.post("/admin/games", gameData);
      setNewGame({ title: "", description: "", releaseDate: "", price: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const createTag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/tags", { name: newTagName });
      setNewTagName("");
      fetchData();
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  return (
    <div className="container section-spacing">
      <h1>Admin Dashboard</h1>

      <div className="admin-grid">
        <section>
          <h2>Add New Game</h2>
          <form onSubmit={createGame} className="card">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newGame.title}
                onChange={(e) =>
                  setNewGame({ ...newGame, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newGame.description}
                onChange={(e) =>
                  setNewGame({ ...newGame, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Release Date</label>
              <input
                type="date"
                value={newGame.releaseDate}
                onChange={(e) =>
                  setNewGame({ ...newGame, releaseDate: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={newGame.price}
                onChange={(e) =>
                  setNewGame({ ...newGame, price: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Game
            </button>
          </form>
        </section>

        <section>
          <h2>Add New Tag</h2>
          <form onSubmit={createTag} className="card">
            <div className="form-group">
              <label>Tag Name</label>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Tag
            </button>
          </form>

          <div className="card card-spaced">
            <h3>Existing Tags</h3>
            {tags.map((tag) => (
              <span key={tag.id} className="tag-badge">
                {tag.name}
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="section-spacing">
        <h2>Recent Games</h2>
        <div className="games-list">
          {games.slice(0, 5).map((game) => (
            <div key={game.id} className="card">
              <h4>{game.title}</h4>
              <p>{game.description}</p>
              <div>
                {game.tags.map((tag) => (
                  <span key={tag.id} className="tag-badge">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
