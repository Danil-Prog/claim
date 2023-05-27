package com.claim.api.utils;

import com.claim.api.entity.Profile;
import com.claim.api.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public final class FilesStorageUtil {
    private static final Path root = Paths.get("storage");

    private FilesStorageUtil() {
    }

    public static boolean uploadAvatar(Profile profile, MultipartFile file, String filename) {
        Path pathToAvatar = root.resolve(String.valueOf(profile.getId())).resolve("avatar").resolve(filename);

        try {
            if (!Files.exists(root.resolve(profile.getId() + "/avatar"))) {
                System.out.println("26:FileStorageUtil: file exist: " + root.resolve(profile.getId() + "/avatar"));
                Files.createDirectories(root.resolve(profile.getId() + "/avatar"));
            }
            if (profile.getAvatar() != null) {
                System.out.println("30:FileStorageUtil: get avatar not null: " + root.resolve(String.valueOf(profile.getId())).resolve("avatar").resolve(profile.getAvatar()));
                Files.deleteIfExists(root.resolve(String.valueOf(profile.getId())).resolve("avatar").resolve(profile.getAvatar()));
            }
            System.out.println();
            System.out.println("File: " + file);
            System.out.println("OrigFileName: " + file.getOriginalFilename());
            System.out.println("ContentType: " + file.getContentType());
            System.out.println("Size file: " + file.getSize());
            System.out.println();
            file.transferTo(new File(pathToAvatar.toUri()));

            return true;
        } catch (IOException e) {
            throw new BadRequestException("Problems to upload file: " + e);
        }
    }

    public static byte[] getUserAvatar(Long id, String filename) {
        byte[] userAvatar;
        Path pathToAvatar = root.resolve(String.valueOf(id)).resolve("avatar").resolve(filename);

        try {
            userAvatar = Files.exists(pathToAvatar) ? Files.readAllBytes(pathToAvatar) : new byte[0];
        } catch (IOException e) {
            throw new BadRequestException("There were errors while getting the file: " + e);
        }

        return userAvatar;
    }
}