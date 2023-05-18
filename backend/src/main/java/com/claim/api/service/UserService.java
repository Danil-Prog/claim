package com.claim.api.service;

import com.claim.api.entity.Profile;
import com.claim.api.entity.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final Path root = Paths.get("avatars/");

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
        return userRepository.findByUsername(principal.getName()).orElseThrow(() ->
                new UserNotFoundException("User with id=" + principal.getName() + " not found")).getProfile();
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
            try {
                if (!Files.exists(root))
                    Files.createDirectory(root);
                Path pathToUserImage = root.resolve(user.getProfile().getAvatar());
                Files.deleteIfExists(pathToUserImage);

                image.transferTo(new File(root.resolve(filename).toUri()));
            } catch (IOException e) {
                throw new BadRequestException("Problems to file: " + e);
            }
            user.getProfile().setAvatar(filename);

            userRepository.save(user);

            return "Successful upload image";
        } else
            throw new BadRequestException("User: " + principal.getName() + " not found!");
    }
}
