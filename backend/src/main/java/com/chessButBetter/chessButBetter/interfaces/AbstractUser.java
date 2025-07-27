package com.chessButBetter.chessButBetter.interfaces;

import com.chessButBetter.chessButBetter.entity.UserId;
import com.chessButBetter.chessButBetter.enums.RoleType;

public interface AbstractUser {
    UserId getId();

    void setId(UserId id);

    String getUsername();

    void setUsername(String username);

    RoleType getRole();
}
