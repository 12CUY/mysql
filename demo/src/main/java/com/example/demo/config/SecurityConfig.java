package com.ejemplo.demo.security;

import com.ejemplo.demo.filter.JwtRequestFilter;
import com.ejemplo.demo.service.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/authenticate", "/register").permitAll() // Permitir el acceso sin autenticación
            .anyRequest().authenticated() // El resto de las rutas requieren autenticación
            .and()
            .exceptionHandling().authenticationEntryPoint((request, response, ex) -> response.sendError(401, "Unauthorized"));

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class); // Filtro JWT
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}