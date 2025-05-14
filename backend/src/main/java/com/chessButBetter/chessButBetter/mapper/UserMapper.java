package com.chessButBetter.chessButBetter.mapper;

import com.chessButBetter.chessButBetter.dto.LoginDto;
import com.chessButBetter.chessButBetter.dto.RegisterDto;
import com.chessButBetter.chessButBetter.dto.UserDto;
import com.chessButBetter.chessButBetter.entity.User;
import com.chessButBetter.chessButBetter.entity.UserId;
import com.chessButBetter.chessButBetter.enums.RoleType;
import com.chessButBetter.chessButBetter.interfaces.AbstractUser;

public class UserMapper {

    public static User fromLoginDto(LoginDto loginDto) {
        User user = new User();
        user.setUsername(loginDto.getUsername());
        user.setPassword(loginDto.getPassword());
        user.setRole(RoleType.USER);
        return user;
    }

    public static User fromRegisterDto(RegisterDto registerDto) {
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(registerDto.getPassword());
        user.setEmail(registerDto.getEmail());
        user.setRole(RoleType.USER);
        return user;
    }

    public static User fromDto(UserDto userDto) {
        User user = new User();
        user.setId(new UserId(userDto.getId()));
        user.setUsername(userDto.getUsername());
        user.setRole(userDto.getRole());
        return user;
    }

    public static UserDto toDto(AbstractUser user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId().getUserId());
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());
        return userDto;
    }
}
