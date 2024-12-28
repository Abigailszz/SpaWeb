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
                  ${producto.estado === 1 ? `
                        <button class="boton-editar">Editar</button>
                        <button class="boton-ocultar">Ocultar</button>
                      `
                    : `
                        <button class="boton-editar" onclick="habilitarServicio(${producto.id})">Habilitar</button>
                        <button class="boton-ocultar" onclick="eliminarServicio(${producto.id})"><i class="bi bi-trash3-fill"></i> Eliminar</button>
                      `}
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
    const dynamicContainer = document.getElementById('dynamic-container');
    const contenedorProductos = document.getElementById('contenedor-productos');
    const createServiceButton = document.querySelector(".create-service-button");

    // Función para actualizar la visibilidad del bloque dinámico
    function actualizarVisibilidad() {
        if (tituloPrincipal.textContent.trim() === "Servicios activos") {
            dynamicContainer.style.display = "block"; // Muestra el bloque
            contenedorProductos.style.display = "block"; // Asegúrate de mostrar el contenedor de productos
            createServiceButton.style.display = "inline-block"; // Muestra el botón de "Crear Servicio"
        } else if (tituloPrincipal.textContent.trim() === "Servicios inactivos") {
            dynamicContainer.style.display = "block"; // Muestra el bloque
            contenedorProductos.style.display = "block"; // Asegúrate de mostrar el contenedor de productos
            createServiceButton.style.display = "none"; // Oculta el botón de "Crear Servicio"
        }else{
            dynamicContainer.style.display = "none"; // Oculta el bloque
            contenedorProductos.style.display = "none"; // Asegúrate de mostrar el contenedor de productos
        }
  
    }
    
// Función para obtener servicios inactivos desde la API
async function obtenerServiciosInactivos() {
    try {
        const response = await fetch('/productos/inactivo');
        if (!response.ok) throw new Error('Error al obtener servicios inactivos');
        const productosInactivos = await response.json();
        cargarProductos(productosInactivos); // Usa la función existente para renderizar productos
    } catch (error) {
        console.error('Error:', error);
    }
}

const menuItems = document.querySelectorAll('.boton-menu'); // Botones del menú
        const tituloPrincipal = document.getElementById('titulo-principal');
        
        // Escuchar los clics en los botones del menú
        menuItems.forEach((boton) => {
            boton.addEventListener("click", (e) => {
                menuItems.forEach(boton => boton.classList.remove("active")); // Quitar la clase activa
                e.currentTarget.classList.add("active"); // Agregar clase activa al botón clicado
        
                const titulo = e.currentTarget.textContent.trim(); // Obtener el texto del botón
                tituloPrincipal.textContent = titulo; // Cambiar el título principal
        
               
      
        actualizarVisibilidad();

        if (titulo === "Servicios activos") {
            obtenerProductos(); // Carga todos los productos
        } else if (titulo === "Servicios inactivos") {
            obtenerServiciosInactivos(); // Carga servicios inactivos
        }
            });
        });