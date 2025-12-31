package com.ufinet.autos.infrastructure.repository;

import com.ufinet.autos.domain.Car;
import com.ufinet.autos.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {
    
    List<Car> findByUser(User user);
    
    boolean existsByLicensePlate(String licensePlate);

    @Query("SELECT c FROM Car c WHERE c.user = :user AND " +
           "(LOWER(c.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.model) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.licensePlate) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "CAST(c.year AS string) LIKE CONCAT('%', :keyword, '%'))")
    List<Car> searchCars(@Param("keyword") String keyword, @Param("user") User user);
}