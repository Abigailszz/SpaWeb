const menuItems = document.querySelectorAll('.boton-menu');
const tituloPrincipal = document.getElementById('titulo-principal');

    menuItems.forEach((item) => {
        item.addEventListener('click', () => {
            const nuevoTitulo = item.textContent.trim();
            tituloPrincipal.textContent = nuevoTitulo;
        });
    });
    function cargarProductos(productosElegidos) {
        const contenedorProductos = document.getElementById("contenedorProductos");
        contenedorProductos.innerHTML = ""; // Limpiar contenedor
        productosElegidos.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("evento");
            div.innerHTML = `
                <img class="evento-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="evento-texto">
                    <h3 class="evento-titulo">${producto.titulo}</h3>
                    <p class="evento-descripcion">${producto.descripcion}</p>
                    <p class="evento-categoria">Categoría: ${producto.categoria_nombre}</p>
                    <p class="evento-precio">Precio: $${producto.precio}</p>
                    <p class="evento-sesion">Sesión: ${producto.sesion}</p>
                </div>
                <div class="evento-botones">
                    <button class="boton-editar">Editar</button>
                    <button class="boton-ocultar">Ocultar</button>
                </div>
            `;
            contenedorProductos.append(div);
        });
    }

    // Función para obtener los productos desde la API
    async function obtenerProductos() {
        try {
            const response = await fetch('/productos');
            if (!response.ok) throw new Error('Error al obtener productos');
            const productos = await response.json();
            cargarProductos(productos);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Llamada a la función para cargar los productos al iniciar
    obtenerProductos();