package com.chessButBetter.chessButBetter.service.impl.OAuth;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.chessButBetter.chessButBetter.dto.OAuthUserInfo;
import com.chessButBetter.chessButBetter.service.OAuthService;

@Service("linkedinOAuthService")
public class LinkedinOAuthService implements OAuthService {

    @Value("${oauth.linkedin.client-id}")
    private String clientId;
    @Value("${oauth.linkedin.client-secret}")
    private String clientSecret;

    @Value("${oauth.redirect-uri}")
    private String redirectUri;

    @Override
    public String buildAuthorizationUrl() {
        return "https://www.linkedin.com/oauth/v2/authorization"
                + "?client_id=" + clientId
                + "&redirect_uri=" + redirectUri + "linkedin/callback"
                + "&response_type=code"
                + "&scope=email";
    }

    @Override
    public OAuthUserInfo getUserInfo(String code) {
        RestTemplate restTemplate = new RestTemplate();

        // 1. Exchange code for access token
        String tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri + "linkedin/callback");
        params.add("grant_type", "authorization_code");
        params.add("scope", "email");

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        ResponseEntity<Map<String, Object>> tokenResponse = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                tokenRequest,
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        if (!tokenResponse.getStatusCode().is2xxSuccessful() || tokenResponse.getBody() == null) {
            throw new RuntimeException("Failed to obtain access token from LinkedIn");
        }

        String accessToken = (String) tokenResponse.getBody().get("access_token");

        // 2. Fetch user info from LinkedIn
        String userInfoUrl = "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";

        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.setBearerAuth(accessToken);
        HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);

        ResponseEntity<Map<String, Object>> userInfoResponse = restTemplate.exchange(
                userInfoUrl,
                HttpMethod.GET,
                userInfoRequest,
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        if (!userInfoResponse.getStatusCode().is2xxSuccessful() || userInfoResponse.getBody() == null) {
            throw new RuntimeException("Failed to fetch user info from LinkedIn");
        }

        Map<String, Object> userInfo = userInfoResponse.getBody();

        // 3. Return a populated OAuthUserInfo
        return new OAuthUserInfo((String) userInfo.get("email"));
    }
}
