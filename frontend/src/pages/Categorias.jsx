import { useState, useEffect } from 'react'
import { categoriaService } from '../services/api'
import './Categorias.css'

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ nombre: '' })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoriaService.getAll()
      setCategorias(data || [])
    } catch (err) {
      setError('Error al cargar las categorías: ' + err.message)
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

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const categoriaData = {
        nombre: formData.nombre.trim(),
      }

      if (editingId) {
        await categoriaService.update(editingId, categoriaData)
      } else {
        await categoriaService.create(categoriaData)
      }

      resetForm()
      loadCategorias()
    } catch (err) {
      setError('Error al guardar la categoría: ' + err.message)
    }
  }

  const handleEdit = (categoria) => {
    setFormData({ nombre: categoria.nombre })
    setEditingId(categoria.id)
    setShowForm(true)
    setFormErrors({})
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return
    }

    try {
      await categoriaService.delete(id)
      loadCategorias()
    } catch (err) {
      setError('Error al eliminar la categoría: ' + err.message)
    }
  }

  const resetForm = () => {
    setFormData({ nombre: '' })
    setEditingId(null)
    setShowForm(false)
    setFormErrors({})
  }

  return (
    <div className="categorias-container">
      <div className="page-header">
        <h2>Categorías</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
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
        <div className="loading">Cargando categorías...</div>
      ) : categorias.length === 0 ? (
        <div className="empty-state">
          <p>No hay categorías registradas</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.id}</td>
                  <td>{categoria.nombre}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => handleEdit(categoria)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDelete(categoria.id)}
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

export default Categorias

