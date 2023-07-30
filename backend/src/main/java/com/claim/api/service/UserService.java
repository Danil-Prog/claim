package com.claim.api.service;

import com.claim.api.controller.dto.UserDto;
import com.claim.api.entity.Attachment;
import com.claim.api.entity.AttachmentType;
import com.claim.api.entity.Profile;
import com.claim.api.entity.User;
import com.claim.api.events.EventStatus;
import com.claim.api.events.UserCreationEvent;
import com.claim.api.exception.BadRequestException;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.mapper.UserMapper;
import com.claim.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.Resource;
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
    private final ApplicationEventPublisher applicationEventPublisher;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AttachmentService attachmentService;

    @Autowired
    public UserService(ApplicationEventPublisher applicationEventPublisher, UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, AttachmentService attachmentService) {
        this.applicationEventPublisher = applicationEventPublisher;
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.attachmentService = attachmentService;
    }

    public boolean saveUser(User user) {
        Optional<User> userFromDataBase = userRepository.findByUsername(user.getUsername());
        if (userFromDataBase.isPresent()) {
            applicationEventPublisher.publishEvent(new UserCreationEvent(user.getUsername(), EventStatus.ERROR));
            return false;
        }
        user.setRole(user.getRole());
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        applicationEventPublisher.publishEvent(new UserCreationEvent(user.getUsername(), EventStatus.SUCCESSFULLY));
        return true;
    }

    public Page<User> getUserList(PageRequest pageRequest) {
        return userRepository.findAll(pageRequest);
    }

    public Profile getUserByUsername(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent()) {
            return userOptional.get().getProfile();
        } else {
            throw new UserNotFoundException("User with username: " + principal.getName() + " not found!");
        }
    }

    public Optional<User> getUser(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return userOptional;
        } else
            throw new UserNotFoundException("User with id: " + id + " not found");
    }

    public Optional<User> getUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            return userOptional;
        } else
            throw new UserNotFoundException("User with username: " + username + " not found");
    }

    public UserDto getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return new UserMapper().toUserDto(user);
        } else
            throw new UserNotFoundException("User with id: " + id + " not found");
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
            throw new UserNotFoundException("User with id: " + id + " not found");
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
            throw new BadRequestException("User id: " + id + " not found!");
    }

    public Resource getUserAvatar(String filename) {
        return attachmentService.getStorageFileByName(filename);
    }

    public void updateUserAvatar(MultipartFile image, Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String filename = UUID.randomUUID() + image.getOriginalFilename();

            Attachment attachment = new Attachment(filename,
                    image.getOriginalFilename(),
                    AttachmentType.USER_IMAGE,
                    user.getProfile().getId() + "/images",
                    image.getSize(),
                    user.getProfile(),
                    image.getContentType());

            if (attachmentService.save(image, attachment)) {
                user.getProfile().setAvatar(filename);
                userRepository.save(user);
                logger.info("User named '{}' successfully updated avatar", principal.getName());
            } else {
                logger.error("An error occurred while updating the avatar for a user named '{}'", principal.getName());
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