package com.ufinet.autos.infrastructure.controller;

import com.ufinet.autos.application.service.CarService;
import com.ufinet.autos.domain.Car;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @PostMapping
    public ResponseEntity<Car> create(@RequestBody Car car, Principal principal) {
        return ResponseEntity.ok(carService.createCar(car, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Car>> getMyCars(Principal principal) {
        return ResponseEntity.ok(carService.getMyCars(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getById(@PathVariable Long id, Principal principal) {
        return carService.getCarById(id, principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> update(@PathVariable Long id, @RequestBody Car car, Principal principal) {
        return ResponseEntity.ok(carService.updateCar(id, car, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        carService.deleteCar(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}