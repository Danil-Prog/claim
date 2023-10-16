package com.claim.api.entity.attachment;

import com.claim.api.entity.user.Profile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "attachament")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name")
    private String name;

    @NotNull
    @Column(name = "original_name")
    private String originalName;

    @NotNull
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private AttachmentType attachmentType;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "url")
    private String url;

    @NotNull
    @Column(name = "size")
    private double size;

    @NotNull
    @Column(name = "date_loaded")
    private Date dateLoaded = new Date();

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Profile uploaded;

    @Column(name = "is_visible")
    private boolean isVisible = true;

    public Attachment() {
    }

    public Attachment(String name, String originalName, AttachmentType attachmentType, String url, double size, Profile uploaded, String contentType) {
        this.name = name;
        this.originalName = originalName;
        this.attachmentType = attachmentType;
        this.url = url;
        this.size = size;
        this.uploaded = uploaded;
        this.contentType = contentType;
    }
}
