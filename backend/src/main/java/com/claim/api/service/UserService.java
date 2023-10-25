package com.claim.api.service;

import com.claim.api.controller.dto.UserDto;
import com.claim.api.controller.response.SuccessfullyResponse;
import com.claim.api.entity.user.Authorities;
import com.claim.api.entity.user.Profile;
import com.claim.api.entity.user.User;
import com.claim.api.events.EventStatus;
import com.claim.api.events.UserCreationEvent;
import com.claim.api.exception.BadRequestException;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.mapper.user.UserMapper;
import com.claim.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final ApplicationEventPublisher applicationEventPublisher;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserService(ApplicationEventPublisher applicationEventPublisher,
                       UserRepository userRepository,
                       BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.applicationEventPublisher = applicationEventPublisher;
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public boolean saveUser(User user) {
        Optional<User> userFromDataBase = userRepository.findByUsername(user.getUsername());
        if (userFromDataBase.isPresent()) {
            applicationEventPublisher.publishEvent(new UserCreationEvent(user.getUsername(), EventStatus.ERROR));
            return false;
        }
        user.setRights(user.getRights());
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        applicationEventPublisher.publishEvent(new UserCreationEvent(user.getUsername(), EventStatus.SUCCESSFULLY));
        return true;
    }

    public Page<User> getUserList(PageRequest pageRequest) {
        return userRepository.findAll(pageRequest);
    }

    public Profile getUserProfileByUsername(Principal principal) {
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
            throw new UserNotFoundException("User with id [" + id + "] not found");
    }

    public User getUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            return userOptional.get();
        } else
            throw new UserNotFoundException("User with username [" + username + "] not found");
    }

    public User getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return userOptional.get();
        } else
            throw new UserNotFoundException("User with id [" + id + "] not found");
    }

    public UserDto getUserDtoById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return new UserMapper().toUserDto(user);
        } else
            throw new UserNotFoundException("User with id [" + id + "] not found");
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
            Profile profile = user.getProfile();
            user.setUsername(userDto.username());
            user.setProfile(profile);
            logger.info("Updated user named '{}' profile", user.getUsername());
            User updatedUser = userRepository.save(user);
            return new UserMapper().toUserDto(updatedUser);
        } else
            throw new BadRequestException("User id: " + id + " not found!");
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public SuccessfullyResponse updateAuthorizeUserProfile(Principal principal, Profile profile) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent() && profile != null) {
            User user = userOptional.get();
            profile.setId(user.getProfile().getId());
            user.setProfile(profile);
            userRepository.save(user);
            logger.info("User named '{}' updated my profile", principal.getName());
            return new SuccessfullyResponse("User profile updated successfully");
        } else {
            logger.error("Error updating user named '{}'", principal.getName());
            throw new BadRequestException("Errors occurred while updating the user profile.");
        }
    }
}
