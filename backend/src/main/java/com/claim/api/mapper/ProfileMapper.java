package com.claim.api.mapper;

import com.claim.api.controller.dto.ProfileDto;
import com.claim.api.entity.Profile;
import org.springframework.stereotype.Service;

@Service
public class ProfileMapper {

    public ProfileDto toProfileDto(Profile profile, byte[] userAvatar) {
        if (profile == null || userAvatar == null)
            return null;
        return new ProfileDto(profile, userAvatar);
    }
}
