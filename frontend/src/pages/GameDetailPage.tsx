import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../services/api";
import { Game } from "../types";

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/games/${id}`);
        setGame(response.data);
      } catch (err) {
        setError("Game not found");
        console.error("Error fetching game:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

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
    if (!game || !isAuthenticated) return;

    try {
      await api.post(`/user/favorites/game/${game.id}`);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0px",
  };

  if (loading) {
    return <div className="container">Loading game details...</div>;
  }

  if (error || !game) {
    return (
      <div className="container">
        <p>{error || "Game not found"}</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container section-spacing">
      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="game-detail">
        <div className="game-detail-header">
          <h1>{game.title}</h1>
          <div className="game-detail-meta">
            {game.releaseDate && (
              <div className="game-release">
                Released: {formatReleaseDate(game.releaseDate)}
              </div>
            )}
          </div>
          <div className="game-price">
            Price: {game.price ? `$${game.price}` : "Free"}
          </div>
        </div>

        <div className="game-detail-carousel">
          <Slider {...carouselSettings}>
            {game.imageUrl && (
              <div>
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="game-detail-image"
                  crossOrigin="anonymous"
                />
              </div>
            )}
            {game.videoUrl && (
              <div>
                {videoError ? (
                  <div className="video-error">
                    <p>Video non disponibile: {videoError}</p>
                  </div>
                ) : (
                  <video
                    controls
                    preload="metadata"
                    className="game-video-detail"
                    crossOrigin="anonymous"
                    onError={() =>
                      setVideoError("Errore nel caricamento del video")
                    }
                  >
                    <source src={game.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </Slider>
        </div>

        <div className="game-detail-description">
          <h3>Description</h3>
          <p>{game.description}</p>
        </div>

        {game.tags && game.tags.length > 0 && (
          <div className="game-detail-tags">
            <h3>Tags</h3>
            <div className="game-tags">
              {game.tags.map((tag) => (
                <span key={tag.id} className="tag-badge">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="game-detail-actions">
          {game.steamLink && (
            <a
              href={game.steamLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View on Steam
            </a>
          )}
          {isAuthenticated && (
            <button className="btn btn-secondary" onClick={toggleFavorite}>
              ❤️ Add to Favorites
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
