package com.claim.api.utils;

import com.claim.api.entity.attachment.Attachment;
import com.claim.api.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public final class AttachmentStorageUtil {

    private static final Logger logger = LoggerFactory.getLogger(AttachmentStorageUtil.class);
    private static final Path root = Paths.get("storage");
    private static final Path user = Paths.get("users");
    private static final Path department = Paths.get("department");

    private AttachmentStorageUtil() {
    }

    public static boolean uploadAttachment(MultipartFile file, Attachment attachment) {
        Path pathToResource = getPath(attachment);
        try {
            if (!Files.exists(pathToResource)) {
                Files.createDirectories(pathToResource);
            }
            file.transferTo(new File(pathToResource.resolve(attachment.getName()).toUri()));

            return true;
        } catch (IOException ex) {
            logger.error("There were errors while getting the file [{}]", ex.getMessage());
            throw new BadRequestException("There were errors while getting the file: " + ex);
        }

    }

    public static byte[] loadAttachment(Attachment attachment) {
        byte[] file;
        Path pathToResource = getPath(attachment).resolve(attachment.getName());

        try {
            file = Files.exists(pathToResource) ? Files.readAllBytes(pathToResource) : new byte[0];
        } catch (IOException ex) {
            logger.error("An error occurred while retrieving a file from storage [{}]", ex.getMessage());
            throw new BadRequestException("There were errors while getting the file: " + ex);
        }

        return file;
    }

    public static boolean removeAttachment(Attachment attachment) {
        Path pathToResource = getPath(attachment);
        try {
            return Files.deleteIfExists(pathToResource.resolve(attachment.getName()));
        } catch (IOException ex) {
            logger.error("Failed to delete file from storage, read more [{}]", ex.getMessage());
            throw new BadRequestException("Errors occurred when deleting the file: " + ex);
        }
    }

    public static boolean isExist(Attachment attachment) {
        Path pathToResource = getPath(attachment);
        return Files.exists(pathToResource.resolve(attachment.getName()));
    }

    private static Path getPath(Attachment attachment) {
        switch (attachment.getAttachmentType()) {
            case USER_IMAGE -> {
                return root.resolve(user).resolve(attachment.getUrl());
            }
            case SPACE_IMAGE -> {
                return root.resolve(department).resolve(attachment.getUrl());
            }
        }
        logger.error("Could not determine the type of attachment. [Attachment type] = {}", attachment.getAttachmentType());
        throw new BadRequestException("Attachment type not found");
    }
}
