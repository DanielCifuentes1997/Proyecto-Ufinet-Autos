package com.ufinet.autos.infrastructure.repository;

import com.ufinet.autos.domain.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {
    List<Car> findByUserId(Long userId);
    boolean existsByLicensePlate(String licensePlate);
}