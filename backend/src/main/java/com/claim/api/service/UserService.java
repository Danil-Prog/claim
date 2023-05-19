package com.claim.api.service;

import com.claim.api.controller.dto.ProfileDto;
import com.claim.api.entity.Profile;
import com.claim.api.entity.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.mapper.ProfileMapper;
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

    public ProfileDto getUserByUsername(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isPresent()) {
            Profile userProfile = userOptional.get().getProfile();
            byte[] userAvatar = FilesStorageUtil.getUserAvatar(userProfile);
            return new ProfileMapper().toProfileDto(userProfile, userAvatar);
        } else
            throw new UserNotFoundException("User with username: " + principal.getName() + " not found!");
    }

    public User removeUserById(Long id) {
        return userRepository.deleteUserById(id).orElseThrow(() ->
                new UserNotFoundException("User with id=" + id + " not found"));
    }

    public User update(Long id, User user) throws BadRequestException {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            return userRepository.save(user);
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
}