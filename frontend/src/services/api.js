// Usar ruta relativa para que el proxy de Vite funcione
const API_BASE_URL = '/api'

// Función auxiliar para hacer peticiones
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    // Si la respuesta está vacía (204 No Content)
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error en la petición:', error)
    throw error
  }
}

// Servicios para Categorías
export const categoriaService = {
  getAll: () => request('/categorias'),
  getById: (id) => request(`/categorias/${id}`),
  create: (categoria) => request('/categorias', {
    method: 'POST',
    body: JSON.stringify(categoria),
  }),
  update: (id, categoria) => request(`/categorias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoria),
  }),
  delete: (id) => request(`/categorias/${id}`, {
    method: 'DELETE',
  }),
}

// Servicios para Productos
export const productoService = {
  getAll: () => request('/productos'),
  getById: (id) => request(`/productos/${id}`),
  create: (producto) => request('/productos', {
    method: 'POST',
    body: JSON.stringify(producto),
  }),
  update: (id, producto) => request(`/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(producto),
  }),
  delete: (id) => request(`/productos/${id}`, {
    method: 'DELETE',
  }),
}

