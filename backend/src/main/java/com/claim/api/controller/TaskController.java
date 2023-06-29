package com.claim.api.controller;


import com.claim.api.controller.dto.TaskDto;
import com.claim.api.entity.Task;
import com.claim.api.mapper.TaskMapper;
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
    private final TaskMapper taskMapper;

    @Autowired
    public TaskController(TaskService taskService, TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    @GetMapping
    public ResponseEntity<Page<TaskDto>> getUserTasks(Principal principal,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size,
                                                      @RequestParam(defaultValue = "ASC") String sortBy,
                                                      @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        Page<TaskDto> tasks = taskService.getUserTasks(principal, pageRequest).map(taskMapper::toTaskDto);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/department")
    public ResponseEntity<Page<TaskDto>> getTaskDepartment(Principal principal,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size,
                                                           @RequestParam(defaultValue = "ASC") String sortBy,
                                                           @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        Page<TaskDto> tasks = taskService.getTaskForDepartment(principal, pageRequest).map(taskMapper::toTaskDto);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<String> createTask(@RequestBody Task task, Principal principal) {
        return ResponseEntity.ok(taskService.createTask(principal, task));
    }

    @PutMapping
    public ResponseEntity<TaskDto> updateTask(@RequestBody Task task) {
        return ResponseEntity.ok(taskMapper.toTaskDto(taskService.updateTask(task)));
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Page<TaskDto>> getTasks(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @RequestParam(defaultValue = "ASC") String sortBy,
                                                  @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        Page<TaskDto> tasks = taskService.getTasks(pageRequest).map(taskMapper::toTaskDto);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("{id}")
    public ResponseEntity<TaskDto> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskMapper.toTaskDto(taskService.getTaskById(id)));
    }

    @PutMapping("/{taskId}/department/{departmentId}")
    public ResponseEntity<String> reassignDepartment(@PathVariable Long taskId, @PathVariable Long departmentId) {
        return ResponseEntity.ok(taskService.reassignDepartment(taskId, departmentId));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> removeTaskById(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.removeTaskById(taskId));
    }
}