package com.claim.api.events.listener;

import com.claim.api.events.IssueCreationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;

public class IssueListener {

    private static final Logger logger = LoggerFactory.getLogger(UserListener.class);

    @EventListener(IssueCreationEvent.class)
    public void taskCreationListener(IssueCreationEvent event) {
        logger.info("[EVENT][TASK_CREATION] Создана задача в пространстве: {}, [TITLE] {}, [STATUS] {}",
                event.getDepartmentShortName(),
                event.getTitle(),
                event.getEventStatus());
    }
}
