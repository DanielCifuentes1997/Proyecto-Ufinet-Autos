package com.ufinet.autos.application.service;

import com.ufinet.autos.domain.Car;
import com.ufinet.autos.domain.User;
import com.ufinet.autos.infrastructure.repository.CarRepository;
import com.ufinet.autos.infrastructure.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @Mock
    private CarRepository carRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CarService carService;

    @Test
    void createCar_WhenValidData_ShouldSaveCar() {
        String username = "juan.perez";
        User mockUser = new User();
        mockUser.setUsername(username);
        
        Car mockCar = new Car();
        mockCar.setLicensePlate("ABC-123");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(carRepository.existsByLicensePlate("ABC-123")).thenReturn(false);
        when(carRepository.save(any(Car.class))).thenReturn(mockCar);

        Car savedCar = carService.createCar(mockCar, username);

        assertNotNull(savedCar);
        assertEquals(mockUser, savedCar.getUser());
        verify(carRepository).save(any(Car.class));
    }

    @Test
    void createCar_WhenLicensePlateExists_ShouldThrowException() {
        String username = "juan.perez";
        User mockUser = new User();
        mockUser.setUsername(username);

        Car mockCar = new Car();
        mockCar.setLicensePlate("ABC-123");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(carRepository.existsByLicensePlate("ABC-123")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> {
            carService.createCar(mockCar, username);
        });

        verify(carRepository, never()).save(any(Car.class));
    }

    @Test
    void createCar_WhenUserNotFound_ShouldThrowException() {
        String username = "fantasma";
        Car mockCar = new Car();

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            carService.createCar(mockCar, username);
        });
    }
}