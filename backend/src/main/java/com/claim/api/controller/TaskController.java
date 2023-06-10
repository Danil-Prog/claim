package com.claim.api.controller;


import com.claim.api.entity.Task;
import com.claim.api.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/task")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    @GetMapping
    public ResponseEntity<Page<Task>> getUserTasks(Principal principal,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size,
                                                   @RequestParam(defaultValue = "ASC") String sortBy,
                                                   @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size , Sort.by(Sort.Direction.fromString(sortBy), sort));
        return ResponseEntity.ok(taskService.getUserTasks(principal, pageRequest));
    }

    @PostMapping
    public ResponseEntity<String> createTask(@RequestBody Task task, Principal principal) {
        return ResponseEntity.ok(taskService.createTask(principal, task));
    }

    @PutMapping
    public ResponseEntity<Task> updateTask(@RequestBody Task task) {
        return ResponseEntity.ok(taskService.updateTask(task));
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Page<Task>> getTasks(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size,
                                               @RequestParam(defaultValue = "ASC") String sortBy,
                                               @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size , Sort.by(Sort.Direction.fromString(sortBy), sort));
        return ResponseEntity.ok(taskService.getTasks(pageRequest));
    }

    @GetMapping("{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }
}