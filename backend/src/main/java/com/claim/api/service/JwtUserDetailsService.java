package com.claim.api.service;

import com.claim.api.entity.user.PrivilegeEnum;
import com.claim.api.entity.user.User;
import com.claim.api.exception.UserNotFoundException;
import com.claim.api.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public JwtUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException("User " + username + " not found"));
        List<SimpleGrantedAuthority> roles = this.getAuthorities(user);
        System.out.println(roles);
        return new JwtUserDetails(user.getId(), username, user.getPassword(), roles);
    }

    private List<SimpleGrantedAuthority> getAuthorities(User user) {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRights().getAuthority()));
        for (PrivilegeEnum privilege : user.getRights().getPrivileges())
            authorities.add(new SimpleGrantedAuthority(privilege.name()));

        return authorities;
    }
}
