package com.ejemplo.demo.controller;

import com.ejemplo.demo.service.JwtTokenService;
import com.ejemplo.demo.service.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    @PostMapping("/authenticate")
    public String authenticate(@RequestParam String username, @RequestParam String password) {
        // Validar usuario y contraseña (se puede integrar con una base de datos)
        if (jwtUserDetailsService.validateUser(username, password)) {
            return jwtTokenService.generateToken(username);
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
