package com.claim.api.mapper;

import com.claim.api.controller.dto.SubTaskDto;
import com.claim.api.entity.Task;
import org.springframework.stereotype.Service;

@Service
public class SubTaskMapper {

    private final UserMapper userMapper;

    public SubTaskMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public SubTaskDto toSubTaskDto(Task task) {
        return new SubTaskDto(task.getId(),
                task.getTitle(),
                task.getTaskStatus(),
                userMapper.toUserDto(task.getExecutor()));
    }
}
