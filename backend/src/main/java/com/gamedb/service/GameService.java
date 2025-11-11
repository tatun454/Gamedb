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

    public Game save(Game game) {
        return gameRepository.save(game);
    }

    public Optional<Game> findById(Long id) {
        return gameRepository.findById(id);
    }

    public Page<Game> listAll(Pageable pageable) {
        return gameRepository.findAll(pageable);
    }

    public Page<Game> search(String title, Long tagId, Pageable pageable) {
       
        if (title != null && !title.trim().isEmpty() && tagId != null) {
            
            return gameRepository.findByTitleAndTagId(title.trim(), tagId, pageable);
        } else if (title != null && !title.trim().isEmpty()) {
            
            return gameRepository.findByTitleContainingIgnoreCase(title.trim(), pageable);
        } else if (tagId != null) {
            
            return gameRepository.findByTagId(tagId, pageable);
        } else {
            
            return gameRepository.findAll(pageable);
        }
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
