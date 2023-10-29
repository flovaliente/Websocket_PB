import { Router } from 'express';
import CartManager from '../clases/CartManager.js';
import ProductManager from '../clases/ProductManager.js';

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

// Create carts
router.post('/', async (req, res) => {
    try{
        const carts = await cartManager.createCart();
        res.status(200).json(carts);
    }catch (error){
        res.status(400).json({error: error.message});
    }
});

// Get cart
router.get('/:cid', async (req, res) => {
    try{
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        if(!cart){
            res.status(404).json({error: 'Cart not found.'});
            return;
        }    
        
        const productsWithQuantities = [];
        for(const i of cart.products){
            let product = await productManager.getProductById(i.product);
            if(product){
                productsWithQuantities.push({
                    product: product,
                    quantity: i.quantity
                });
            }
        }
        res.status(200).json(productsWithQuantities);
    }catch (error){
        res.status(400).json({error: error.message});
    }
});

// Add product to cart
router.post('/:cid/product/:pid', async (req, res) => {
    try{
        const { cid, pid } = req.params;
        
        // Me fijo si exite el carrito
        const cart = await cartManager.getCartById(parseInt(cid));
        if(!cart){
            res.status(404).json({error: 'Cart not found.'});
            return;
        }
    
        await cartManager.updateCart(cid, pid);
        res.status(200).json({status:'Producto añadido al carrito correctamente'});
    }catch (error){
        res.status(400).json({error: error.message});
    }
    
})

export default router;