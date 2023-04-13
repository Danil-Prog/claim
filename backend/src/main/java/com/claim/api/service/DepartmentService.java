package com.claim.api.service;

import com.claim.api.entity.Department;
import com.claim.api.exception.BadRequestException;
import com.claim.api.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getDepartmentsList() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        Optional<Department> departmentOptional = departmentRepository.findById(id);
        if (departmentOptional.isPresent())
            return departmentOptional.get();
        throw new BadRequestException("Department with id=" + id + " does not exist");
    }

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department department) {
        Optional<Department> departmentOptional = departmentRepository.findById(id);
        if (departmentOptional.isPresent())
            return departmentRepository.save(department);
        throw new BadRequestException("Department with id=" + id + " does not exist");
    }

    public void removeDepartment(Long id) {
        departmentRepository.findById(id).ifPresent(departmentRepository::delete);
    }
}
