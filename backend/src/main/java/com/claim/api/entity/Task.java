package com.claim.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.*;

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
    @NotNull
    @Column(name = "title")
    private String title;
    @NotNull
    @Column(name = "description")
    private String description;
    @Column(name = "status_task")
    @Enumerated(EnumType.STRING)
    private TaskStatus taskStatus = TaskStatus.REVIEW;
    @NotNull
    @OneToOne
    private Department department;
    @Column(name = "type_task")
    @Enumerated(EnumType.STRING)
    private TaskType taskType = TaskType.TASK;
    @OneToMany(cascade = CascadeType.ALL)
    private Set<Task> subtask = new HashSet<>();
    @OneToOne
    private User executor;
    @Column(name = "start_date")
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp startDate;
    @Column(name = "end_date")
    private Date endDate;
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return Objects.equals(id, task.id) && Objects.equals(title, task.title) && Objects.equals(description, task.description) && taskStatus == task.taskStatus && Objects.equals(department, task.department) && taskType == task.taskType && Objects.equals(executor, task.executor) && Objects.equals(startDate, task.startDate) && Objects.equals(endDate, task.endDate) && Objects.equals(customer, task.customer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, taskStatus, department, taskType, executor, startDate, endDate, customer);
    }
}