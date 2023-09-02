package com.claim.api.mapper;

import com.claim.api.controller.dto.CommentDto;
import com.claim.api.controller.dto.SubTaskDto;
import com.claim.api.controller.dto.IssueAllDto;
import com.claim.api.controller.dto.IssueDto;
import com.claim.api.entity.Comment;
import com.claim.api.entity.Issue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class IssueMapper {

    private final UserMapper userMapper;
    private final SubTaskMapper subTaskMapper;
    private final CommentMapper commentMapper;

    @Autowired
    public IssueMapper(UserMapper userMapper, SubTaskMapper subTaskMapper, CommentMapper commentMapper) {
        this.userMapper = userMapper;
        this.subTaskMapper = subTaskMapper;
        this.commentMapper = commentMapper;
    }

    public IssueDto toIssueDto(Issue issue) {
        if (issue == null)
            return null;
        List<SubTaskDto> subtaskDto = new ArrayList<>();
        for (Issue issue1 : issue.getSubtask()) {
            subtaskDto.add(subTaskMapper.toSubTaskDto(issue1));
        }
        List<CommentDto> comments = new ArrayList<>();
        for (Comment comment : issue.getComments()) {
            comments.add(commentMapper.toCommentDto(comment));
        }
        return new IssueDto(issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getIssueStatus(),
                issue.getIssueType(),
                issue.getSpace(),
                subtaskDto,
                userMapper.toUserDto(issue.getExecutor()),
                issue.getStartDate(), issue.getEndDate(),
                userMapper.toUserDto(issue.getCustomer()),
                comments);
    }

    public IssueAllDto toIssueAllDto(Issue issue) {
        if (issue == null) {
            return null;
        }
        return new IssueAllDto(issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getIssueStatus(),
                issue.getIssueType(),
                userMapper.toUserDto(issue.getExecutor()),
                userMapper.toUserDto(issue.getCustomer()),
                issue.getStartDate());
    }
}
