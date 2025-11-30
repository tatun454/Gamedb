package com.gamedb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameDTO {
    private Long id;
    private String title;
    private String description;
    private String story;
    private LocalDate releaseDate;
    private BigDecimal price;
    private String imageUrl;
    private String videoUrl;
    private String steamLink;
    private List<String> additionalImageUrls;
    private List<String> additionalVideoUrls;
    private Set<TagDTO> tags;
}
