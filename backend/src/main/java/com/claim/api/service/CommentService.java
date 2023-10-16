package com.claim.api.service;

import com.claim.api.controller.dto.CommentDto;
import com.claim.api.controller.request.CommentUpdateRequest;
import com.claim.api.entity.comment.Comment;
import com.claim.api.entity.issue.Issue;
import com.claim.api.entity.user.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.mapper.comment.CommentMapper;
import com.claim.api.repository.CommentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final Logger logger = LoggerFactory.getLogger(CommentService.class);
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

    public List<Comment> getIssueComments(Long issueId) {
        return this.issueService.getIssueById(issueId).getComments();
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

        logger.info("User '{}' created new comment: {}", principal.getName(), comment.getText());
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
        } else {
            logger.warn("User {} tried to delete a comment (comment_id: {}) in which he is not the author", principal.getName(), comment.getId());
            throw new BadRequestException("User " + user.getUsername() + "is not the author of the comment, deletion is not possible");
        }
    }

    public CommentDto updateTextComment(Long commentId,
                                        CommentUpdateRequest commentUpdateRequest,
                                        Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        Comment comment = this.getCommentById(commentId);
        if (comment.getSender().equals(user)) {
            comment.setText(commentUpdateRequest.getText());
            commentRepository.save(comment);
            return commentMapper.toCommentDto(comment);
        } else
            throw new BadRequestException("User " + user.getUsername() + "is not the author of the comment, deletion is not possible");
    }
}
