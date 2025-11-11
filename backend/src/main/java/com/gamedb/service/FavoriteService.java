package com.gamedb.service;

import com.gamedb.Entity.Game;
import com.gamedb.Entity.User;
import com.gamedb.Entity.UserFavoriteGame;
import com.gamedb.Entity.UserFavoriteTag;
import com.gamedb.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    private final UserFavoriteGameRepository userFavoriteGameRepository;
    private final UserFavoriteTagRepository userFavoriteTagRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final TagRepository tagRepository;

    public FavoriteService(UserFavoriteGameRepository userFavoriteGameRepository, 
                           UserFavoriteTagRepository userFavoriteTagRepository,
                           UserRepository userRepository, 
                           GameRepository gameRepository, 
                           TagRepository tagRepository) {
        this.userFavoriteGameRepository = userFavoriteGameRepository;
        this.userFavoriteTagRepository = userFavoriteTagRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.tagRepository = tagRepository;
    }

    @Transactional
    public boolean toggleFavoriteGame(String username, Long gameId) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        
        boolean exists = userFavoriteGameRepository.existsByUser_IdAndGame_Id(user.getId(), gameId);
        if (exists) {
            userFavoriteGameRepository.deleteByUser_IdAndGame_Id(user.getId(), gameId);
            return false;
        } else {
            UserFavoriteGame ufg = new UserFavoriteGame();
            ufg.setUser(user);
            ufg.setGame(game);
            userFavoriteGameRepository.save(ufg);
            return true; 
        }
    }

    @Transactional
    public boolean toggleFavoriteTag(String username, Long tagId) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        boolean exists = userFavoriteTagRepository.existsByUser_IdAndTag_Id(user.getId(), tagId);
        if (exists) {
            userFavoriteTagRepository.deleteByUser_IdAndTag_Id(user.getId(), tagId);
            return false;
        } else {
            UserFavoriteTag uft = new UserFavoriteTag();
            uft.setUser(user);
            uft.setTag(tagRepository.findById(tagId).orElseThrow(() -> new RuntimeException("Tag not found")));
            userFavoriteTagRepository.save(uft);
            return true;
        }
    }

    public List<Game> getFavoriteGames(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return userFavoriteGameRepository.findByUser_Id(user.getId())
                .stream()
                .map(UserFavoriteGame::getGame)
                .collect(Collectors.toList());
    }

    public List<Game> getRecommendedGames(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        List<Long> favoritTagIds = userFavoriteTagRepository.findByUser_Id(user.getId())
                .stream()
                .map(uft -> uft.getTag().getId())
                .collect(Collectors.toList());
        
        
        if (favoritTagIds.isEmpty()) {
            return java.util.Collections.emptyList(); 
        }
        
        return gameRepository.findByTagIds(favoritTagIds);
    }
}