package com.claim.api.entity.space;

import com.claim.api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "space_config")
public class SpaceConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User defaultAssignee;

    @Column(name = "is_space_archive")
    private boolean isSpaceArchive = false;

    @Column(name = "is_subtask_enabled")
    private boolean isSubTaskEnabled = true;

    @Column(name = "is_comments_created")
    private boolean isCommentsCreated = true;
}
