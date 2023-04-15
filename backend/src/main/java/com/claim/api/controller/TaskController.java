package com.claim.api.controller;


import com.claim.api.entity.Task;
import com.claim.api.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/task")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/user={id}")
    public ResponseEntity<Set<Task>> getTasksByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTasksByUserId(id));
    }

    @PostMapping("/user={id}")
    public ResponseEntity<Task> createTask(@PathVariable Long id, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.createTask(id, task));
    }
}
