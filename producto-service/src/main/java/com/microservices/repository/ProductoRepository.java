package com.microservices.repository;

import com.microservices.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Spring Data JPA provee los métodos CRUD (save, findById, findAll, delete, etc.)
}