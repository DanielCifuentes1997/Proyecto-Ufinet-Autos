package com.ufinet.autos.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Entity
@Table(name = "cars")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La marca es obligatoria")
    @Column(nullable = false, length = 50)
    private String brand;

    @NotBlank(message = "El modelo es obligatorio")
    @Column(nullable = false, length = 50)
    private String model;

    @NotNull(message = "El año es obligatorio")
    @Min(value = 1886, message = "El año no es válido")
    @Column(nullable = false, columnDefinition = "SMALLINT")
    private Integer year;

    @NotBlank(message = "La placa es obligatoria")
    @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "La placa contiene caracteres inválidos")
    @Column(name = "license_plate", nullable = false, unique = true, length = 20)
    private String licensePlate;

    @NotBlank(message = "El color es obligatorio")
    @Column(nullable = false, length = 30)
    private String color;

    @Column(name = "photo_url")
    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
}