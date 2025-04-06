package com.example.demo.controller;

import com.example.demo.config.DatabaseConfig;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/conexion")
public class ConexionController {

    @GetMapping
    public Map<String, String> verificarConexion() {
        Map<String, String> response = new HashMap<>();
        if (DatabaseConfig.getConnectionStatus()) {
            response.put("mensaje", "✅ Conexión a la base de datos establecida correctamente.");
        } else {
            response.put("mensaje", "❌ Error al conectar con la base de datos.");
        }
        return response;
    }
}
