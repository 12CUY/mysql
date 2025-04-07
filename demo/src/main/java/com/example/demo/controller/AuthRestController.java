package com.example.demo.controller;

import com.example.demo.Repository.UsuarioRepository;
import com.example.demo.config.JwtUtil;
import com.example.demo.dto.AuthRequest;
import com.example.demo.entity.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/login")
    @CrossOrigin(origins = "*")
    public String login(@RequestBody AuthRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getContrasena()));

        UserDetails user = usuarioRepo.findByEmail(request.getEmail())
                .map(u -> org.springframework.security.core.userdetails.User
                        .builder()
                        .username(u.getEmail())
                        .password(u.getContrasena())
                        .roles(u.getRol().getNombre())
                        .build())
                .orElseThrow();

        return jwtUtil.generateToken(user);
    }

    @PostMapping("/registro")
    public String registro(@RequestBody Usuario u) {
        u.setContrasena(encoder.encode(u.getContrasena())); // Encriptar la contraseña
        usuarioRepo.save(u); // Guardar el usuario
        return "Usuario registrado";
    }
}
