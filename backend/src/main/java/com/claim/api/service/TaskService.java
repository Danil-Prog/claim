package com.claim.api.service;

import com.claim.api.entity.Task;
import com.claim.api.entity.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.repository.TaskRepository;
import com.claim.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public Page<Task> getTasks(PageRequest pageRequest) {
        return taskRepository.findAll(pageRequest);
    }

    public Task getTaskById(Long id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            return taskOptional.get();
        }
        throw new BadRequestException("Task id=" + id + " not exist");
    }

    public Set<Task> getTasksByUserId(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return userOptional.get().getTask();
        }
        throw new UserNotFoundException("User id=" + id + " not exist");
    }

    public Task createTask(Long id, Task task) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            task.setDepartment(user.getProfile().getDepartment());
            userOptional.get().setTask(task);
            taskRepository.save(task);
            return task;
        }
        throw new UserNotFoundException("User id=" + id + " not exist");
    }
}
