package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConfig implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static boolean isConnected = false;

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("SELECT 1");
            isConnected = true;
            System.out.println("✅ Conexión a la base de datos establecida correctamente.");
        } catch (Exception e) {
            isConnected = false;
            System.err.println("❌ Error al conectar con la base de datos: " + e.getMessage());
        }
    }

    public static boolean getConnectionStatus() {
        return isConnected;
    }
}
