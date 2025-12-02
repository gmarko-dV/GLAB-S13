import { useState, useEffect } from 'react'
import { productoService, categoriaService } from '../services/api'
import './Productos.css'

function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoriaId: '',
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [productosData, categoriasData] = await Promise.all([
        productoService.getAll(),
        categoriaService.getAll(),
      ])
      setProductos(productosData || [])
      setCategorias(categoriasData || [])
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.nombre || formData.nombre.trim() === '') {
      errors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres'
    }

    if (!formData.precio || formData.precio === '') {
      errors.precio = 'El precio es requerido'
    } else {
      const precio = parseFloat(formData.precio)
      if (isNaN(precio) || precio <= 0) {
        errors.precio = 'El precio debe ser un número mayor a 0'
      }
    }

    if (!formData.categoriaId || formData.categoriaId === '') {
      errors.categoriaId = 'La categoría es requerida'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const productoData = {
        nombre: formData.nombre.trim(),
        precio: parseFloat(formData.precio),
        categoriaId: parseInt(formData.categoriaId),
      }

      if (editingId) {
        await productoService.update(editingId, productoData)
      } else {
        await productoService.create(productoData)
      }

      resetForm()
      loadData()
    } catch (err) {
      setError('Error al guardar el producto: ' + err.message)
    }
  }

  const handleEdit = (producto) => {
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
      categoriaId: producto.categoriaId.toString(),
    })
    setEditingId(producto.id)
    setShowForm(true)
    setFormErrors({})
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return
    }

    try {
      await productoService.delete(id)
      loadData()
    } catch (err) {
      setError('Error al eliminar el producto: ' + err.message)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      precio: '',
      categoriaId: '',
    })
    setEditingId(null)
    setShowForm(false)
    setFormErrors({})
  }

  const getCategoriaNombre = (categoriaId) => {
    if (!categoriaId) return 'Sin categoría'
    const categoria = categorias.find(c => c.id === categoriaId)
    return categoria ? categoria.nombre : `Categoría ID: ${categoriaId} (no encontrada)`
  }

  const tieneCategoriaValida = (categoriaId) => {
    if (!categoriaId) return false
    return categorias.some(c => c.id === categoriaId)
  }

  return (
    <div className="productos-container">
      <div className="page-header">
        <h2>Productos</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {!loading && productos.length > 0 && productos.some(p => !tieneCategoriaValida(p.categoriaId)) && (
        <div className="alert alert-warning">
          <strong>⚠️ Advertencia:</strong> Algunos productos tienen categorías que no existen. 
          Por favor, crea las categorías necesarias o actualiza los productos.
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={formErrors.nombre ? 'error' : ''}
              />
              {formErrors.nombre && (
                <span className="error-message">{formErrors.nombre}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio *</label>
              <input
                type="number"
                id="precio"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className={formErrors.precio ? 'error' : ''}
              />
              {formErrors.precio && (
                <span className="error-message">{formErrors.precio}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="categoriaId">Categoría *</label>
              <select
                id="categoriaId"
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                className={formErrors.categoriaId ? 'error' : ''}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {formErrors.categoriaId && (
                <span className="error-message">{formErrors.categoriaId}</span>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : productos.length === 0 ? (
        <div className="empty-state">
          <p>No hay productos registrados</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>s/ {producto.precio?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={!tieneCategoriaValida(producto.categoriaId) ? 'categoria-invalida' : ''}>
                      {getCategoriaNombre(producto.categoriaId)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => handleEdit(producto)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDelete(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Productos

