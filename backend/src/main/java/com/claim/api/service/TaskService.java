package com.claim.api.service;

import com.claim.api.entity.Department;
import com.claim.api.entity.Task;
import com.claim.api.entity.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.repository.DepartmentRepository;
import com.claim.api.repository.TaskRepository;
import com.claim.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository, DepartmentRepository departmentRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
    }

    public Page<Task> getTasks(PageRequest pageRequest) {
        return taskRepository.findAll(pageRequest);
    }

    public Page<Task> getTaskForDepartment(Principal principal, PageRequest pageRequest) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Long departmentId = user.getProfile().getDepartment().getId();
            logger.info("User: {} got a list of department tasks", user.getUsername());
            return taskRepository.getTasksByDepartment_Id(departmentId, pageRequest);
        }
        throw new UserNotFoundException("User id=" + userOptional.get().getId() + " not exist");
    }

    public Task getTaskById(Long id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            return taskOptional.get();
        }
        logger.error("Error getting task. Tasks with ID= '{}' does not exist", id);
        throw new BadRequestException("Task id=" + id + " not exist");
    }

    public Page<Task> getUserTasks(Principal principal, PageRequest pageRequest) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return taskRepository.getTasksByCustomer(user, pageRequest);
        }
        throw new UserNotFoundException("User id=" + userOptional.get().getId() + " not exist");
    }

    public String createTask(Principal principal, Task task) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent()) {
            if (task.getExecutor() != null) {
                Optional<User> executorOption = userRepository.findById(task.getExecutor().getId());
                executorOption.ifPresent(task::setExecutor);
            }
            User user = userOptional.get();
            task.setCustomer(user);
            user.setTask(task);
            taskRepository.save(task);
            return "Task successfully created";
        }
        throw new UserNotFoundException("User id: " + userOptional.get().getId() + " not exist");
    }

    public Task updateTask(Task task) {
        Optional<Task> taskOptional = taskRepository.findById(task.getId());
        if (taskOptional.isPresent()) {
            logger.info("Task with id= '{}' successfully updated", taskOptional.get().getId());
            return taskRepository.save(task);
        }
        logger.info("Error while updating task. Tasks with ID= '{}' does not exist", taskOptional.get().getId());
        throw new BadRequestException("Task id: " + task.getId() + " not exist");
    }

    public String reassignDepartment(Long taskId, Long departmentId) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        Optional<Department> departmentOptional = departmentRepository.findById(departmentId);
        if (taskOptional.isPresent()) {
            if (departmentOptional.isPresent()) {
                Task task = taskOptional.get();
                task.setDepartment(departmentOptional.get());
                task.setExecutor(null);
                taskRepository.save(task);
                logger.info("Task with id: {} successfully reassign", taskId);
                return "Task with id: " + taskId + " successfully reassign";
            } else
                throw new BadRequestException("Department id: " + departmentId + " not exist");

        }
        throw new BadRequestException("Task id: " + taskId + " not exist");
    }
}