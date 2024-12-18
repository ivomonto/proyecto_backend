const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const productosFilePath = path.join(__dirname, '../data/productos.json');

// Función para leer productos desde el archivo
const readProductos = () => {
    if (!fs.existsSync(productosFilePath)) return [];
    const data = fs.readFileSync(productosFilePath);
    return JSON.parse(data);
};

// Función para guardar productos en el archivo
const writeProductos = (productos) => {
    fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));
};

// Obtener todos los productos (con límite opcional)
router.get('/', (req, res) => {
    const { limit } = req.query;
    const productos = readProductos();
    if (limit) {
        return res.json(productos.slice(0, parseInt(limit)));
    }
    res.json(productos);
});

// Obtener producto por ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const productos = readProductos();
    const producto = productos.find(p => p.id === pid);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
});

// Crear un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const productos = readProductos();
    const newProduct = {
        id: `prod-${Date.now()}`,
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails: thumbnails || [],
        status: true
    };
    productos.push(newProduct);
    writeProductos(productos);
    res.status(201).json(newProduct);
});

// Actualizar un producto por ID
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updateFields = req.body;
    const productos = readProductos();

    const productIndex = productos.findIndex(p => p.id === pid);
    if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    productos[productIndex] = { ...productos[productIndex], ...updateFields, id: productos[productIndex].id };
    writeProductos(productos);
    res.json(productos[productIndex]);
});

// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const productos = readProductos();

    const updatedProductos = productos.filter(p => p.id !== pid);
    if (productos.length === updatedProductos.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    writeProductos(updatedProductos);
    res.status(204).send();
});

module.exports = router;