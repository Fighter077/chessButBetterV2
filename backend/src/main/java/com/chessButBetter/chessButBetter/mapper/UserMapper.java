package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.LoginDto;
import com.chessButBetter.chessButBetter.dto.UserDto;
import com.chessButBetter.chessButBetter.entity.User;

public class UserMapper {

    public static User fromLoginDto(LoginDto loginDto) {
        User user = new User();
        user.setUsername(loginDto.getUsername());
        user.setPassword(loginDto.getPassword());
        return user;
    }

    public static User fromDto(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        return user;
    }
}
