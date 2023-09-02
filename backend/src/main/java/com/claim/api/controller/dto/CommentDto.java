package com.claim.api.controller.dto;

import java.util.Date;

public record CommentDto(Long id,
                         String text,
                         UserDto sender,
                         Date created) {
}
