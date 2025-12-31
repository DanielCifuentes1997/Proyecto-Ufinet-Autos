package com.ufinet.autos.application.service;

import com.ufinet.autos.application.dto.auth.AuthenticationRequest;
import com.ufinet.autos.application.dto.auth.AuthenticationResponse;
import com.ufinet.autos.application.dto.auth.RegisterRequest;
import com.ufinet.autos.domain.User;
import com.ufinet.autos.infrastructure.repository.UserRepository;
import com.ufinet.autos.infrastructure.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository repository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService service;

    @Test
    void register_WhenNewUser_ShouldReturnToken() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("nuevo.usuario");
        request.setPassword("123456");
        request.setFullName("Usuario Nuevo");

        when(repository.findByUsername(request.getUsername())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPass");
        when(jwtService.generateToken(any())).thenReturn("mock-token");

        AuthenticationResponse response = service.register(request);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
        verify(repository).save(any(User.class));
    }

    @Test
    void register_WhenUserExists_ShouldThrowException() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("usuario.existente");

        when(repository.findByUsername(request.getUsername())).thenReturn(Optional.of(new User()));

        assertThrows(IllegalArgumentException.class, () -> service.register(request));
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void authenticate_WhenValidCredentials_ShouldReturnToken() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setUsername("usuario.valido");
        request.setPassword("password");

        User mockUser = new User();
        mockUser.setUsername("usuario.valido");
        mockUser.setPassword("encodedPass");

        when(repository.findByUsername(request.getUsername())).thenReturn(Optional.of(mockUser));
        when(jwtService.generateToken(any())).thenReturn("mock-token");

        AuthenticationResponse response = service.authenticate(request);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
    }
}