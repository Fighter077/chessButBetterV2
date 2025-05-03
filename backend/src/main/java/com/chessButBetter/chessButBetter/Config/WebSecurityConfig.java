package com.chessButBetter.chessButBetter.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

@Configuration
public class WebSecurityConfig {

    private final Environment environment;

    public WebSecurityConfig(Environment environment) {
        this.environment = environment;
    }

    @Value("${server.port}")
    int port;

    @SuppressWarnings("removal")
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        if (isProduction()) {
            http.requiresChannel()
                .requestMatchers(r -> r.getHeader("X-Forwarded-Proto") != null)
                .requiresSecure();
        }
        return http.build();
    }

    @Component
    public static class CustomTomcatContainer implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

        private final Environment environment;

        public CustomTomcatContainer(Environment environment) {
            this.environment = environment;
        }

        @Override
        public void customize(TomcatServletWebServerFactory factory) {
            if (isProduction()) {
                factory.addAdditionalTomcatConnectors(redirectHttpToHttps());
            }
        }

        @SuppressWarnings("deprecation")
        private boolean isProduction() {
            return environment.acceptsProfiles("prod");
        }

        private org.apache.catalina.connector.Connector redirectHttpToHttps() {
            org.apache.catalina.connector.Connector connector = new org.apache.catalina.connector.Connector();
            connector.setScheme("http");
            connector.setPort(8080); // HTTP Port
            connector.setSecure(false);
            connector.setRedirectPort(8443); // Redirect to HTTPS only in production
            return connector;
        }
    }

    @SuppressWarnings("deprecation")
    private boolean isProduction() {
        return environment.acceptsProfiles("prod");
    }
}
