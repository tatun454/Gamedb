package com.gamedb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gamedb.Entity.Game;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    Page<Game> findAll(Pageable pageable);

    
    @Query("SELECT g FROM Game g WHERE LOWER(g.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    Page<Game> findByTitleContainingIgnoreCase(@Param("title") String title, Pageable pageable);

    @Query("SELECT DISTINCT g FROM Game g JOIN g.tags t WHERE t.id = :tagId")
    Page<Game> findByTagId(@Param("tagId") Long tagId, Pageable pageable);

   
    @Query("SELECT DISTINCT g FROM Game g JOIN g.tags t WHERE LOWER(g.title) LIKE LOWER(CONCAT('%', :title, '%')) AND t.id = :tagId")
    Page<Game> findByTitleAndTagId(@Param("title") String title, @Param("tagId") Long tagId, Pageable pageable);

  
    @Query("SELECT DISTINCT g FROM Game g JOIN g.tags t WHERE t.id IN :tagIds")
    List<Game> findByTagIds(@Param("tagIds") List<Long> tagIds);

    
    List<Game> findByTags_Id(Long tagId);
}
