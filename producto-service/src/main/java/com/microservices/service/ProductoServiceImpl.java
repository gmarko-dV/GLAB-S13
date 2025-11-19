package com.microservices.service;

import com.microservices.model.Producto;
import com.microservices.repository.ProductoRepository;
import com.microservices.client.CategoriaClient;
import com.microservices.client.ProductoResponse;
import com.microservices.dto.Categoria;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaClient categoriaClient;

    public ProductoServiceImpl(ProductoRepository productoRepository, CategoriaClient categoriaClient) {
        this.productoRepository = productoRepository;
        this.categoriaClient = categoriaClient;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponse obtenerProducto(Long id) {
        // 1. Obtener el producto de la base de datos
        Optional<Producto> productoOptional = productoRepository.findById(id);

        if (productoOptional.isEmpty()) {
            return null; // O lanzar una excepción específica
        }

        Producto producto = productoOptional.get();

        // 2. Obtener la información de la categoría usando Feign Client
        // Feign automáticamente hace la llamada REST al microservicio 'categoria-service'
        Categoria categoria = categoriaClient.obtenerCategoria(producto.getCategoriaId());

        // 3. Construir y devolver la respuesta enriquecida (ProductoResponse)
        ProductoResponse response = new ProductoResponse();
        response.setProducto(producto);
        response.setCategoria(categoria);

        return response;
    }

    @Override
    @Transactional
    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public Producto actualizarProducto(Long id, Producto producto) {
        return productoRepository.findById(id)
                .map(p -> {
                    p.setNombre(producto.getNombre());
                    p.setPrecio(producto.getPrecio());
                    p.setCategoriaId(producto.getCategoriaId());
                    return productoRepository.save(p);
                })
                .orElse(null); // O lanzar excepción
    }

    @Override
    @Transactional
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }
}