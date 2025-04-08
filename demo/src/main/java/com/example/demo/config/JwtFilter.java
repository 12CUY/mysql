package com.example.demo.config;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // This is the method we are overriding, required for the filter
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Get the token from the Authorization header
        String token = request.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // Remove "Bearer " from the beginning

            // Validate the token and get the claims
            if (jwtUtil.isValid(token)) {
                Claims claims = jwtUtil.getClaims(token); // Get the claims from the token
                String email = claims.getSubject(); // Assuming the email is in the subject of the token

                // Here you can configure the user in the security context
                SecurityContextHolder.getContext().setAuthentication(new JwtAuthenticationToken(email));
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

    // Removed duplicate and incorrect method
}
