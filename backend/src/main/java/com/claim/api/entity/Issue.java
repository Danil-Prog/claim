package com.claim.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.*;

@Entity
@Table(name = "issue")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(name = "title")
    private String title;
    @NotNull
    @Size(min = 1, max = 2500)
    @Column(name = "description")
    private String description;
    @Column(name = "issue_status")
    @Enumerated(EnumType.STRING)
    private IssueStatus issueStatus = IssueStatus.REVIEW;
    @NotNull
    @OneToOne
    private Space space;
    @Column(name = "issue_type")
    @Enumerated(EnumType.STRING)
    private IssueType issueType;
    @OneToMany(cascade = CascadeType.ALL)
    private Set<Issue> subtask = new HashSet<>();
    @OneToOne
    private User executor;
    @Column(name = "created_date")
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp startDate;
    @Column(name = "updated_date")
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    @OneToMany
    private List<Comment> comments = new ArrayList<>();

    public void setComments(Comment comment) {
        this.comments.add(comment);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Issue issue = (Issue) o;
        return Objects.equals(id, issue.id) && Objects.equals(title, issue.title) &&
                Objects.equals(description, issue.description) && issueStatus == issue.issueStatus &&
                Objects.equals(space, issue.space) && issueType == issue.issueType &&
                Objects.equals(executor, issue.executor) && Objects.equals(startDate, issue.startDate) &&
                Objects.equals(endDate, issue.endDate) && Objects.equals(customer, issue.customer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, issueStatus, space, issueType, executor, startDate, endDate, customer);
    }
}