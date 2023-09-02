package com.claim.api.service;

import com.claim.api.controller.dto.CommentDto;
import com.claim.api.entity.Comment;
import com.claim.api.entity.Issue;
import com.claim.api.entity.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.mapper.CommentMapper;
import com.claim.api.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
public class CommentService {

    private final IssueService issueService;
    private final CommentMapper commentMapper;
    private final UserService userService;
    private final CommentRepository commentRepository;

    public CommentService(IssueService issueService,
                          CommentMapper commentMapper,
                          UserService userService, CommentRepository commentRepository) {
        this.issueService = issueService;
        this.commentMapper = commentMapper;
        this.userService = userService;
        this.commentRepository = commentRepository;
    }

    public Comment getCommentById(Long commentId) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent())
            return commentOptional.get();
        else
            throw new BadRequestException("Comment with id = " + commentId + " not exist");
    }

    public CommentDto createCommentToIssue(Comment comment, Long issueId, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        Issue issue = issueService.getIssueById(issueId);
        comment.setSender(user);
        commentRepository.save(comment);
        issue.setComments(comment);
        issueService.updateIssue(issue);

        return commentMapper.toCommentDto(comment);
    }

    public CommentDto removeComment(Long commentId, Long issueId, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        Issue issue = issueService.getIssueById(issueId);
        Comment comment = this.getCommentById(commentId);
        if (comment.getSender().equals(user)) {
            issue.getComments().remove(comment);
            commentRepository.deleteById(commentId);
            return commentMapper.toCommentDto(comment);
        } else
            throw new BadRequestException("User" + user.getUsername() + "is not the author of the comment, deletion is not possible");
    }
}
