package com.gamedb.service;

import com.gamedb.Entity.Game;
import com.gamedb.Entity.Tag;
import com.gamedb.repository.GameRepository;
import com.gamedb.repository.TagRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final TagRepository tagRepository;

    public GameService(GameRepository gameRepository, TagRepository tagRepository) {
        this.gameRepository = gameRepository;
        this.tagRepository = tagRepository;
    }

    public Page<Game> listAll(Pageable pageable) {
        return gameRepository.findAll(pageable);
    }

    public Page<Game> search(String title, Long tagId, Pageable pageable) {
        if (title != null && tagId != null) {
            return gameRepository.findByTitleAndTagId(title, tagId, pageable);
        } else if (title != null) {
            return gameRepository.findByTitleContainingIgnoreCase(title, pageable);
        } else if (tagId != null) {
            return gameRepository.findByTagId(tagId, pageable);
        } else {
            return gameRepository.findAll(pageable);
        }
    }

    public Optional<Game> findById(Long id) {
        return gameRepository.findById(id);
    }

    public Game save(Game game) {
        return gameRepository.save(game);
    }

    public Game addTag(Long gameId, Long tagId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new RuntimeException("Tag not found"));
        game.getTags().add(tag);
        return gameRepository.save(game);
    }

    public Game removeTag(Long gameId, Long tagId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new RuntimeException("Tag not found"));
        game.getTags().remove(tag);
        return gameRepository.save(game);
    }
}
