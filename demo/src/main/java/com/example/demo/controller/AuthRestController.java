package com.example.demo.controller;

import com.example.demo.Repository.UsuarioRepository;
import com.example.demo.config.JwtUtil;
import com.example.demo.dto.AuthRequest;
import com.example.demo.entity.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // Método para obtener el usuario por email
    @GetMapping("/usuario/{email}")
    public ResponseEntity<Usuario> obtenerUsuarioPorEmail(@PathVariable String email, @RequestHeader("Authorization") String token) {
        if (!jwtUtil.isValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Usuario usuario = usuarioRepo.findByEmail(email).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getContrasena())
            );

            Usuario usuario = usuarioRepo.findByEmail(request.getEmail()).orElseThrow();

            UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .builder()
                    .username(usuario.getEmail())
                    .password(usuario.getContrasena())
                    .roles(usuario.getRol().getNombre())
                    .build();

            String token = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(token);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }

    @PostMapping("/registro")
    public String registro(@RequestBody Usuario u) {
        u.setContrasena(encoder.encode(u.getContrasena()));
        usuarioRepo.save(u);
        return "Usuario registrado";
    }
}

