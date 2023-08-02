package com.claim.api.events.listener;

import com.claim.api.events.TaskCreationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;

public class TaskListener {

    private static final Logger logger = LoggerFactory.getLogger(UserListener.class);

    @EventListener(TaskCreationEvent.class)
    public void taskCreationListener(TaskCreationEvent event) {
        logger.info("[EVENT][TASK_CREATION] Создана задача в пространстве: {}, [TITLE] {}, [STATUS] {}",
                event.getDepartmentShortName(),
                event.getTitle(),
                event.getEventStatus());
    }
}
