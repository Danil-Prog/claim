package com.claim.api.mapper;

import com.claim.api.controller.dto.CommentDto;
import com.claim.api.entity.Comment;
import org.springframework.stereotype.Service;

@Service
public class CommentMapper {

    private final UserMapper userMapper;

    public CommentMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public CommentDto toCommentDto(Comment comment) {
        return new CommentDto(comment.getId(),
                comment.getText(),
                userMapper.toUserDto(comment.getSender()),
                comment.getDateCreated());
    }
}
