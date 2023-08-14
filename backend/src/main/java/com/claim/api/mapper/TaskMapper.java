package com.claim.api.mapper;

import com.claim.api.controller.dto.SubTaskDto;
import com.claim.api.controller.dto.TaskAllDto;
import com.claim.api.controller.dto.TaskDto;
import com.claim.api.entity.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskMapper {

    private final UserMapper userMapper;
    private final SubTaskMapper subTaskMapper;

    @Autowired
    public TaskMapper(UserMapper userMapper, SubTaskMapper subTaskMapper) {
        this.userMapper = userMapper;
        this.subTaskMapper = subTaskMapper;
    }

    public TaskDto toTaskDto(Task task) {
        if (task == null)
            return null;
        List<SubTaskDto> subtaskDto = new ArrayList<>();
        for (Task task1 : task.getSubtask()) {
            subtaskDto.add(subTaskMapper.toSubTaskDto(task1));
        }
        return new TaskDto(task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getTaskStatus(),
                task.getTaskType(),
                task.getDepartment(),
                subtaskDto,
                userMapper.toUserDto(task.getExecutor()),
                task.getStartDate(), task.getEndDate(),
                userMapper.toUserDto(task.getCustomer()));
    }

    public TaskAllDto toTaskAllDto(Task task) {
        if (task == null) {
            return null;
        }
        return new TaskAllDto(task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getTaskStatus(),
                task.getTaskType(),
                userMapper.toUserDto(task.getExecutor()),
                userMapper.toUserDto(task.getCustomer()),
                task.getStartDate());
    }
}
