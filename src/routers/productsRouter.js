import { Router } from 'express';
import ProductManager from '../clases/ProductManager.js';

const productsRouter = Router();

const productManager = new ProductManager();

// Get products
productsRouter.get('/', async (req, res) =>{
    const products = await productManager.getProducts();
    const { limit } = req.query;
    if(!limit)
        res.status(200).json(products);
    else
        res.status(200).json(products.slice(0, parseInt(limit)));
});

// Get product by id
productsRouter.get('/:pid', async (req, res) =>{ 
    const { pid } = req.params;
    const product = await productManager.getProductById(parseInt(pid));
    if(product){
        return res.status(200).json(product);
    }else{
        return res.status(404).send('Producto no encontrado.');
    }
});

// Add product
productsRouter.post('/', async (req, res) => {
    try {
        //const { body } = req;
        await productManager.addProduct(req.body);
        const newProducts = await productManager.getProducts();
        res.status(200).json(newProducts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update product
productsRouter.put('/:pid', async (req, res) => {
    try{
        const { pid } = req.params;
        //const { body } = req;
        const updated = await productManager.updateProduct(pid, req.body);
        res.status(200).json(updated);
    } catch(error){
        res.status(400).json({ error: error.message });
    }
});

// Delete product
productsRouter.delete('/:pid', async (req, res) => {
    try{
        const { pid } = req.params;
        await productManager.deleteProduct(pid);
        res.status(200).json({ success: 'Product borrado exitosamente.'});
    }catch (error){
        res.status(404).json({ error: 'Product not found.'});
    }
});

export default productsRouter;