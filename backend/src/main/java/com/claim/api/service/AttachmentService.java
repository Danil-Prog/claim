package com.claim.api.service;

import com.claim.api.entity.attachment.Attachment;
import com.claim.api.entity.attachment.AttachmentType;
import com.claim.api.entity.user.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.repository.AttachmentRepository;
import com.claim.api.utils.AttachmentStorageUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.util.UUID;

@Service
public class AttachmentService {

    private static final Logger logger = LoggerFactory.getLogger(AttachmentService.class);
    private final AttachmentRepository attachmentRepository;
    private final UserService userService;

    @Autowired
    public AttachmentService(AttachmentRepository attachmentRepository, UserService userService) {
        this.attachmentRepository = attachmentRepository;
        this.userService = userService;
    }

    public Page<Attachment> getAttachmentsUser(PageRequest pageRequest, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
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

    public void updateUserAvatar(MultipartFile image, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        String filename = UUID.randomUUID() + image.getOriginalFilename();

        Attachment attachment = new Attachment(filename,
                image.getOriginalFilename(),
                AttachmentType.USER_IMAGE,
                user.getProfile().getId() + "/images",
                image.getSize(),
                user.getProfile(),
                image.getContentType());

        if (this.save(image, attachment)) {
            user.getProfile().setAvatar(filename);
            userService.save(user);
            logger.info("User named '{}' successfully updated avatar", principal.getName());
        } else {
            logger.error("An error occurred while updating the avatar for a user named '{}'", principal.getName());
        }

    }

    public Resource getUserAvatar(String filename) {
        return this.getStorageFileByName(filename);
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
