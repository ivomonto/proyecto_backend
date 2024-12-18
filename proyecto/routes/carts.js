const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const cartsFilePath = path.join(__dirname, '../data/carrito.json');

// Función para leer carritos desde el archivo
const readCarts = () => {
    if (!fs.existsSync(cartsFilePath)) return [];
    const data = fs.readFileSync(cartsFilePath);
    return JSON.parse(data);
};

// Función para guardar carritos en el archivo
const writeCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: `cart-${Date.now()}`,
        productos: []
    };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// Obtener productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readCarts();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.productos);
});

// Agregar un producto a un carrito
router.post('/:cid/producto/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCarts();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const existingProduct = cart.productos.find(p => p.producto === pid);
    if (existingProduct) {
        existingProduct.cantidad += 1;
    } else {
        cart.productos.push({ producto: pid, cantidad: 1 });
    }

    writeCarts(carts);
    res.json(cart);
});

module.exports = router;