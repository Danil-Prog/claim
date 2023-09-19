package com.claim.api.repository;

import com.claim.api.entity.Attachment;
import com.claim.api.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    Optional<Attachment> findAttachmentByName(String filename);
    Page<Attachment> findAttachmentByUploaded(PageRequest pageRequest, Profile profile);
}
