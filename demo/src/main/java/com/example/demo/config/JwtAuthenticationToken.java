package com.example.demo.config;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    private final String principal;

    public JwtAuthenticationToken(String principal) {
        super(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        this.principal = principal;
        setAuthenticated(true); // Asume que el token es válido
    }

    @Override
    public Object getCredentials() {
        return null; // No es necesario en este caso
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }
}
