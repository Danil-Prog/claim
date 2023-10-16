package com.claim.api.mapper.issue;

import com.claim.api.controller.dto.SubTaskDto;
import com.claim.api.entity.issue.Issue;
import com.claim.api.mapper.user.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class SubTaskMapper {

    private final UserMapper userMapper;

    public SubTaskMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public SubTaskDto toSubTaskDto(Issue issue) {
        return new SubTaskDto(issue.getId(),
                issue.getTitle(),
                issue.getIssueStatus(),
                userMapper.toUserDto(issue.getExecutor()));
    }
}
