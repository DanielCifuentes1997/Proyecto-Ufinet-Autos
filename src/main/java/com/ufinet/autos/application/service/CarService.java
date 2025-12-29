package com.ufinet.autos.application.service;

import com.ufinet.autos.domain.Car;
import com.ufinet.autos.domain.User;
import com.ufinet.autos.infrastructure.repository.CarRepository;
import com.ufinet.autos.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public Car createCar(Car car, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (carRepository.existsByLicensePlate(car.getLicensePlate())) {
            throw new RuntimeException("Ya existe un auto con la placa " + car.getLicensePlate());
        }

        car.setUser(user);
        return carRepository.save(car);
    }

    public List<Car> getMyCars(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return carRepository.findByUser(user);
    }

    public Optional<Car> getCarById(Long id, String username) {
        Optional<Car> car = carRepository.findById(id);
        if (car.isPresent() && !car.get().getUser().getUsername().equals(username)) {
            throw new RuntimeException("No tienes permiso para ver este auto");
        }
        return car;
    }

    public Car updateCar(Long id, Car carDetails, String username) {
        Car car = getCarById(id, username)
                .orElseThrow(() -> new RuntimeException("Auto no encontrado o no tienes permiso"));

        car.setBrand(carDetails.getBrand());
        car.setModel(carDetails.getModel());
        car.setYear(carDetails.getYear());
        car.setLicensePlate(carDetails.getLicensePlate());
        car.setColor(carDetails.getColor());

        return carRepository.save(car);
    }

    public void deleteCar(Long id, String username) {
        Car car = getCarById(id, username)
                .orElseThrow(() -> new RuntimeException("Auto no encontrado o no tienes permiso"));
        carRepository.delete(car);
    }
}