import { Server } from 'socket.io';
import ProductManager from './clases/ProductManager.js';

let io;
const productManager = new ProductManager();

export const init = (httpServer) =>{
    io = new Server(httpServer);
    io.on('connection', async (socketClient) =>{
        console.log(`Nuevo cliente conectado con id: ${socketClient.id}`);
        let products = await productManager.getProducts();
        socketClient.emit('listaProductos', products);

        socketClient.on('addProduct', async (newProduct) =>{
            await productManager.addProduct(newProduct);
            let products = await productManager.getProducts();
            io.emit('listaProductos', products);
        });

        socketClient.on('deleteProductById', async (idDelete) =>{
            await productManager.deleteProduct(idDelete);
            let products = await productManager.getProducts();
            io.emit('listaProductos', products)
        })

        socketClient.on('disconnect', () =>{
            console.log(`Se ha desconectado el cliente con id ${socketClient.id}`);
        });
    });
    console.log('✅ Server socket running');
};