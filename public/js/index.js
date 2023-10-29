(function() {
  const socket = io();
  
  document.getElementById('addProduct').addEventListener('submit', (e) =>{
      e.preventDefault();

      const newProduct = {
          title: document.getElementById('titleProduct').value,
          description: document.getElementById('descriptionProduct').value,
          code: document.getElementById('codeProduct').value,
          price: document.getElementById('priceProduct').value,
          stock: document.getElementById('stockProduct').value,
          category: document.getElementById('categoryProduct').value
      };
      socket.emit('addProduct', newProduct);

  });

  document.getElementById('deleteProduct').addEventListener('submit', (e) =>{
      e.preventDefault();

      const idProduct = document.getElementById("idDeleteProduct").value;
      console.log(idProduct);
      socket.emit('deleteProductById', idProduct);
      document.getElementById('idDeleteProduct').value = '';
      document.getElementById('idDeleteProduct').focus();
  });

  socket.on('listaProductos', (products) =>{
      const listaProd = document.getElementById('listRTP');
      listaProd.innerText = '';

      products.forEach(product => {
          const productElement = document.createElement('div');
          productElement.innerHTML = `
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p>$ ${product.price}</p>
          <p>Stock: ${product.stock}</p>
          <p id='idProduct'>Id: ${product.id}</p>`;
          listaProd.appendChild(productElement);
      });
  });


})();