package com.claim.api.service;

import com.claim.api.controller.dto.UserDto;
import com.claim.api.entity.Profile;
import com.claim.api.entity.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.mapper.UserMapper;
import com.claim.api.repository.UserRepository;
import com.claim.api.utils.FilesStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow();
    }

    public boolean saveUser(User user) {
        Optional<User> userFromDataBase = userRepository.findByUsername(user.getUsername());
        if (userFromDataBase.isPresent()) {
            return false;
        }
        user.setRole(user.getRole());
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }

    public Optional<User> validUsernameAndPassword(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> bCryptPasswordEncoder.matches(password, user.getPassword()));
    }

    public Page<User> getUserList(PageRequest pageRequest) {
        return userRepository.findAll(pageRequest);
    }

    public Profile getUserByUsername(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent()) {
            return userOptional.get().getProfile();
        } else
            throw new UserNotFoundException("User with username: " + principal.getName() + " not found!");
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

    public User removeUserById(Long id) {
        return userRepository.deleteUserById(id).orElseThrow(() ->
                new UserNotFoundException("User with id=" + id + " not found"));
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
                return "Successful upload image";
            } else
                return "An error occurred while uploading the file";
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

            return "User profile updated successfully";
        } else
            throw new BadRequestException("Errors occurred while updating the user profile.");
    }
}