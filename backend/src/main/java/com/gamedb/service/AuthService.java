package com.gamedb.service;

import com.gamedb.Entity.Role;
import com.gamedb.Entity.User;
import com.gamedb.dto.AuthRequest;
import com.gamedb.dto.AuthResponse;
import com.gamedb.repository.UserRepository;
import com.gamedb.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER); 
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getRole().toString());
    }

    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid credentials");
        }
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (user.getRole() == null) {
            user.setRole(Role.USER);
            userRepository.save(user);
        }
        String token = jwtUtil.generateToken(request.getUsername());
        System.out.println("Login - User role: " + user.getRole().toString());
        return new AuthResponse(token, user.getRole().toString());
    }
}
