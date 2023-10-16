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

    @Autowired
    public SpaceService(SpaceRepository spaceRepository,
                        UserRepository userRepository,
                        AttachmentService attachmentService) {
        this.spaceRepository = spaceRepository;
        this.userRepository = userRepository;
        this.attachmentService = attachmentService;
    }

    public Page<Space> getSpacesList(PageRequest pageRequest) {
        return spaceRepository.findAll(pageRequest);
    }

    public Space getSpaceById(Long id) {
        Optional<Space> departmentOptional = spaceRepository.findById(id);
        if (departmentOptional.isPresent()) {
            logger.info("A department with id '{}' was received", id);
            return departmentOptional.get();
        }
        throw new BadRequestException("Department with id=" + id + " does not exist");
    }

    public Space createSpace(Space space) {
        if (space.getName() != null) {
            logger.info("Space name '{}' successfully created", space.getName());
            return spaceRepository.save(space);
        }
        throw new BadRequestException("Space name must not be empty");
    }

    public Space updateSpace(Long id, Space space) {
        Optional<Space> departmentOptional = spaceRepository.findById(id);
        if (departmentOptional.isPresent()) {
            logger.info("Updated space named '{}'. New value '{}'", departmentOptional.get().getName(), space.getName());
            return spaceRepository.save(space);
        }
        logger.error("Error updating space. Space with id= '{}' does not exist", id);
        throw new BadRequestException("Space with id=" + id + " does not exist");
    }

    public void removeSpace(Long id) {
        spaceRepository.findById(id).ifPresent(spaceRepository::delete);
        logger.info("Space with id= {} successfully deleted", id);
    }

    public Page<User> getSpaceUsers(Long id, PageRequest pageRequest) {
        Optional<Space> departmentOptional = spaceRepository.findById(id);
        if (departmentOptional.isPresent()) {
            return userRepository.findUsersByProfile_Space_Id(id, pageRequest);
        }
        throw new BadRequestException("Space with id=" + id + " does not exist");
    }

    public void updateSpaceImage(Long id, MultipartFile image, Principal principal) {
        Optional<Space> optionalDepartment = spaceRepository.findById(id);
        if (optionalDepartment.isPresent()) {
            User user = userRepository.findByUsername(principal.getName()).get();
            Space space = optionalDepartment.get();
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
        } else
            throw new BadRequestException("Space with id: " + id + " not found");
    }
}
