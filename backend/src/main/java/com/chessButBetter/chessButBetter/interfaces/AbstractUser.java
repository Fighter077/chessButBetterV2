package com.chessButBetter.chessButBetter.interfaces;

import com.chessButBetter.chessButBetter.entity.UserId;
import com.chessButBetter.chessButBetter.enums.RoleType;

public interface AbstractUser {
    UserId getId();

    String getUsername();

    RoleType getRole();

    void setId(UserId id);

    void setUsername(String username);
}
