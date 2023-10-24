package com.claim.api.service;

import com.claim.api.controller.request.issue.*;
import com.claim.api.entity.issue.Issue;
import com.claim.api.entity.issue.IssueStatus;
import com.claim.api.entity.issue.IssueType;
import com.claim.api.entity.space.Space;
import com.claim.api.entity.user.User;
import com.claim.api.events.EventStatus;
import com.claim.api.events.IssueCreationEvent;
import com.claim.api.exception.BadRequestException;
import com.claim.api.repository.IssueRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
public class IssueService {

    private static final Logger logger = LoggerFactory.getLogger(IssueService.class);
    private final IssueRepository issueRepository;
    private final SpaceService spaceService;
    private final UserService userService;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Autowired
    public IssueService(IssueRepository issueRepository,
                        SpaceService spaceService,
                        UserService userService,
                        ApplicationEventPublisher applicationEventPublisher) {
        this.issueRepository = issueRepository;
        this.spaceService = spaceService;
        this.userService = userService;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public Page<Issue> getIssues(PageRequest pageRequest) {
        return issueRepository.findAll(pageRequest);
    }

    public Page<Issue> getIssueForSpace(Principal principal, PageRequest pageRequest, IssueStatus issueStatus) {
        User user = userService.getUserByUsername(principal.getName());
        Long departmentId = user.getProfile().getSpace().getId();

        if (issueStatus != null)
            return issueRepository.getIssuesBySpace_IdAndIssueStatus(departmentId, pageRequest, issueStatus);

        return issueRepository.getIssuesBySpace_Id(departmentId, pageRequest);
    }

    public Issue getIssueById(Long id) {
        Optional<Issue> issueOptional = issueRepository.findById(id);
        if (issueOptional.isPresent()) {
            return issueOptional.get();
        }
        logger.error("Error getting issue. Issues with ID= '{}' does not exist", id);
        throw new BadRequestException("Issue id=" + id + " not exist");
    }

    public Issue getIssueByIdAndByUserAuthorities(Long id, Principal principal) {
        Issue issue = getIssueById(id);
        User user = userService.getUserByUsername(principal.getName());
        Space userSpace = user.getProfile().getSpace();
        if (issue.getCustomer().equals(user) || issue.getSpace().equals(userSpace)) {
            return issue;
        }
        throw new AccessDeniedException("The user: '" + user.getUsername() +
                "' does not have enough rights to view the issue with id: " + issue.getId());
    }

    public Page<Issue> getUserIssues(Principal principal, PageRequest pageRequest) {
        User user = userService.getUserByUsername(principal.getName());
        return issueRepository.getIssuesByCustomer(user, pageRequest);
    }

    public String createIssue(Principal principal, Issue issue) {
        User user = userService.getUserByUsername(principal.getName());
        Space space = this.spaceService.getSpaceById(issue.getSpace().getId());

        if (issue.getExecutor() != null) {
            User executor = userService.getUserByUsername(issue.getExecutor().getUsername());
            issue.setExecutor(executor);
        } else if (space.getConfiguration().getDefaultAssigneeId() != null) {
            User defaultExecutor = this.userService.getUserById(space.getConfiguration().getDefaultAssigneeId());
            issue.setExecutor(defaultExecutor);
        }

        issue.setCustomer(user);
        issue.setSpace(space);
        user.setIssue(issue);

        issueRepository.save(issue);
        applicationEventPublisher.publishEvent(new IssueCreationEvent(EventStatus.SUCCESSFULLY,
                space.getShortName(),
                issue.getTitle()));
        return "Issue successfully created";
    }

    public Issue updateIssue(Issue issue) {
        Optional<Issue> issueOptional = issueRepository.findById(issue.getId());
        if (issueOptional.isPresent()) {
            Issue issueExisting = issueOptional.get();
            if (issueExisting.getCustomer() != null) {
                issue.setCustomer(issueOptional.get().getCustomer());
            }
            if (issue.getExecutor() != null) {
                Optional<User> executorOptional = userService.getUser(issue.getExecutor().getId());
                executorOptional.ifPresent(issue::setExecutor);
            }
            Space issueSpace = issueExisting.getSpace();
            if (issueSpace != null) {
                issue.setSpace(issueSpace);
            }
            logger.info("Issue with id= '{}' successfully updated", issueOptional.get().getId());
            return issueRepository.save(issue);
        }
        logger.info("Error while updating issue. Issues with ID= '{}' does not exist", issueOptional.get().getId());
        throw new BadRequestException("Issue id: " + issue.getId() + " not exist");
    }

    public String reassignSpace(Long issueId, Long spaceId) {
        Optional<Issue> issueOptional = issueRepository.findById(issueId);
        Space space = this.spaceService.getSpaceById(spaceId);
        if (issueOptional.isPresent()) {
            Issue issue = issueOptional.get();
            issue.setSpace(space);
            issue.setExecutor(null);
            issueRepository.save(issue);
            logger.info("Issue with id: {} successfully reassign", issueId);
            return "Issue with id: " + issueId + " successfully reassign";
        }
        throw new BadRequestException("Issue id: " + issueId + " not exist");
    }

    public String removeIssueById(Long issueId) {
        Optional<Issue> issueOptional = issueRepository.findById(issueId);
        if (issueOptional.isPresent()) {
            issueRepository.deleteById(issueOptional.get().getId());
            return "Issue with id: " + issueId + " was deleted successfully";
        }
        throw new BadRequestException("Not found issue with id: " + issueId);
    }

    public String createSubtask(Long id, Principal principal, Issue issue) {
        Optional<Issue> epicIssueOptional = issueRepository.findById(id);
        if (epicIssueOptional.isPresent()) {
            Issue epicIssue = epicIssueOptional.get();

            if (epicIssue.getIssueType() == IssueType.SUBTASK) {
                throw new BadRequestException("It is not possible to create a subtask in a subtask");
            }
            epicIssue.setIssueType(IssueType.EPIC);

            User customer = userService.getUserByUsername(principal.getName());
            issue.setCustomer(customer);

            if (issue.getExecutor() != null) {
                Optional<User> executor = userService.getUser(issue.getExecutor().getId());
                executor.ifPresent(issue::setExecutor);
            }

            issue.setSpace(epicIssue.getSpace());

            issue.setIssueType(IssueType.SUBTASK);
            epicIssue.getSubtask().add(issue);
            this.issueRepository.save(epicIssue);

            return "Subtask successfully created";
        }
        throw new BadRequestException("Issue with id: " + id + " not exist");
    }

    public void updateIssueStatus(IssueStatusRequest issueStatusRequest) {
        Issue issue = getIssueById(issueStatusRequest.getId());
        issue.setIssueStatus(issueStatusRequest.getIssueStatus());
        issueRepository.save(issue);
    }

    public void updateIssueExecutor(IssueExecutorRequest issueExecutorRequest) {
        Issue issue = getIssueById(issueExecutorRequest.getId());
        User user = this.userService.getUserById(issueExecutorRequest.getExecutorId());
        issue.setExecutor(user);
        this.issueRepository.save(issue);
    }

    public void updateIssueType(IssueTypeRequest issueTypeRequest) {
        Issue issue = getIssueById(issueTypeRequest.getId());
        if (issue.getIssueType() == IssueType.EPIC) {
            this.issueRepository.deleteAll(issue.getSubtask());
        }
        issue.setIssueType(issueTypeRequest.getIssueType());
        this.issueRepository.save(issue);
    }


    public void updateIssueDescription(IssueDescriptionRequest issueDescriptionRequest) {
        Issue issue = getIssueById(issueDescriptionRequest.getId());
        issue.setDescription(issueDescriptionRequest.getDescription());
        logger.info("Updated the description in the problem with id [{}], old [{}], new [{}]",
                issue.getId(), issue.getDescription(), issueDescriptionRequest.getDescription());
        this.issueRepository.save(issue);
    }

    public void updateIssueTitle(IssueTitleRequest issueTitleRequest) {
        Issue issue = getIssueById(issueTitleRequest.getId());
        logger.info("Updated the title in the problem with id [{}], old [{}], new [{}]", issue.getId(), issue.getTitle(), issueTitleRequest.getTitle());
        issue.setTitle(issueTitleRequest.getTitle());
        this.issueRepository.save(issue);
    }
}
