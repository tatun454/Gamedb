package com.gamedb.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamedb.Entity.Tag;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
    List<Tag> findByNameStartingWithIgnoreCase(String prefix);
}
