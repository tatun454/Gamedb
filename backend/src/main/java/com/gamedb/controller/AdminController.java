package com.gamedb.controller;

import com.gamedb.Entity.Game;
import com.gamedb.Entity.Tag;
import com.gamedb.service.GameService;
import com.gamedb.service.TagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final GameService gameService;
    private final TagService tagService;

    public AdminController(GameService gameService, TagService tagService) {
        this.gameService = gameService;
        this.tagService = tagService;
    }

    @PostMapping("/games")
    public Game createGame(@RequestBody Game game) {
        return gameService.save(game);
    }

    @PutMapping("/games/{id}")
    public ResponseEntity<Game> updateGame(@PathVariable Long id, @RequestBody Game game) {
        return gameService.findById(id)
                .map(existingGame -> {
                    game.setId(id);
                    return ResponseEntity.ok(gameService.save(game));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tags")
    public Tag createTag(@RequestBody Tag tag) {
        return tagService.save(tag);
    }

    @GetMapping("/tags")
    public List<Tag> getAllTags() {
        return tagService.findAll();
    }

    @DeleteMapping("/tags/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/games/{gameId}/tags/{tagId}")
    public Game addTagToGame(@PathVariable Long gameId, @PathVariable Long tagId) {
        return gameService.addTag(gameId, tagId);
    }

    @DeleteMapping("/games/{gameId}/tags/{tagId}")
    public Game removeTagFromGame(@PathVariable Long gameId, @PathVariable Long tagId) {
        return gameService.removeTag(gameId, tagId);
    }
}