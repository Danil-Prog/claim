package com.claim.api.service;

import com.claim.api.entity.attachment.Attachment;
import com.claim.api.entity.attachment.AttachmentType;
import com.claim.api.entity.space.Space;
import com.claim.api.entity.user.User;
import com.claim.api.exception.BadRequestException;
import com.claim.api.repository.SpaceRepository;
import com.claim.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

@Service
public class SpaceService {

    private static final Logger logger = LoggerFactory.getLogger(SpaceService.class);
    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;
    private final AttachmentService attachmentService;
    private final UserService userService;

    @Autowired
    public SpaceService(SpaceRepository spaceRepository,
                        UserRepository userRepository,
                        AttachmentService attachmentService, UserService userService) {
        this.spaceRepository = spaceRepository;
        this.userRepository = userRepository;
        this.attachmentService = attachmentService;
        this.userService = userService;
    }

    public Page<Space> getSpacesList(PageRequest pageRequest) {
        return spaceRepository.findAll(pageRequest);
    }

    public Space getSpaceById(Long id) {
        Optional<Space> spaceOptional = spaceRepository.findById(id);
        if (spaceOptional.isPresent()) {
            logger.info("A space with id [{}] was received", id);
            return spaceOptional.get();
        }
        throw new BadRequestException("Space with id [" + id + "] does not exist");
    }

    public Space createSpace(Space space) {
        if (space.getName() != null) {
            logger.info("Space name '{}' successfully created", space.getName());
            return spaceRepository.save(space);
        }
        throw new BadRequestException("Space name must not be empty");
    }

    public Space updateSpace(Long id, Space space) {
        Space searchSpace = this.getSpaceById(id);
        logger.info("Updated space named [{}]. New value [{}]", searchSpace.getName(), space.getName());
        return spaceRepository.save(space);
    }

    public void removeSpace(Long id) {
        spaceRepository.findById(id).ifPresent(spaceRepository::delete);
        logger.info("Space with id [{}] successfully deleted", id);
    }

    public Page<User> getSpaceUsers(Long id, PageRequest pageRequest) {
        Space space = this.getSpaceById(id);
        return userRepository.findUsersByProfile_Space_Id(space.getId(), pageRequest);
    }

    public void updateSpaceImage(Long id, MultipartFile image, Principal principal) {
        Space space = this.getSpaceById(id);
        User user = this.userService.getUserByUsername(principal.getName());
        String filename = UUID.randomUUID() + image.getOriginalFilename();

        Attachment attachment = new Attachment(filename,
                image.getOriginalFilename(),
                AttachmentType.SPACE_IMAGE,
                space.getId() + "/images",
                image.getSize(),
                user.getProfile(),
                image.getContentType());

        if (attachmentService.save(image, attachment)) {
            space.setImage(filename);
            space.getAttachments().add(attachment);
            spaceRepository.save(space);
        }
    }
}
