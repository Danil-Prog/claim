package com.claim.api.controller;


import com.claim.api.controller.dto.IssueAllDto;
import com.claim.api.controller.dto.IssueDto;
import com.claim.api.controller.request.issue.*;
import com.claim.api.entity.issue.Issue;
import com.claim.api.entity.issue.IssueStatus;
import com.claim.api.mapper.issue.IssueMapper;
import com.claim.api.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import static com.claim.api.config.SwaggerConfig.JWT_AUTH_SECURITY_SCHEME;

@RestController
@RequestMapping("/api/v1/issue")
public class IssueController {

    private final IssueService issueService;
    private final IssueMapper issueMapper;

    @Autowired
    public IssueController(IssueService issueService,
                           IssueMapper issueMapper) {
        this.issueService = issueService;
        this.issueMapper = issueMapper;
    }

    @GetMapping
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<Page<IssueAllDto>> getUserIssues(Principal principal,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size,
                                                           @RequestParam(defaultValue = "ASC") String sortBy,
                                                           @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        Page<IssueAllDto> tasks = issueService.getUserIssues(principal, pageRequest).map(issueMapper::toIssueAllDto);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/space")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<Page<IssueDto>> getIssuesSpace(Principal principal,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size,
                                                         @RequestParam(defaultValue = "ASC") String sortBy,
                                                         @RequestParam(defaultValue = "id") String[] sort,
                                                         @RequestParam(required = false) IssueStatus issueStatus) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        Page<IssueDto> tasks = issueService.getIssueForSpace(principal, pageRequest, issueStatus).map(issueMapper::toIssueDto);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<String> createIssue(@RequestBody Issue issue, Principal principal) {
        return ResponseEntity.ok(issueService.createIssue(principal, issue));
    }

    @PostMapping("/{id}")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<String> createSubtask(@PathVariable Long id, @RequestBody Issue issue, Principal principal) {
        return ResponseEntity.ok(issueService.createSubtask(id, principal, issue));
    }

    @PutMapping
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<IssueDto> updateIssue(@RequestBody Issue issue) {
        return ResponseEntity.ok(issueMapper.toIssueDto(issueService.updateIssue(issue)));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)},
                            description = "Get all issues (Available only to super admin)")
    public ResponseEntity<Page<IssueAllDto>> getIssues(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size,
                                                       @RequestParam(defaultValue = "ASC") String sortBy,
                                                       @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        Page<IssueAllDto> tasks = issueService.getIssues(pageRequest).map(issueMapper::toIssueAllDto);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("{id}")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)},
                            description = "Get issue by id. " +
                                    "Checks that the user is the author or is in the same space")
    public ResponseEntity<IssueDto> getIssueById(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(issueMapper.toIssueDto(issueService.getIssueByIdAndByUserAuthorities(id, principal)));
    }

    @PostMapping("/status")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)},
                            description = "Update issue status")
    public void updateIssueStatus(@RequestBody IssueStatusRequest issueStatusRequest) {
        this.issueService.updateIssueStatus(issueStatusRequest);
    }

    @PostMapping("/executor")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)},
                            description = "Update issue executor")
    public void updateIssueExecutor(@RequestBody IssueExecutorRequest issueExecutorRequest) {
        this.issueService.updateIssueExecutor(issueExecutorRequest);
    }

    @PostMapping("/type")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)},
                            description = "Update issue type")
    public void updateIssueType(@RequestBody IssueTypeRequest issueTypeRequest) {
        this.issueService.updateIssueType(issueTypeRequest);
    }

    @PutMapping("/description")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)},
                            description = "Update issue description")
    public void updateIssueDescription(@RequestBody IssueDescriptionRequest issueDescriptionRequest) {
        this.issueService.updateIssueDescription(issueDescriptionRequest);
    }

    @PutMapping("/title")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)}
                , description = "Update issue title")
    public void updateIssueTitle(@RequestBody IssueTitleRequest issueTitleRequest) {
        this.issueService.updateIssueTitle(issueTitleRequest);
    }

    @PutMapping("/{taskId}/space/{spaceId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ISSUE_MOVE')")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)},
                            description = "Allows you to transfer the problem to another space. " +
                                    "Available only to a user with the super admin role or the move issued privilege")
    public ResponseEntity<String> reassignSpace(@PathVariable Long taskId, @PathVariable Long spaceId) {
        return ResponseEntity.ok(issueService.reassignSpace(taskId, spaceId));
    }

    @DeleteMapping("/{issueId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ISSUE_DELETE')")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)},
                            description = "Removed issue by id. " +
                                    "Available only to a user with the super admin role or the delete issued privilege")
    public ResponseEntity<String> removeIssueById(@PathVariable Long issueId) {
        return ResponseEntity.ok(issueService.removeIssueById(issueId));
    }
}
