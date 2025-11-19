package com.microservices.service;

import com.microservices.model.Producto;
import com.microservices.client.ProductoResponse;
import java.util.List;

public interface ProductoService {

    List<Producto> listarProductos();

    ProductoResponse obtenerProducto(Long id);

    Producto guardarProducto(Producto producto);

    Producto actualizarProducto(Long id, Producto producto);

    void eliminarProducto(Long id);
}