package com.gamedb.controller;

import com.gamedb.Entity.Game;
import com.gamedb.service.GameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public Page<Game> getAllGames(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
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
}