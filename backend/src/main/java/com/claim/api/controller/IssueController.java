package com.claim.api.controller;


import com.claim.api.controller.dto.IssueAllDto;
import com.claim.api.controller.dto.IssueDto;
import com.claim.api.controller.request.IssueExecutorRequest;
import com.claim.api.controller.request.IssueStatusRequest;
import com.claim.api.controller.request.IssueTypeRequest;
import com.claim.api.entity.Issue;
import com.claim.api.entity.IssueStatus;
import com.claim.api.mapper.IssueMapper;
import com.claim.api.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

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
    public ResponseEntity<String> createIssue(@RequestBody Issue issue, Principal principal) {
        return ResponseEntity.ok(issueService.createIssue(principal, issue));
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> createSubtask(@PathVariable Long id, @RequestBody Issue issue, Principal principal) {
        return ResponseEntity.ok(issueService.createSubtask(id, principal, issue));
    }

    @PutMapping
    public ResponseEntity<IssueDto> updateIssue(@RequestBody Issue issue) {
        return ResponseEntity.ok(issueMapper.toIssueDto(issueService.updateIssue(issue)));
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Page<IssueAllDto>> getIssues(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size,
                                                       @RequestParam(defaultValue = "ASC") String sortBy,
                                                       @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        Page<IssueAllDto> tasks = issueService.getIssues(pageRequest).map(issueMapper::toIssueAllDto);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("{id}")
    public ResponseEntity<IssueDto> getIssueById(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(issueMapper.toIssueDto(issueService.getIssueByIdAndByUserAuthorities(id, principal)));
    }

    @PostMapping("/status")
    public void updateIssueStatus(@RequestBody IssueStatusRequest issueStatusRequest) {
        this.issueService.updateIssueStatus(issueStatusRequest);
    }

    @PostMapping("/executor")
    public void updateIssueExecutor(@RequestBody IssueExecutorRequest issueExecutorRequest) {
        this.issueService.updateIssueExecutor(issueExecutorRequest);
    }

    @PostMapping("/type")
    public void updateIssueType(@RequestBody IssueTypeRequest issueTypeRequest) {
        this.issueService.updateIssueType(issueTypeRequest);
    }

    @PutMapping("/{taskId}/department/{spaceId}")
    public ResponseEntity<String> reassignSpace(@PathVariable Long taskId, @PathVariable Long spaceId) {
        return ResponseEntity.ok(issueService.reassignSpace(taskId, spaceId));
    }

    @DeleteMapping("/{issueId}")
    public ResponseEntity<String> removeIssueById(@PathVariable Long issueId) {
        return ResponseEntity.ok(issueService.removeIssueById(issueId));
    }
}