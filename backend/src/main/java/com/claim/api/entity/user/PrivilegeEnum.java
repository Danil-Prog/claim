package com.claim.api.entity.user;

public enum PrivilegeEnum {

    USER_CREATE,
    USER_UPDATE,
    USER_DELETE,

    SPACE_CREATE,
    SPACE_UPDATE,
    SPACE_CONTROL,
    SPACE_DELETED,

    ISSUE_CREATE,
    ISSUE_DELETE,
    ISSUE_MOVED,
    ISSUE_UPDATE,

    SITE_CONFIGURATION,
    SITE_MONITORING
}
