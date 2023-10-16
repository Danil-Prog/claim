package com.claim.api.mapper.user;

import com.claim.api.controller.dto.UserDto;
import com.claim.api.entity.user.User;
import com.claim.api.mapper.space.SpaceMapper;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    public UserDto toUserDto(User user) {
        if (user == null)
            return null;
        return new UserDto(user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getProfile().getFirstname(),
                user.getProfile().getLastname(),
                user.getProfile().getEmail(),
                user.getProfile().getPhone(),
                user.getProfile().getCabinet(),
                user.getProfile().getPc(),
                user.getProfile().getAvatar(),
                SpaceMapper.toSpaceDto(user.getProfile().getSpace()));
    }
}
