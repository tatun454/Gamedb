package com.gamedb.controller;

import com.gamedb.Entity.Game;
import com.gamedb.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/favorites")
public class FavoriteController {
    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/game/{gameId}")
    public ResponseEntity<String> toggleFavoriteGame(@PathVariable Long gameId, Authentication auth) {
        boolean added = favoriteService.toggleFavoriteGame(auth.getName(), gameId);
        return ResponseEntity.ok(added ? "Game added to favorites" : "Game removed from favorites");
    }

    @PostMapping("/tag/{tagId}")
    public ResponseEntity<String> toggleFavoriteTag(@PathVariable Long tagId, Authentication auth) {
        boolean added = favoriteService.toggleFavoriteTag(auth.getName(), tagId);
        return ResponseEntity.ok(added ? "Tag added to favorites" : "Tag removed from favorites");
    }

    @GetMapping("/games")
    public List<Game> getFavoriteGames(Authentication auth) {
        return favoriteService.getFavoriteGames(auth.getName());
    }

    @GetMapping("/recommendations")
    public List<Game> getRecommendedGames(Authentication auth) {
        return favoriteService.getRecommendedGames(auth.getName());
    }
}