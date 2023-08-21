package com.claim.api.service;

import com.claim.api.entity.Attachment;
import com.claim.api.entity.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.repository.AttachmentRepository;
import com.claim.api.repository.UserRepository;
import com.claim.api.utils.AttachmentStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final UserService userService;

    @Autowired
    public AttachmentService(AttachmentRepository attachmentRepository, UserService userService) {
        this.attachmentRepository = attachmentRepository;
        this.userService = userService;
    }

    public Page<Attachment> getAttachmentsUser(PageRequest pageRequest, Principal principal) {
        User user = userService.getUserByUsername(principal.getName()).get();
        return attachmentRepository.findAttachmentByUploaded(pageRequest, user.getProfile());
    }

    public Page<Attachment> getInformationAttachments(PageRequest pageRequest) {
        return attachmentRepository.findAll(pageRequest);
    }
    public Resource getStorageFileByName(String filename) {
        Optional<Attachment> attachmentOptional = attachmentRepository.findAttachmentByName(filename);
        if (attachmentOptional.isPresent()) {
            return new ByteArrayResource(AttachmentStorageUtil.loadAttachment(attachmentOptional.get()));
        }
        throw new BadRequestException("Attachment with filename: " + filename + " not found");
    }

    public Resource getStorageFileByAttachmentId(Long id) {
        Optional<Attachment> attachmentOptional = attachmentRepository.findById(id);
        if (attachmentOptional.isPresent()) {
            return new ByteArrayResource(AttachmentStorageUtil.loadAttachment(attachmentOptional.get()));
        }
        throw new BadRequestException("Attachment with id: " + id + " not found");
    }

    public boolean save(MultipartFile file, Attachment attachment) {
        if (AttachmentStorageUtil.uploadAttachment(file, attachment)) {
            attachmentRepository.save(attachment);
            return true;
        }
        return false;
    }

    public void remove(Long id) {
        Optional<Attachment> attachmentOptional = attachmentRepository.findById(id);
        if (attachmentOptional.isPresent()) {
            Attachment attachment = attachmentOptional.get();
            if (AttachmentStorageUtil.removeAttachment(attachment)) {
                attachmentRepository.delete(attachment);
            }
        }
    }

    public void removeListAttachments(List<Attachment> attachments) {
        attachments.forEach(attachment -> attachmentRepository.findById(attachment.getId())
                .ifPresent(AttachmentStorageUtil::removeAttachment));
    }
}
