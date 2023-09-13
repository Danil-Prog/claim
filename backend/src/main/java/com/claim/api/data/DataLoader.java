package com.claim.api.data;

import com.github.javafaker.Faker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/*
* Loads test data for spring.profile=dev, into the test database
* */
@Service
@Profile("dev")
public class DataLoader implements CommandLineRunner {
    private final Logger logger = LoggerFactory.getLogger(DataLoader.class);
    private final Faker faker = new Faker();
    public DataLoader() {
        logger.warn("[DATA_LOADER] - Data loader in active. Load test data...");
    }

    @Override
    public void run(String... args) throws Exception {

    }
}
