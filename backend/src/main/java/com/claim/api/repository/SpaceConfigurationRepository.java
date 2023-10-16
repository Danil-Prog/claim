package com.claim.api.repository;

import com.claim.api.entity.space.SpaceConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpaceConfigurationRepository extends JpaRepository<SpaceConfiguration, Long> {
}
