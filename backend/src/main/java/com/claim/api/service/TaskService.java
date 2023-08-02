package com.claim.api.service;

import com.claim.api.controller.request.TaskExecutorRequest;
import com.claim.api.controller.request.TaskStatusRequest;
import com.claim.api.controller.request.TaskTypeRequest;
import com.claim.api.entity.*;
import com.claim.api.events.EventStatus;
import com.claim.api.events.TaskCreationEvent;
import com.claim.api.exception.BadRequestException;
import com.claim.api.repository.DepartmentRepository;
import com.claim.api.repository.TaskRepository;
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
public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);
    private final TaskRepository taskRepository;
    private final DepartmentRepository departmentRepository;
    private final UserService userService;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Autowired
    public TaskService(TaskRepository taskRepository,
                       DepartmentRepository departmentRepository,
                       UserService userService,
                       ApplicationEventPublisher applicationEventPublisher) {
        this.taskRepository = taskRepository;
        this.departmentRepository = departmentRepository;
        this.userService = userService;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public Page<Task> getTasks(PageRequest pageRequest) {
        return taskRepository.findAll(pageRequest);
    }

    public Page<Task> getTaskForDepartment(Principal principal, PageRequest pageRequest, TaskStatus taskStatus) {
        Optional<User> userOptional = userService.getUserByUsername(principal.getName());
        User user = userOptional.get();
        Long departmentId = user.getProfile().getDepartment().getId();

        if (taskStatus != null)
            return taskRepository.getTasksByDepartment_IdAndTaskStatus(departmentId, pageRequest, taskStatus);

        return taskRepository.getTasksByDepartment_Id(departmentId, pageRequest);
    }

    public Task getTaskById(Long id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            return taskOptional.get();
        }
        logger.error("Error getting task. Tasks with ID= '{}' does not exist", id);
        throw new BadRequestException("Task id=" + id + " not exist");
    }

    public Task getTaskByIdAndByUserAuthorities(Long id, Principal principal) {
        Task task = getTaskById(id);
        User user = userService.getUserByUsername(principal.getName()).get();
        Department userDepartment = user.getProfile().getDepartment();
        if (task.getCustomer().equals(user) || task.getDepartment().equals(userDepartment)) {
            return task;
        }
        throw new AccessDeniedException("The user: '" + user.getUsername() +
                "' does not have enough rights to view the task with id: " + task.getId());
    }

    public Page<Task> getUserTasks(Principal principal, PageRequest pageRequest) {
        Optional<User> userOptional = userService.getUserByUsername(principal.getName());
        User user = userOptional.get();
        return taskRepository.getTasksByCustomer(user, pageRequest);
    }

    public String createTask(Principal principal, Task task) {
        Optional<User> userOptional = userService.getUserByUsername(principal.getName());
        Optional<Department> departmentOptional = departmentRepository.findById(task.getDepartment().getId());
        if (departmentOptional.isEmpty()) {
            throw new BadRequestException("Department is not exist");
        }
        if (task.getExecutor() != null) {
            Optional<User> executorOption = userService.getUser(task.getExecutor().getId());
            executorOption.ifPresent(task::setExecutor);
        }
        User user = userOptional.get();
        Department department = departmentOptional.get();

        task.setCustomer(user);
        task.setDepartment(department);
        user.setTask(task);

        taskRepository.save(task);
        applicationEventPublisher.publishEvent(new TaskCreationEvent(EventStatus.SUCCESSFULLY,
                department.getShortName(),
                task.getTitle()));
        return "Task successfully created";
    }

    public Task updateTask(Task task) {
        Optional<Task> taskOptional = taskRepository.findById(task.getId());
        if (taskOptional.isPresent()) {
            Task taskExisting = taskOptional.get();
            if (taskExisting.getCustomer() != null) {
                task.setCustomer(taskOptional.get().getCustomer());
            }
            if (task.getExecutor() != null) {
                Optional<User> executorOptional = userService.getUser(task.getExecutor().getId());
                executorOptional.ifPresent(task::setExecutor);
            }
            Department taskDepartment = taskExisting.getDepartment();
            if (taskDepartment != null) {
                task.setDepartment(taskDepartment);
            }
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

    public String removeTaskById(Long taskId) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isPresent()) {
            taskRepository.deleteById(taskOptional.get().getId());
            return "Task with id: " + taskId + " was deleted successfully";
        }
        throw new BadRequestException("Not found task with id: " + taskId);
    }

    public String createSubtask(Long id, Principal principal, Task task) {
        Optional<Task> epicTaskOptional = taskRepository.findById(id);
        if (epicTaskOptional.isPresent()) {
            Task epicTask = epicTaskOptional.get();
            epicTask.setTaskType(TaskType.EPIC);

            if (task.getCustomer() != null) {
                Optional<User> customer = userService.getUser(task.getCustomer().getId());
                customer.ifPresent(task::setCustomer);
            }

            if (task.getExecutor() != null) {
                Optional<User> executor = userService.getUser(task.getExecutor().getId());
                executor.ifPresent(task::setExecutor);
            }
            if (epicTask.getDepartment() != null) {
                task.setDepartment(epicTask.getDepartment());
            }

            task.setTaskType(TaskType.SUBTASK);
            epicTask.getSubtask().add(task);
            this.taskRepository.save(epicTask);

            return "Subtask successfully created";
        }
        throw new BadRequestException("Task with id: " + id + " not exist");
    }

    public void updateTaskStatus(TaskStatusRequest taskStatusRequest) {
        Task task = getTaskById(taskStatusRequest.getId());
        task.setTaskStatus(taskStatusRequest.getTaskStatus());
        taskRepository.save(task);
    }

    public void updateTaskExecutor(TaskExecutorRequest taskExecutorRequest) {
        Task task = getTaskById(taskExecutorRequest.getId());
        User user = this.userService.getUser(taskExecutorRequest.getExecutorId()).get();
        task.setExecutor(user);
        this.taskRepository.save(task);
    }

    public void updateTaskType(TaskTypeRequest taskTypeRequest) {
        Task task = getTaskById(taskTypeRequest.getId());
        if (task.getTaskType() == TaskType.EPIC) {
            this.taskRepository.deleteAll(task.getSubtask());
        }
        task.setTaskType(taskTypeRequest.getTaskType());
        this.taskRepository.save(task);
    }
}