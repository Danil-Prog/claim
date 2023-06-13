package com.claim.api.service;

import com.claim.api.controller.dto.UserDto;
import com.claim.api.entity.Profile;
import com.claim.api.entity.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.mapper.UserMapper;
import com.claim.api.repository.UserRepository;
import com.claim.api.utils.FilesStorageUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public boolean saveUser(User user) {
        Optional<User> userFromDataBase = userRepository.findByUsername(user.getUsername());
        if (userFromDataBase.isPresent()) {
            logger.warn("Error creating user. User named '{}' already exists", userFromDataBase.get().getUsername());
            return false;
        }
        user.setRole(user.getRole());
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        logger.info("user named '{}' successfully created", user.getUsername());
        return true;
    }

    public Page<User> getUserList(PageRequest pageRequest) {
        return userRepository.findAll(pageRequest);
    }

    public Profile getUserByUsername(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent()) {
            logger.info("The user with the name '{}' got his profile", userOptional.get().getUsername());
            return userOptional.get().getProfile();
        } else {
            logger.warn("Unable to get user profile '{}'. Username '{}' does not exist", principal.getName(),
                    principal.getName());
            throw new UserNotFoundException("User with username: " + principal.getName() + " not found!");
        }
    }

    public UserDto getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return new UserMapper().toUserDto(user);
        } else
            throw new UserNotFoundException("User with id=" + id + " not found");
    }

    public byte[] getUserAvatar(Long id, String filename) {
        return FilesStorageUtil.getUserAvatar(id, filename);
    }

    public UserDto removeUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
            User user = userOptional.get();
            logger.info("User id '{}' deleted successfully", id);
            return new UserMapper().toUserDto(user);
        } else {
            logger.warn("Error while deleting user with id '{}'. User with this id does not exist", id);
            throw new UserNotFoundException("User with id = " + id + " not found");
        }

    }

    public UserDto update(Long id, UserDto userDto) throws BadRequestException {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Long profileId = user.getProfile().getId();
            userDto.profile().setId(profileId);
            user.setUsername(userDto.username());
            user.setRole(userDto.role());
            user.setProfile(userDto.profile());
            logger.info("Updated user named '{}' profile", user.getUsername());
            User updatedUser = userRepository.save(user);
            return new UserMapper().toUserDto(updatedUser);
        } else
            throw new BadRequestException("User id:" + id + " not found!");
    }

    public String updateUserImage(MultipartFile image, Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String filename = UUID.randomUUID() + image.getOriginalFilename();
            if (FilesStorageUtil.uploadAvatar(user.getProfile(), image, filename)) {
                user.getProfile().setAvatar(filename);
                userRepository.save(user);
                logger.info("User named '{}' successfully updated avatar", principal.getName());
                return "Successful upload image";
            } else {
                logger.error("An error occurred while updating the avatar for a user named '{}'", principal.getName());
                return "An error occurred while uploading the file";
            }
        } else
            throw new BadRequestException("User: " + principal.getName() + " not found!");
    }

    public String updateAuthorizeUserProfile(Principal principal, Profile profile) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent() && profile != null) {
            User user = userOptional.get();
            profile.setId(user.getProfile().getId());
            user.setProfile(profile);
            userRepository.save(user);
            logger.info("User named '{}' updated my profile", principal.getName());
            return "User profile updated successfully";
        } else {
            logger.error("Error updating user named '{}'", principal.getName());
            throw new BadRequestException("Errors occurred while updating the user profile.");
        }
    }
}