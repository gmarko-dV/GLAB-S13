package com.microservices.controller;

import com.microservices.model.Categoria;
import com.microservices.repository.CategoriaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository repository;

    // Inyección de dependencias (constructor)
    public CategoriaController(CategoriaRepository repository) {
        this.repository = repository;
    }

    // LISTAR TODAS LAS CATEGORIAS
    @GetMapping
    public List<Categoria> listar() {
        return repository.findAll();
    }

    // BUSCAR CATEGORIA POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerPorId(@PathVariable Long id) {
        return repository.findById(id)
                // Si existe -> 200 OK
                .map(categoria -> ResponseEntity.ok(categoria))
                // o Si no existe -> 404 Not Found
                .orElse(ResponseEntity.notFound().build());
    }

    // CREAR CATEGORIA
    @PostMapping
    public Categoria crear(@RequestBody Categoria categoria) {
        return repository.save(categoria);
    }

    // ACTUALIZAR CATEGORIA
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(@PathVariable Long id, @RequestBody Categoria datosCategoria) {
        return repository.findById(id)
                .map(categoriaExistente -> {
                    categoriaExistente.setNombre(datosCategoria.getNombre());
                    return ResponseEntity.ok(repository.save(categoriaExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ELIMINAR CATEGORIA
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}