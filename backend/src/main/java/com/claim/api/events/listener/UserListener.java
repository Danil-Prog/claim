package com.claim.api.events.listener;

import com.claim.api.events.UserCreationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class UserListener {

    private static final Logger logger = LoggerFactory.getLogger(UserListener.class);

    @EventListener(UserCreationEvent.class)
    public void userCreationListener(UserCreationEvent event) {
        logger.info("[EVENT][USER_CREATION] username: '{}', [STATUS] {} ", event.getUsername(), event.getEventStatus());
    }
}
