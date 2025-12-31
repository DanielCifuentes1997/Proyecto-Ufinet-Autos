package com.ufinet.autos.application.service;

import com.ufinet.autos.domain.Car;
import com.ufinet.autos.domain.User;
import com.ufinet.autos.infrastructure.repository.CarRepository;
import com.ufinet.autos.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public Car createCar(Car car, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("El usuario especificado no existe."));

        if (carRepository.existsByLicensePlate(car.getLicensePlate())) {
            throw new IllegalArgumentException("Ya existe un auto registrado con la placa " + car.getLicensePlate());
        }

        car.setUser(user);
        return carRepository.save(car);
    }

    @Transactional(readOnly = true)
    public List<Car> getMyCars(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("El usuario especificado no existe."));
        return carRepository.findByUser(user);
    }

    @Transactional(readOnly = true)
    public Optional<Car> getCarById(Long id, String username) {
        Optional<Car> car = carRepository.findById(id);
        
        if (car.isPresent() && !car.get().getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("No tienes permiso para acceder a este vehículo.");
        }
        return car;
    }

    public Car updateCar(Long id, Car carDetails, String username) {
        Car car = getCarById(id, username)
                .orElseThrow(() -> new IllegalArgumentException("El auto no existe o no tienes permisos para modificarlo."));

        if (!car.getLicensePlate().equals(carDetails.getLicensePlate()) && 
            carRepository.existsByLicensePlate(carDetails.getLicensePlate())) {
            throw new IllegalArgumentException("La nueva placa ya está registrada en otro vehículo.");
        }

        car.setBrand(carDetails.getBrand());
        car.setModel(carDetails.getModel());
        car.setYear(carDetails.getYear());
        car.setLicensePlate(carDetails.getLicensePlate());
        car.setColor(carDetails.getColor());
        car.setPhotoUrl(carDetails.getPhotoUrl());

        return carRepository.save(car);
    }

    public void deleteCar(Long id, String username) {
        Car car = getCarById(id, username)
                .orElseThrow(() -> new IllegalArgumentException("El auto no existe o no tienes permisos para eliminarlo."));
        carRepository.delete(car);
    }
}