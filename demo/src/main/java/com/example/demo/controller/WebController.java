package com.example.demo.controller;

import com.example.demo.Repository.UsuarioRepository;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;

@Controller
public class WebController {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private PasswordEncoder encoder;

    // Eliminar el método con la ruta /login
    // @GetMapping("/login")
    // public String login() {
    //     return "login";
    // }

}
