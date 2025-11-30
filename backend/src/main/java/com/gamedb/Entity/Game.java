package com.gamedb.Entity;

import javax.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "text")
    private String story;

    private LocalDate releaseDate;

    private BigDecimal price;

    private String imageUrl;

    private String videoUrl;

    private String steamLink;

    @ElementCollection
    @CollectionTable(name = "game_additional_images", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "image_url")
    private List<String> additionalImageUrls = new java.util.ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "game_additional_videos", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "video_url")
    private List<String> additionalVideoUrls = new java.util.ArrayList<>();

    @ManyToMany
    @JoinTable(name = "game_tags",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();
}
