package com.claim.api.controller;

import com.claim.api.controller.dto.CommentDto;
import com.claim.api.controller.request.CommentUpdateRequest;
import com.claim.api.entity.comment.Comment;
import com.claim.api.mapper.comment.CommentMapper;
import com.claim.api.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/comment")
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper commentMapper;

    public CommentController(CommentService commentService, CommentMapper commentMapper) {
        this.commentService = commentService;
        this.commentMapper = commentMapper;
    }

    @GetMapping("/issue/{issueId}")
    public ResponseEntity<List<CommentDto>> getIssueComments(@PathVariable Long issueId) {
        List<CommentDto> comments = this.commentService.getIssueComments(issueId)
                .stream()
                .map(commentMapper::toCommentDto)
                .toList();
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/issue/{issueId}")
    public ResponseEntity<CommentDto> createCommentToIssue(@RequestBody Comment comment, @PathVariable Long issueId, Principal principal) {
        return ResponseEntity.ok(commentService.createCommentToIssue(comment, issueId, principal));
    }

    @DeleteMapping("/{commentId}/issue/{issueId}")
    public ResponseEntity<CommentDto> removeCommentInIssue(@PathVariable Long issueId, @PathVariable Long commentId, Principal principal) {
        return ResponseEntity.ok(commentService.removeComment(commentId, issueId, principal));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDto> updateCommentText(@PathVariable Long commentId,
                                                        @RequestBody CommentUpdateRequest commentUpdateRequest,
                                                        Principal principal) {
        return ResponseEntity.ok(commentService.updateTextComment(commentId, commentUpdateRequest, principal));
    }
}
