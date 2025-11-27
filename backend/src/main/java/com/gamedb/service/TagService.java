package com.gamedb.service;

import com.gamedb.Entity.Tag;
import com.gamedb.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TagService {
    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public Tag save(Tag tag) {
        return tagRepository.save(tag);
    }

    public Optional<Tag> findById(Long id) {
        return tagRepository.findById(id);
    }

    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    public List<Tag> findByNameStartingWith(String prefix) {
        return tagRepository.findByNameStartingWith(prefix);
    }

    public void deleteById(Long id) {
        tagRepository.deleteById(id);
    }
}
