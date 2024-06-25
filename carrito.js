document.addEventListener("DOMContentLoaded", function() {
    const productos = document.querySelectorAll('.producto');
    const carrito = document.getElementById('carrito');
    const listaCarrito = document.getElementById('lista-carrito');
    const total = document.getElementById('total');
    let totalCompra = 0;

    function guardarCarritoEnLocalStorage() {
        const items = Array.from(listaCarrito.children).map(item => ({
            nombre: item.dataset.nombre,
            cantidad: item.querySelector('.cantidad-item').textContent.split(': ')[1],
            precio: item.dataset.precio
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
                nuevoItem.dataset.precio = item.precio;
                nuevoItem.innerHTML = `
                    ${item.nombre} - 
                    <span class="cantidad-item">Cantidad: ${item.cantidad}</span> - 
                    <span class="precio-unitario">Precio Unitario: $${parseFloat(item.precio).toFixed(2)}</span> - 
                    <span class="precio-total">Precio Total: $${(parseFloat(item.precio) * parseInt(item.cantidad)).toFixed(2)}</span>
                    <button class="borrar-item">X</button>
                `;
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
            nuevaCantidad += parseInt(itemExistente.querySelector('.cantidad-item').textContent.split(': ')[1]);
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
                itemExistente.querySelector('.cantidad-item').textContent = `Cantidad: ${nuevaCantidad}`;
                itemExistente.querySelector('.precio-total').textContent = `Precio Total: $${(precio * nuevaCantidad).toFixed(2)}`;
            } else {
                const nuevoItem = document.createElement('li');
                nuevoItem.dataset.nombre = nombre;
                nuevoItem.dataset.precio = precio;
                nuevoItem.innerHTML = `
                    ${nombre} - 
                    <span class="cantidad-item">Cantidad: ${nuevaCantidad}</span> - 
                    <span class="precio-unitario">Precio Unitario: $${precio.toFixed(2)}</span> - 
                    <span class="precio-total">Precio Total: $${(precio * nuevaCantidad).toFixed(2)}</span>
                    <button class="borrar-item">X</button>
                `;
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

    listaCarrito.addEventListener('click', function(event) {
        if (event.target.classList.contains('borrar-item')) {
            const item = event.target.parentElement;
            const precio = parseFloat(item.dataset.precio);
            const cantidad = parseInt(item.querySelector('.cantidad-item').textContent.split(': ')[1]);
            totalCompra -= precio * cantidad;
            total.textContent = `Total: $${totalCompra.toFixed(2)}`;
            listaCarrito.removeChild(item);
            guardarCarritoEnLocalStorage();
        }
    });

    document.getElementById("vaciar-carrito").addEventListener("click", function() {
        listaCarrito.innerHTML = "";
        totalCompra = 0;
        total.textContent = "Total: $0.00";
        carrito.classList.add('oculto');
        localStorage.removeItem('carrito');
    });

    document.getElementById("comprar").addEventListener("click", function() {
        if (totalCompra === 0) {
            alert("El carrito está vacío.");
        } else {
            alert("¡Compra realizada!");
            listaCarrito.innerHTML = "";
            totalCompra = 0;
            total.textContent = "Total: $0.00";
            carrito.classList.add('oculto');
            localStorage.removeItem('carrito');
        }
    });

    cargarCarritoDeLocalStorage();
});























