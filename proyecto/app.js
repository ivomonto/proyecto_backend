const express = require('express');
const productosRouter = require('./routes/productos');
const cartsRouter = require('./routes/carts');

const app = express();
const PORT = 8080;

// Middleware para manejar JSON
app.use(express.json());

// Routers
app.use('/api/productos', productosRouter);
app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});