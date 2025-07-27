package com.chessButBetter.chessButBetter.service;

import com.chessButBetter.chessButBetter.dto.OAuthUserInfo;

public interface OAuthService {
    String buildAuthorizationUrl();
    OAuthUserInfo getUserInfo(String authorizationCode);
}