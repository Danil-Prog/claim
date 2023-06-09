package com.claim.api.repository;

import com.claim.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findById(Long id);

    Optional<User> deleteUserById(Long id);

    Page<User> findUsersByProfile_Department_Id(Long id, PageRequest pageRequest);

}
