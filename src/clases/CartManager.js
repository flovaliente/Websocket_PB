import { promises as fs } from 'fs';

class CartManager {
    constructor(pathFile){
        this.pathFile = pathFile;
    }
    
    async createCart(){
        const carts = await getJSON(this.pathFile);
        const id = carts.length + 1;
        const products = [];
        const newCart = {id, products};
        carts.push(newCart);
        await saveJSON(this.pathFile, carts);
        return carts;
    }

    getCarts(){
        return getJSON(this.pathFile);
    }

    async getCartById(id){
        const carts = await this.getCarts();
        const cart = carts.find(cart => parseInt(cart.id) === parseInt(id));
        if(!cart)
            throw new Error(`No se encontro carrito con id: ${parseInt(id)}`);
        else
            return cart;
    }

    async updateCart(cid, pid){
        const carts = await this.getCarts();
        const cart = await this.getCartById(parseInt(cid));
        const alreadyExist = cart.products.find((product) => parseInt(product.product) === parseInt(pid));
        const cPosition = carts.findIndex(cart => parseInt(cart.id) === parseInt(cid));
        
        if(!alreadyExist){
            carts[cPosition].products.push({
                product: parseInt(pid),
                quantity: 1
            });
        }else{
            const pPosition = cart.products.findIndex((product) => parseInt(product.product) === parseInt(pid));
            alreadyExist.quantity = alreadyExist.quantity+1;
            carts[cPosition].products[pPosition].quantity++;
            
        }
        await saveJSON(this.pathFile, carts);
    }

    async updateQuantityCart(cid, pid){
        const carts = await this.getCarts();
        const cPosition = carts.findIndex(cart => parseInt(cart.id) === parseInt(cid));
        const pPosition = carts.products.find((product) => product.product === pid);
        carts[cPosition].products[pPosition].quantity++;
        await saveJSON(this.pathFile, carts);
    }
}



// Funciones auxiliares
const existFile = async(pathFile) => {
    try{
        await fs.access(pathFile);
        return true;
    }catch(error){
        return false;
    }
};

const getJSON = async(pathFile) => {
    if(!await existFile(pathFile))
        return [];

    let content;
    try{
        content = await fs.readFile(pathFile, 'utf-8');
    }catch (error){
        throw new Error(`El archivo ${pathFile} no se pudo leer.`);
    }

    try{
        return JSON.parse(content);
    }catch (error){
        throw new Error(`El archivo ${pathFile} no tiene formato valido.`);
    }
};

const saveJSON = async(pathFile, data) =>{
    const content = JSON.stringify(data, null, '\t');
    try{
        await fs.writeFile(pathFile, content, 'utf-8');
    }catch (error){
        throw new Error('El archivo no se pudo escribir');
    }
};



export default CartManager;