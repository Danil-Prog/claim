package com.claim.api.events.listener;

import com.claim.api.events.CommentCreationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;

public class CommentListener {

    private final Logger logger = LoggerFactory.getLogger(CommentListener.class);

    @EventListener(CommentCreationEvent.class)
    public void commentCreationListener(CommentCreationEvent commentCreationEvent) {
        logger.info("[EVENT][COMMENT_CREATION] Добавлен комментарий к задаче: {}, [TEXT] {}, [USERNAME] {}",
                commentCreationEvent.getIssueId(),
                commentCreationEvent.getText(),
                commentCreationEvent.getUsername());
    }
}
