package com.claim.api.mapper;

import com.claim.api.controller.dto.UserDto;
import com.claim.api.entity.user.User;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    public UserDto toUserDto(User user) {
        if (user == null)
            return null;
        return new UserDto(user.getId(), user.getUsername(), user.getRole(), user.getProfile());
    }
}
