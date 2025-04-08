package com.example.demo.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Repository.UsuarioRepository;
import com.example.demo.entity.Usuario;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repo;

    @Autowired
    private PasswordEncoder encoder;

    public void guardar(Usuario usuario) {
        usuario.setContrasena(encoder.encode(usuario.getContrasena()));
        repo.save(usuario);
    }

    public Usuario obtenerPorEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }
}


