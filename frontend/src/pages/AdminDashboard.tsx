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
    steamLink: "",
    carouselImageUrls: [] as string[],
    carouselVideoUrls: [] as string[],
    tags: [] as Tag[],
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
    steamLink: "",
    imageUrls: [] as string[],
    videoUrls: [] as string[],
  });
  const [editTagInput, setEditTagInput] = useState("");
  const [editTagSuggestions, setEditTagSuggestions] = useState<Tag[]>([]);
  const [editGameTags, setEditGameTags] = useState<Tag[]>([]);

  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);

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
        steamLink: "",
        carouselImageUrls: [],
        carouselVideoUrls: [],
        tags: [],
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
      steamLink: game.steamLink || "",
      imageUrls: game.carouselImageUrls || [],
      videoUrls: game.carouselVideoUrls || [],
    });
    setEditGameTags(game.tags || []);
  };

  const updateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;
    try {
      const gameData = {
        ...editGame,
        price: editGame.price ? parseFloat(editGame.price) : null,
        releaseDate: editGame.releaseDate || null,
        tags: editGameTags,
      };
      console.log("Sending update data:", gameData);
      const response = await api.put(
        `/admin/games/${editingGame.id}`,
        gameData
      );
      console.log("Update response:", response.data);
      setEditingGame(null);
      setEditGame({
        title: "",
        description: "",
        releaseDate: "",
        price: "",
        imageUrl: "",
        videoUrl: "",
        steamLink: "",
        imageUrls: [],
        videoUrls: [],
      });
      setEditGameTags([]);
      fetchData();
    } catch (error) {
      console.error("Error updating game:", error);
    }
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
      steamLink: "",
      imageUrls: [],
      videoUrls: [],
    });
    setEditGameTags([]);
    setEditTagInput("");
    setEditTagSuggestions([]);
  };

  const handleTagInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.length > 0) {
      try {
        const response = await api.get(`/admin/tags/search?prefix=${value}`);
        setTagSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching tag suggestions:", error);
      }
    } else {
      setTagSuggestions([]);
    }
  };

  const addTagToNewGame = (tag: Tag) => {
    if (!newGame.tags.some((t) => t.id === tag.id)) {
      setNewGame({ ...newGame, tags: [...newGame.tags, tag] });
    }
    setTagInput("");
    setTagSuggestions([]);
  };

  const removeTagFromNewGame = (tagId: number) => {
    setNewGame({
      ...newGame,
      tags: newGame.tags.filter((tag) => tag.id !== tagId),
    });
  };

  const handleEditTagInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setEditTagInput(value);
    if (value.length > 0) {
      try {
        const response = await api.get(`/admin/tags/search?prefix=${value}`);
        setEditTagSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching tag suggestions:", error);
      }
    } else {
      setEditTagSuggestions([]);
    }
  };

  const addTagToEditGame = (tag: Tag) => {
    if (!editGameTags.some((t) => t.id === tag.id)) {
      setEditGameTags([...editGameTags, tag]);
    }
    setEditTagInput("");
    setEditTagSuggestions([]);
  };

  const removeTagFromEditGame = (tagId: number) => {
    setEditGameTags(editGameTags.filter((tag) => tag.id !== tagId));
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

            <div className="form-group">
              <label>Additional Image URLs</label>
              {newGame.carouselImageUrls.map((url, index) => (
                <div key={index} className="additional-url">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...newGame.carouselImageUrls];
                      newUrls[index] = e.target.value;
                      setNewGame({ ...newGame, carouselImageUrls: newUrls });
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => {
                      const newUrls = newGame.carouselImageUrls.filter(
                        (_, i) => i !== index
                      );
                      setNewGame({ ...newGame, carouselImageUrls: newUrls });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() =>
                  setNewGame({
                    ...newGame,
                    carouselImageUrls: [...newGame.carouselImageUrls, ""],
                  })
                }
              >
                + Add Image URL
              </button>
            </div>

            <div className="form-group">
              <label>Additional Video URLs</label>
              {newGame.carouselVideoUrls.map((url, index) => (
                <div key={index} className="additional-url">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...newGame.carouselVideoUrls];
                      newUrls[index] = e.target.value;
                      setNewGame({ ...newGame, carouselVideoUrls: newUrls });
                    }}
                    placeholder="https://example.com/video.mp4"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => {
                      const newUrls = newGame.carouselVideoUrls.filter(
                        (_, i) => i !== index
                      );
                      setNewGame({ ...newGame, carouselVideoUrls: newUrls });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() =>
                  setNewGame({
                    ...newGame,
                    carouselVideoUrls: [...newGame.carouselVideoUrls, ""],
                  })
                }
              >
                + Add Video URL
              </button>
            </div>

            <div className="form-group">
              <label>Steam Link</label>
              <input
                type="url"
                value={newGame.steamLink}
                onChange={(e) =>
                  setNewGame({ ...newGame, steamLink: e.target.value })
                }
                placeholder="https://store.steampowered.com/app/..."
              />
            </div>
            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
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
                      onClick={() => addTagToNewGame(tag)}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
              {newGame.tags.length > 0 && (
                <div className="selected-tags">
                  {newGame.tags.map((tag) => (
                    <span key={tag.id} className="tag-badge">
                      {tag.name}
                      <button
                        type="button"
                        className="tag-remove-btn"
                        onClick={() => removeTagFromNewGame(tag.id)}
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
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

              <div className="form-group">
                <label>Additional Image URLs</label>
                {editGame.imageUrls.map((url, index) => (
                  <div key={index} className="additional-url">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...editGame.imageUrls];
                        newUrls[index] = e.target.value;
                        setEditGame({
                          ...editGame,
                          imageUrls: newUrls,
                        });
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => {
                        const newUrls = editGame.imageUrls.filter(
                          (_, i) => i !== index
                        );
                        setEditGame({
                          ...editGame,
                          imageUrls: newUrls,
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={() =>
                    setEditGame({
                      ...editGame,
                      imageUrls: [...editGame.imageUrls, ""],
                    })
                  }
                >
                  + Add Image URL
                </button>
              </div>

              <div className="form-group">
                <label>Additional Video URLs</label>
                {editGame.videoUrls.map((url, index) => (
                  <div key={index} className="additional-url">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...editGame.videoUrls];
                        newUrls[index] = e.target.value;
                        setEditGame({
                          ...editGame,
                          videoUrls: newUrls,
                        });
                      }}
                      placeholder="https://example.com/video.mp4"
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => {
                        const newUrls = editGame.videoUrls.filter(
                          (_, i) => i !== index
                        );
                        setEditGame({
                          ...editGame,
                          videoUrls: newUrls,
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={() =>
                    setEditGame({
                      ...editGame,
                      videoUrls: [...editGame.videoUrls, ""],
                    })
                  }
                >
                  + Add Video URL
                </button>
              </div>

              <div className="form-group">
                <label>Steam Link</label>
                <input
                  type="url"
                  value={editGame.steamLink}
                  onChange={(e) =>
                    setEditGame({ ...editGame, steamLink: e.target.value })
                  }
                  placeholder="https://store.steampowered.com/app/..."
                />
              </div>
              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text"
                  value={editTagInput}
                  onChange={handleEditTagInputChange}
                  placeholder="Type to search tags..."
                />
                {editTagSuggestions.length > 0 && (
                  <div className="tag-suggestions">
                    {editTagSuggestions.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        className="tag-suggestion-btn"
                        onClick={() => addTagToEditGame(tag)}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
                {editGameTags.length > 0 && (
                  <div className="selected-tags">
                    {editGameTags.map((tag) => (
                      <span key={tag.id} className="tag-badge">
                        {tag.name}
                        <button
                          type="button"
                          className="tag-remove-btn"
                          onClick={() => removeTagFromEditGame(tag.id)}
                          title="Remove tag"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
        <div className="games-list-compact">
          {games.map((game) => (
            <div key={game.id} className="game-card-compact">
              {game.imageUrl && (
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="game-image-compact"
                />
              )}
              <div className="game-info-compact">
                <h5 className="game-title-compact">{game.title}</h5>
                <p className="game-price-compact">
                  {game.price ? `$${game.price}` : "Free"}
                </p>
                <p className="game-release-compact">
                  {game.releaseDate || "TBD"}
                </p>
                {game.tags && game.tags.length > 0 && (
                  <div className="game-tags-compact">
                    {game.tags.slice(0, 3).map((tag) => (
                      <span key={tag.id} className="tag-badge-compact">
                        {tag.name}
                      </span>
                    ))}
                    {game.tags.length > 3 && (
                      <span className="tag-more">+{game.tags.length - 3}</span>
                    )}
                  </div>
                )}
                <button
                  className="btn btn-secondary btn-small-compact"
                  onClick={() => startEditGame(game)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
