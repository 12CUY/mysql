package taxationland.controller;

import taxationland.dto.*;
import taxationland.model.*;
import taxationland.repository.*;
import taxationland.security.jwt.JwtUtils;
import taxationland.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            String usernameOrEmail = loginRequest.getUsernameOrEmail();
            User user = userRepository.findByUsernameOrEmail(usernameOrEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();        
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
                    
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid username/email or password"));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Authentication failed"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Username is already taken!"));
            }

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }

            // Create new user's account
            User user = new User(
                    signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    passwordEncoder.encode(signUpRequest.getPassword()));

            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role USER not found. Initialize database first."));
            roles.add(userRole);

            user.setRoles(roles);
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
            
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}