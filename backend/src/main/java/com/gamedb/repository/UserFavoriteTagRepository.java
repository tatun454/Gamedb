package com.gamedb.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamedb.Entity.UserFavoriteTag;

import java.util.List;

public interface UserFavoriteTagRepository extends JpaRepository<UserFavoriteTag, Long> {
    List<UserFavoriteTag> findByUser_Id(Long userId);

    boolean existsByUser_IdAndTag_Id(Long userId, Long tagId);

    void deleteByUser_IdAndTag_Id(Long userId, Long tagId);
}
