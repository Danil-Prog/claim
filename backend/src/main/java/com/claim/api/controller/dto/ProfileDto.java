package com.claim.api.controller.dto;

import com.claim.api.entity.Profile;

public record ProfileDto (Profile profile, byte[] userAvatar){

}
