package com.example.demo.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Repository.UsuarioRepository;
import com.example.demo.entity.Usuario;

@Service
public class UsuarioService {
    @Autowired private UsuarioRepository usuarioRepository;

    public Usuario guardar(Usuario u) {
        return usuarioRepository.save(u);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}

