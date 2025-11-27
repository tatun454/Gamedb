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
    imageUrl: "",
    videoUrl: "",
  });
  const [newTagName, setNewTagName] = useState("");
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editGame, setEditGame] = useState({
    title: "",
    description: "",
    releaseDate: "",
    price: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [selectedTagId, setSelectedTagId] = useState<number | "">("");

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
    } catch (error) {}
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
      setNewGame({
        title: "",
        description: "",
        releaseDate: "",
        price: "",
        imageUrl: "",
        videoUrl: "",
      });
      fetchData();
    } catch (error) {}
  };

  const createTag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/tags", { name: newTagName });
      setNewTagName("");
      fetchData();
    } catch (error) {}
  };

  const deleteTag = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        await api.delete(`/admin/tags/${id}`);
        fetchData();
      } catch (error) {}
    }
  };

  const startEditGame = (game: Game) => {
    setEditingGame(game);
    setEditGame({
      title: game.title,
      description: game.description || "",
      releaseDate: game.releaseDate || "",
      price: game.price?.toString() || "",
      imageUrl: game.imageUrl || "",
      videoUrl: game.videoUrl || "",
    });
  };

  const updateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;
    try {
      const gameData = {
        ...editGame,
        price: editGame.price ? parseFloat(editGame.price) : null,
        releaseDate: editGame.releaseDate || null,
      };
      await api.put(`/admin/games/${editingGame.id}`, gameData);
      setEditingGame(null);
      setEditGame({
        title: "",
        description: "",
        releaseDate: "",
        price: "",
        imageUrl: "",
        videoUrl: "",
      });
      fetchData();
    } catch (error) {}
  };

  const cancelEdit = () => {
    setEditingGame(null);
    setEditGame({
      title: "",
      description: "",
      releaseDate: "",
      price: "",
      imageUrl: "",
      videoUrl: "",
    });
  };

  const addTagToGame = async (gameId: number) => {
    if (!selectedTagId) return;
    try {
      await api.post(`/admin/games/${gameId}/tags/${selectedTagId}`);
      setSelectedTagId("");
      fetchData();
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const removeTagFromGame = async (gameId: number, tagId: number) => {
    try {
      await api.delete(`/admin/games/${gameId}/tags/${tagId}`);
      fetchData();
    } catch (error) {
      console.error("Error removing tag:", error);
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
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={newGame.imageUrl}
                onChange={(e) =>
                  setNewGame({ ...newGame, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-group">
              <label>Video URL</label>
              <input
                type="url"
                value={newGame.videoUrl}
                onChange={(e) =>
                  setNewGame({ ...newGame, videoUrl: e.target.value })
                }
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Game
            </button>
          </form>
        </section>

        {editingGame && (
          <section>
            <h2>Edit Game: {editingGame.title}</h2>
            <form onSubmit={updateGame} className="card">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editGame.title}
                  onChange={(e) =>
                    setEditGame({ ...editGame, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editGame.description}
                  onChange={(e) =>
                    setEditGame({ ...editGame, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Release Date</label>
                <input
                  type="date"
                  value={editGame.releaseDate}
                  onChange={(e) =>
                    setEditGame({ ...editGame, releaseDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editGame.price}
                  onChange={(e) =>
                    setEditGame({ ...editGame, price: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={editGame.imageUrl}
                  onChange={(e) =>
                    setEditGame({ ...editGame, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label>Video URL</label>
                <input
                  type="url"
                  value={editGame.videoUrl}
                  onChange={(e) =>
                    setEditGame({ ...editGame, videoUrl: e.target.value })
                  }
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Update Game
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

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
            <div className="tags-scrollable">
              {tags.map((tag) => (
                <div key={tag.id} className="tag-item">
                  <span className="tag-badge">{tag.name}</span>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => deleteTag(tag.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="section-spacing">
        <h2>All Games</h2>
        <div className="games-list">
          {games.map((game) => (
            <div key={game.id} className="card">
              {game.imageUrl && (
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  style={{
                    maxWidth: "200px",
                    maxHeight: "150px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              )}
              <h4>{game.title}</h4>
              <p>
                <strong>Price:</strong> {game.price ? `$${game.price}` : "Free"}
              </p>
              <p>
                <strong>Release Date:</strong> {game.releaseDate || "TBD"}
              </p>
              {game.tags && game.tags.length > 0 && (
                <div className="game-tags">
                  {game.tags.map((tag) => (
                    <span key={tag.id} className="tag-badge">
                      {tag.name}
                      <button
                        className="tag-remove-btn"
                        onClick={() => removeTagFromGame(game.id, tag.id)}
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="add-tag-section">
                <select
                  value={selectedTagId}
                  onChange={(e) =>
                    setSelectedTagId(
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  className="tag-select"
                >
                  <option value="">Add tag...</option>
                  {tags
                    .filter(
                      (tag) =>
                        !game.tags.some((gameTag) => gameTag.id === tag.id)
                    )
                    .map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                </select>
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => addTagToGame(game.id)}
                  disabled={!selectedTagId}
                >
                  Add
                </button>
              </div>
              <button
                className="btn btn-secondary btn-small"
                onClick={() => startEditGame(game)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
