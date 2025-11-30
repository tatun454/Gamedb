import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
  const [isStoryCollapsed, setIsStoryCollapsed] = useState(false);

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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || !game) return;

      try {
        const response = await api.get("/user/favorites/games");
        const favoriteGames = response.data;
        const isFav = favoriteGames.some(
          (favGame: Game) => favGame.id === game.id
        );
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, game]);

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
      const response = await api.post(`/user/favorites/game/${game.id}`);

      const wasAdded = response.data.includes("added");
      setIsFavorite(wasAdded);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isYouTubeUrl = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
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
        <div className="game-detail-header card metallic-bg">
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
              <div className="slide-item">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="game-detail-image"
                  crossOrigin="anonymous"
                />
              </div>
            )}
            {game.additionalImageUrls &&
              game.additionalImageUrls.map((url, index) => (
                <div key={`additional-image-${index}`} className="slide-item">
                  <img
                    src={url}
                    alt={`${game.title} - Additional ${index + 1}`}
                    className="game-detail-image"
                    crossOrigin="anonymous"
                  />
                </div>
              ))}
            {game.videoUrl && (
              <div className="slide-item">
                {videoError ? (
                  <div className="video-error">
                    <p>Video non disponibile: {videoError}</p>
                  </div>
                ) : isYouTubeUrl(game.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(game.videoUrl)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="game-video-detail"
                    onError={() =>
                      setVideoError("Errore nel caricamento del video YouTube")
                    }
                  ></iframe>
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
            {game.additionalVideoUrls &&
              game.additionalVideoUrls.map((url, index) => (
                <div key={`additional-video-${index}`} className="slide-item">
                  {isYouTubeUrl(url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(url)}
                      title={`YouTube video player - Additional ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="game-video-detail"
                    ></iframe>
                  ) : (
                    <video
                      controls
                      preload="metadata"
                      className="game-video-detail"
                      crossOrigin="anonymous"
                    >
                      <source src={url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
          </Slider>
        </div>

        <div
          className="game-detail-description card"
          style={{ marginTop: "2rem" }}
        >
          <div className="card-header">
            <h3>Description</h3>
            <button
              className="collapse-btn"
              onClick={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
              title={isDescriptionCollapsed ? "Expand" : "Collapse"}
            >
              <div
                className={`arrow-container ${
                  isDescriptionCollapsed ? "arrow-down" : "arrow-up"
                }`}
              >
                <i
                  className={`bi ${
                    isDescriptionCollapsed
                      ? "bi-caret-down-fill"
                      : "bi-caret-up-fill"
                  }`}
                ></i>
              </div>
            </button>
          </div>
          {!isDescriptionCollapsed && <p>{game.description}</p>}
        </div>

        {game.story && (
          <div className="game-detail-story card">
            <div className="card-header">
              <h3>Story</h3>
              <button
                className="collapse-btn"
                onClick={() => setIsStoryCollapsed(!isStoryCollapsed)}
                title={isStoryCollapsed ? "Expand" : "Collapse"}
              >
                <div
                  className={`arrow-container ${
                    isStoryCollapsed ? "arrow-down" : "arrow-up"
                  }`}
                >
                  <i
                    className={`bi ${
                      isStoryCollapsed
                        ? "bi-caret-down-fill"
                        : "bi-caret-up-fill"
                    }`}
                  ></i>
                </div>
              </button>
            </div>
            {!isStoryCollapsed && <p>{game.story}</p>}
          </div>
        )}

        {game.tags && game.tags.length > 0 && (
          <div className="game-detail-tags card">
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
              <i className="bi bi-steam"></i>
            </a>
          )}
          {isAuthenticated && (
            <button
              className="btn btn-secondary favorite-btn"
              onClick={toggleFavorite}
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

export default GameDetailPage;
