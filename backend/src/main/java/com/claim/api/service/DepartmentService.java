package com.claim.api.service;

import com.claim.api.entity.Department;
import com.claim.api.entity.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.repository.DepartmentRepository;
import com.claim.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DepartmentService {

    private static final Logger logger = LoggerFactory.getLogger(DepartmentService.class);
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository, UserRepository userRepository) {
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    public Page<Department> getDepartmentsList(PageRequest pageRequest) {
        return departmentRepository.findAll(pageRequest);
    }

    public Department getDepartmentById(Long id) {
        Optional<Department> departmentOptional = departmentRepository.findById(id);
        if (departmentOptional.isPresent()) {
            logger.info("A department with id '{}' was received", id);
            return departmentOptional.get();
        }
        throw new BadRequestException("Department with id=" + id + " does not exist");
    }

    public Department createDepartment(Department department) {
        if (department.getName() != null) {
            logger.info("Department name '{}' successfully created", department.getName());
            return departmentRepository.save(department);
        }
        throw new BadRequestException("Department name must not be empty");
    }

    public Department updateDepartment(Long id, Department department) {
        Optional<Department> departmentOptional = departmentRepository.findById(id);
        if (departmentOptional.isPresent()) {
            logger.info("Updated department named '{}'. New value '{}'", departmentOptional.get().getName(), department.getName());
            return departmentRepository.save(department);
        }
        logger.error("Error updating department. Department with id= '{}' does not exist", id);
        throw new BadRequestException("Department with id=" + id + " does not exist");
    }

    public void removeDepartment(Long id) {
        departmentRepository.findById(id).ifPresent(departmentRepository::delete);
        logger.info("Department with id= {} successfully deleted", id);
    }

    public Page<User> getDepartmentUsers(Long id, PageRequest pageRequest) {
        Optional<Department> departmentOptional = departmentRepository.findById(id);
        if (departmentOptional.isPresent()) {
            return userRepository.findUsersByProfile_Department_Id(id, pageRequest);
        }
        throw new BadRequestException("Department with id=" + id + " does not exist");
    }
}
