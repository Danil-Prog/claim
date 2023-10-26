package com.claim.api.controller;

import com.claim.api.entity.space.Space;
import com.claim.api.entity.user.User;
import com.claim.api.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

import static com.claim.api.config.SwaggerConfig.JWT_AUTH_SECURITY_SCHEME;

@RestController
@RequestMapping("/api/v1/space")
public class SpaceController {

    private final SpaceService spaceService;

    @Autowired
    public SpaceController(SpaceService spaceService) {
        this.spaceService = spaceService;
    }

    @GetMapping
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<Page<Space>> getSpaces(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size,
                                                 @RequestParam(defaultValue = "ASC") String sortBy,
                                                 @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        return ResponseEntity.ok(spaceService.getSpacesList(pageRequest));
    }

    @GetMapping("/{spaceId}/users")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<Page<User>> getSpaceUsers(@PathVariable Long spaceId,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size,
                                                         @RequestParam(defaultValue = "ASC") String sortBy,
                                                         @RequestParam(defaultValue = "id") String[] sort) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortBy), sort));
        return ResponseEntity.ok(spaceService.getSpaceUsers(spaceId, pageRequest));
    }

    @GetMapping("/{spaceId}")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<Space> getSpaceById(@PathVariable Long spaceId) {
        return ResponseEntity.ok(spaceService.getSpaceById(spaceId));
    }


    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<Space> createSpace(@RequestBody Space space) {
        return ResponseEntity.ok(spaceService.createSpace(space));
    }

    @DeleteMapping("/{spaceId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SPACE_DELETE')")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public void removeSpace(@PathVariable Long spaceId) {
        spaceService.removeSpace(spaceId);
    }

    @PutMapping("/{spaceId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_MANEGER', 'SPACE_UPDATE')")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public ResponseEntity<Space> updateSpace(@PathVariable Long spaceId, Space space) {
        return ResponseEntity.ok(spaceService.updateSpace(spaceId, space));
    }

    @PostMapping("/{spaceId}/image")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_MANEGER', 'SPACE_UPDATE')")
    @Operation(security = {@SecurityRequirement(name = JWT_AUTH_SECURITY_SCHEME)})
    public void updateSpaceImage(@PathVariable Long spaceId, @RequestParam("image") MultipartFile image, Principal principal) {
        spaceService.updateSpaceImage(spaceId, image, principal);
    }

}
