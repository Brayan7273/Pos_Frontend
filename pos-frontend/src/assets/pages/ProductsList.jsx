import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/assets/components/ui/card"
import { Button } from "@/assets/components/ui/button"
import { Input } from "@/assets/components/ui/input"
import { Label } from "@/assets/components/ui/label"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2, Package, AlertCircle, Filter, Download, Upload, BarChart3, Eye } from "lucide-react"

export default function ProductsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(["all"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/products", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        setError("Error al cargar productos")
      }
    } catch (err) {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/categories", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(["all", ...data])
      }
    } catch (err) {
      console.error("Error al cargar categorías:", err)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const lowStockProducts = products.filter(p => p.stock < p.minStock).length

  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0)

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        alert("Error al eliminar producto")
      }
    } catch (err) {
      alert("Error de conexión")
    }
  }

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/products/export", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `productos_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
      }
    } catch (err) {
      alert("Error al exportar productos")
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/products/import", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        alert("Productos importados exitosamente")
        fetchProducts()
      } else {
        alert("Error al importar productos")
      }
    } catch (err) {
      alert("Error de conexión")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando productos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestión de Productos</h1>
            <p className="text-gray-400">Administra tu inventario</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2">
            <Plus size={20} />
            Nuevo Producto
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/90 border-slate-700 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Productos</p>
                  <p className="text-2xl font-bold text-white">{products.length}</p>
                </div>
                <Package className="text-blue-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 border-slate-700 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Stock Bajo</p>
                  <p className="text-2xl font-bold text-orange-500">{lowStockProducts}</p>
                </div>
                <AlertCircle className="text-orange-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 border-slate-700 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Valor Inventario</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${totalInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <BarChart3 className="text-green-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 border-slate-700 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Categorías</p>
                  <p className="text-2xl font-bold text-purple-500">{categories.length - 1}</p>
                </div>
                <Filter className="text-purple-500" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-slate-900/90 border-slate-700 backdrop-blur-xl mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-500 w-full"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className="bg-black border-slate-700 text-gray-300 hover:bg-slate-800 flex-1 md:flex-none"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} className="mr-2" />
                  Filtros
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-black border-slate-700 text-gray-300 hover:bg-slate-800 flex-1 md:flex-none"
                  onClick={handleExport}
                >
                  <Download size={18} className="mr-2" />
                  Exportar
                </Button>
                <label className="flex-1 md:flex-none">
                  <Button 
                    variant="outline" 
                    className="bg-black border-slate-700 text-gray-300 hover:bg-slate-800 w-full"
                    type="button"
                  >
                    <Upload size={18} className="mr-2" />
                    Importar
                  </Button>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-slate-700"
              >
                <div className="flex gap-2 flex-wrap">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                      }`}
                    >
                      {cat === "all" ? "Todas" : cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-slate-900/90 border-slate-700 backdrop-blur-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">Producto</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">SKU</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Categoría</th>
                    <th className="text-right p-4 text-gray-300 font-semibold">Precio</th>
                    <th className="text-right p-4 text-gray-300 font-semibold">Stock</th>
                    <th className="text-right p-4 text-gray-300 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                              <Package size={20} className="text-gray-500" />
                            </div>
                          )}
                          <span className="text-white font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">{product.sku}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 text-right text-green-400 font-semibold">
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-semibold ${
                          product.stock < product.minStock ? "text-orange-500" : "text-white"
                        }`}>
                          {product.stock}
                        </span>
                        {product.stock < product.minStock && (
                          <AlertCircle className="inline ml-2 text-orange-500" size={16} />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 text-green-400 hover:bg-green-600/20 rounded-lg transition">
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && !loading && (
              <div className="p-12 text-center">
                <Package className="mx-auto text-gray-600 mb-4" size={64} />
                <p className="text-gray-400 text-lg">No se encontraron productos</p>
                <p className="text-gray-500 text-sm mt-2">Comienza agregando tu primer producto</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}