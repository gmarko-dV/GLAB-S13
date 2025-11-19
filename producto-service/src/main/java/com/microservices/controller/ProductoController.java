package com.microservices.controller;

import com.microservices.model.Producto;
import com.microservices.client.ProductoResponse;
import com.microservices.service.ProductoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // LISTAR TODOS LOS PRODUCTOS
    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        List<Producto> productos = productoService.listarProductos();
        if (productos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(productos);
    }

    // BUSCAR PRODUCTO POR ID (Devuelve la respuesta enriquecida)
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> obtenerProducto(@PathVariable Long id) {
        ProductoResponse productoResponse = productoService.obtenerProducto(id);

        if (productoResponse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productoResponse);
    }

    // CREAR PRODUCTO
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.guardarProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }

    // ACTUALIZAR PRODUCTO
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        Producto productoActualizado = productoService.actualizarProducto(id, producto);

        if (productoActualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productoActualizado);
    }

    // ELIMINAR PRODUCTO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}