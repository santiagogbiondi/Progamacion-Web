   
   
   document.addEventListener("DOMContentLoaded", function() {
    
 
    const productos = document.querySelectorAll('.producto');
    const carrito = document.getElementById('carrito');
    const listaCarrito = document.getElementById('lista-carrito');
    const total = document.getElementById('total');
    let totalCompra = 0;

    function guardarCarritoEnLocalStorage() {
        const items = Array.from(listaCarrito.children).map(item => ({
            nombre: item.dataset.nombre,
            cantidad: item.querySelector('.cantidad-item').textContent
        }));
        localStorage.setItem('carrito', JSON.stringify({ items, totalCompra }));
    }

    function cargarCarritoDeLocalStorage() {
        const data = JSON.parse(localStorage.getItem('carrito'));
        if (data) {
            totalCompra = data.totalCompra;
            total.textContent = `Total: $${totalCompra.toFixed(2)}`;
            data.items.forEach(item => {
                const nuevoItem = document.createElement('li');
                nuevoItem.dataset.nombre = item.nombre;
                nuevoItem.innerHTML = `${item.nombre} - <span class="cantidad-item">${item.cantidad}</span>`;
                listaCarrito.appendChild(nuevoItem);
            });
            if (totalCompra > 0) {
                carrito.classList.remove('oculto');
            }
        }
    }

    productos.forEach(producto => {
        const cantidadSeleccionada = producto.querySelector('.cantidad-seleccionada');
        const botonSumar = producto.querySelector('.sumar');
        const botonRestar = producto.querySelector('.restar');

        botonSumar.addEventListener('click', function() {
            let cantidad = parseInt(cantidadSeleccionada.textContent);
            cantidad++;
            cantidadSeleccionada.textContent = cantidad;
            actualizarCarrito(producto.dataset.nombre, parseFloat(producto.dataset.precio), 1);
        });

        botonRestar.addEventListener('click', function() {
            let cantidad = parseInt(cantidadSeleccionada.textContent);
            if (cantidad > 0) {
                cantidad--;
                cantidadSeleccionada.textContent = cantidad;
                actualizarCarrito(producto.dataset.nombre, parseFloat(producto.dataset.precio), -1);
            }
        });
    });

    function actualizarCarrito(nombre, precio, cambio) {
        const itemExistente = Array.from(listaCarrito.children).find(item => item.dataset.nombre === nombre);
        let nuevaCantidad = cambio;
        if (itemExistente) {
            nuevaCantidad += parseInt(itemExistente.querySelector('.cantidad-item').textContent);
        }
        if (nuevaCantidad < 0) {
            return; 
        }
        if (nuevaCantidad === 0) {
            if (itemExistente) {
                listaCarrito.removeChild(itemExistente);
            }
        } else {
            if (itemExistente) {
                itemExistente.querySelector('.cantidad-item').textContent = nuevaCantidad;
            } else {
                const nuevoItem = document.createElement('li');
                nuevoItem.dataset.nombre = nombre;
                nuevoItem.innerHTML = `${nombre} - <span class="cantidad-item">${nuevaCantidad}</span>`;
                listaCarrito.appendChild(nuevoItem);
            }
        }
        if (nuevaCantidad >= 0) {
            totalCompra += precio * cambio;
            total.textContent = `Total: $${totalCompra.toFixed(2)}`;
        }
        if (totalCompra > 0) {
            carrito.classList.remove('oculto');
        } else {
            carrito.classList.add('oculto');
        }
        guardarCarritoEnLocalStorage();
    }

    document.getElementById("vaciar-carrito").addEventListener("click", function() {
        listaCarrito.innerHTML = "";
        totalCompra = 0;
        total.textContent = "Total: $0.00";
        carrito.classList.add('oculto');
        localStorage.removeItem('carrito');
    });

    document.getElementById("comprar").addEventListener("click", function() {
        alert("¡Compra realizada!"); 
        listaCarrito.innerHTML = "";
        totalCompra = 0;
        total.textContent = "Total: $0.00";
        carrito.classList.add('oculto');
        localStorage.removeItem('carrito');
    });

    cargarCarritoDeLocalStorage();
});




















