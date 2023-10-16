package com.claim.api.entity.space;


import com.claim.api.entity.attachment.Attachment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "space")
public class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "space_name")
    @Size(min = 3, max = 25)
    private String name;

    @Column(name = "short_name")
    @Size(min = 2, max = 7)
    private String shortName;

    @Column(name = "image")
    private String image;

    @OneToMany
    @JsonIgnore
    private Set<Attachment> attachments = new HashSet<>();

    @OneToOne
    private SpaceConfiguration configuration;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Space that = (Space) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name) && Objects.equals(shortName, that.shortName) && Objects.equals(image, that.image);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, shortName, image);
    }
}
