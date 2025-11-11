package com.gamedb.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamedb.Entity.UserFavoriteGame;

import java.util.List;

public interface UserFavoriteGameRepository extends JpaRepository<UserFavoriteGame, Long> {
    List<UserFavoriteGame> findByUser_Id(Long userId);

    boolean existsByUser_IdAndGame_Id(Long userId, Long gameId);

    void deleteByUser_IdAndGame_Id(Long userId, Long gameId);
}
