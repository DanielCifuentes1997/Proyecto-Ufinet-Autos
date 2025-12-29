package com.ufinet.autos.infrastructure.repository;

import com.ufinet.autos.domain.Car;
import com.ufinet.autos.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {
    List<Car> findByUser(User user);
    boolean existsByLicensePlate(String licensePlate);
}