package com.gamedb.controller;

import com.gamedb.Entity.Game;
import com.gamedb.Entity.Tag;

import com.gamedb.service.GameService;
import com.gamedb.service.TagService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;
    private final TagService tagService;

    public GameController(GameService gameService, TagService tagService) {
        this.gameService = gameService;
        this.tagService = tagService;
    }
    @GetMapping
    public Page<Game> getAllGames(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "30") int size) {
        return gameService.listAll(PageRequest.of(page, size));
    }

    @GetMapping("/search")
    public Page<Game> searchGames(@RequestParam(required = false) String title,
                                  @RequestParam(required = false) Long tagId,
                                  @RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size) {
        return gameService.search(title, tagId, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        return gameService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tags")
    @PreAuthorize("isAuthenticated()")
    public List<Tag> getAllTags() {
        return tagService.findAll();
    }

    @GetMapping("/tags/search")
    public List<Tag> searchTags(@RequestParam String prefix) {
        return tagService.findByNameStartingWith(prefix);
    }

    @PostMapping("/{gameId}/tags/{tagId}")
    @PreAuthorize("isAuthenticated()")
    public Game addTagToGame(@PathVariable Long gameId, @PathVariable Long tagId) {
        return gameService.addTag(gameId, tagId);
    }

    @DeleteMapping("/{gameId}/tags/{tagId}")
    @PreAuthorize("isAuthenticated()")
    public Game removeTagFromGame(@PathVariable Long gameId, @PathVariable Long tagId) {
        return gameService.removeTag(gameId, tagId);
    }


}
