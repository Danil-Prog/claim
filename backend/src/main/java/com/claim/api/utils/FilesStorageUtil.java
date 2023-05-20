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
        Path pathToUserAvatar = root.resolve(profile.getId() + "/avatar/");
        try {
            if (!Files.exists(root.resolve(profile.getId() + "/avatar")))
                Files.createDirectories(root.resolve(profile.getId() + "/avatar"));

            if (profile.getAvatar() != null) {
                Files.deleteIfExists(pathToUserAvatar.resolve(profile.getAvatar()));
            }
            file.transferTo(new File(pathToUserAvatar.resolve(filename).toUri()));

            return true;
        } catch (IOException e) {
            throw new BadRequestException("Problems to upload file: " + e);
        }
    }

    public static byte[] getUserAvatar(String filename, Profile profile) {
        Path pathToUserAvatar = root.resolve(profile.getId() + "/avatar/" + filename);
        byte[] userAvatar = new byte[0];

        if (profile.getAvatar() != null) {
            if (!profile.getAvatar().isEmpty()) {
                try {
                    userAvatar = Files.exists(pathToUserAvatar) ? Files.readAllBytes(pathToUserAvatar) : new byte[0];
                } catch (IOException e) {
                    throw new BadRequestException("There were errors while getting the file: " + e);
                }
            }
        }
        return userAvatar;
    }
}