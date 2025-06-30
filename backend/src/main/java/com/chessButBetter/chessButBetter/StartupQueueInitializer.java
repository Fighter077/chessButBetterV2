package com.chessButBetter.chessButBetter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.chessButBetter.chessButBetter.repositories.QueueRepository;

import jakarta.annotation.PostConstruct;


@Component
public class StartupQueueInitializer {

    private static final Logger logger = LoggerFactory.getLogger(StartupQueueInitializer.class);

    @Value("${admin.password}")
    private String adminPassword;

    private final QueueRepository queueRepository;

    public StartupQueueInitializer(QueueRepository queueRepository) {
        this.queueRepository = queueRepository;
    }

    @PostConstruct
    public void init() {
        logger.info("Clearing the queue at startup...");
        queueRepository.deleteAll();
        logger.info("Queue clearing complete.");
    }
}
