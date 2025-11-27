package com.gamedb.controller;

import com.gamedb.Entity.Game;
import com.gamedb.Entity.Role;
import com.gamedb.Entity.Tag;
import com.gamedb.Entity.User;
import com.gamedb.repository.UserRepository;
import com.gamedb.service.GameService;
import com.gamedb.service.TagService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final GameService gameService;
    private final TagService tagService;
    private final UserRepository userRepository;

    public AdminController(GameService gameService, TagService tagService, UserRepository userRepository) {
        this.gameService = gameService;
        this.tagService = tagService;
        this.userRepository = userRepository;
    }

    @PostMapping("/games")
    @PreAuthorize("hasRole('ADMIN')")
    public Game createGame(@RequestBody Game game) {
        return gameService.save(game);
    }

    @PutMapping("/games/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Game> updateGame(@PathVariable Long id, @RequestBody Game game) {
        return gameService.findById(id)
                .map(existingGame -> {
                    existingGame.setTitle(game.getTitle());
                    existingGame.setDescription(game.getDescription());
                    existingGame.setReleaseDate(game.getReleaseDate());
                    existingGame.setPrice(game.getPrice());
                    existingGame.setImageUrl(game.getImageUrl());
                    existingGame.setVideoUrl(game.getVideoUrl());
                    existingGame.setSteamLink(game.getSteamLink());
                    existingGame.getTags().clear();
                    for (Tag tag : game.getTags()) {
                        Tag managedTag = tagService.findById(tag.getId()).orElseThrow(() -> new RuntimeException("Tag not found"));
                        existingGame.getTags().add(managedTag);
                    }
                    return ResponseEntity.ok(gameService.save(existingGame));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tags")
    @PreAuthorize("hasRole('ADMIN')")
    public Tag createTag(@RequestBody Tag tag) {
        return tagService.save(tag);
    }

    @GetMapping("/tags")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Tag> getAllTags() {
        return tagService.findAll();
    }

    @DeleteMapping("/tags/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/games/{gameId}/tags/{tagId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Game addTagToGame(@PathVariable Long gameId, @PathVariable Long tagId) {
        return gameService.addTag(gameId, tagId);
    }

    @DeleteMapping("/games/{gameId}/tags/{tagId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Game removeTagFromGame(@PathVariable Long gameId, @PathVariable Long tagId) {
        return gameService.removeTag(gameId, tagId);
    }

    @GetMapping("/tags/search")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Tag> searchTags(@RequestParam String prefix) {
        return tagService.findByNameStartingWith(prefix);
    }

    @PutMapping("/users/{username}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> promoteToAdmin(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    user.setRole(Role.ADMIN);
                    userRepository.save(user);
                    return ResponseEntity.ok("User promoted to admin");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
