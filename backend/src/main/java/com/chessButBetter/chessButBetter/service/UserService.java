package com.chessButBetter.chessButBetter.service;

import com.chessButBetter.chessButBetter.entity.User;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    User createUser(User user);

    User deleteUser(Long id);

    User updateUser(User user);
}
