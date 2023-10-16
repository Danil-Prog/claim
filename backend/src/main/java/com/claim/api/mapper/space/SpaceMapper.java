package com.claim.api.mapper.space;

import com.claim.api.controller.dto.SpaceDto;
import com.claim.api.entity.space.Space;
import org.springframework.stereotype.Service;

@Service
public class SpaceMapper {

    public static SpaceDto toSpaceDto(Space space) {
        if (space == null)
            return null;
        return new SpaceDto(space.getId(), space.getName(), space.getShortName());
    }
}
