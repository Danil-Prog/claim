package com.claim.api.controller;

import com.claim.api.entity.Department;
import com.claim.api.entity.User;
import com.claim.api.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/department")
public class DepartmentController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<Page<Department>> getDepartmentsList(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size,
                                                               @RequestParam(defaultValue = "ASC") String sortBy,
                                                               @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        return ResponseEntity.ok(departmentService.getDepartmentsList(pageRequest));
    }

    @GetMapping("/{id}/users")
    public ResponseEntity<Page<User>> getDepartmentUsers(@PathVariable Long id,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size,
                                                         @RequestParam(defaultValue = "ASC") String sortBy,
                                                         @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        return ResponseEntity.ok(departmentService.getDepartmentUsers(id, pageRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }


    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(departmentService.createDepartment(department));
    }

    @DeleteMapping("/{id}")
    public void removeDepartment(@PathVariable Long id) {
        departmentService.removeDepartment(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, Department department) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, department));
    }
}
