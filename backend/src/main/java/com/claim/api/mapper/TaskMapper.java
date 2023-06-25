package com.claim.api.mapper;

import com.claim.api.controller.dto.TaskDto;
import com.claim.api.entity.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskMapper {

    private final UserMapper userMapper;

    @Autowired
    public TaskMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public TaskDto toTaskDto(Task task) {
        if (task == null)
            return null;
        return new TaskDto(task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatusTask(),
                task.getDepartment(),
                userMapper.toUserDto(task.getExecutor()),
                task.getStartDate(), task.getEndDate(),
                userMapper.toUserDto(task.getCustomer()));
    }
}
