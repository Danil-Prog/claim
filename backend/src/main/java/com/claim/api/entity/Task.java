package com.claim.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "task")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;
    @Column(name = "description")
    private String description;
    @Column(name = "status_task")
    private StatusTask statusTask = StatusTask.REVIEW;
    @OneToOne
    private Department department;
    @OneToOne
    private User executor;
    @Column(name = "start_date")
    private Date startDate = new Date();
    @Column(name = "end_date")
    private Date endDate;
}
