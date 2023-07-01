package com.claim.api.controller;

import com.claim.api.entity.Attachment;
import com.claim.api.service.AttachmentService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attachment")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @GetMapping
    public ResponseEntity<Page<Attachment>> getAttachmentUser(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size,
                                                              @RequestParam(defaultValue = "ASC") String sortBy,
                                                              @RequestParam(defaultValue = "id") String[] sort,
                                                              Principal principal) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        return ResponseEntity.ok(attachmentService.getAttachmentsUser(pageRequest, principal));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getAttachmentById(@PathVariable Long id) {
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(MediaType.IMAGE_GIF_VALUE))
                .body(attachmentService.getStorageFileByAttachmentId(id));
    }

    @DeleteMapping("/{id}")
    public void removeAttachmentById(@PathVariable Long id) {
        attachmentService.remove(id);
    }

    @PostMapping
    public void removeListAttachments(@RequestBody List<Attachment> attachments) {
        attachmentService.removeListAttachments(attachments);
    }
}
