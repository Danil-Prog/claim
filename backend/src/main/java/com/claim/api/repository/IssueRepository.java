package com.claim.api.repository;

import com.claim.api.entity.issue.Issue;
import com.claim.api.entity.issue.IssueStatus;
import com.claim.api.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    Page<Issue> getIssuesByCustomer(User user, PageRequest pageRequest);
    Page<Issue> getIssuesBySpace_IdAndIssueStatus(Long id, PageRequest pageRequest, IssueStatus issueStatus);
    Page<Issue> getIssuesBySpace_Id(Long id, PageRequest pageRequest);
}
