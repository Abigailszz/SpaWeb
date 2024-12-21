let productos = [];

fetch("http://localhost:3000/productos") // Cambia la URL al endpoint del backend
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    });



// por id y por clase llama
//querySelectorAll-> selecciona todo. Ej: .boton-categoria (selecciona todos los botones)
//querySelector-> selecciona el primero 
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

//sirve en version celular 
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}

//filtra los productos por categoria 
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria_id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria_nombre;
            console.log("ID del botón:", e.currentTarget.id, typeof e.currentTarget.id);
            const productosBoton = productos.filter(producto => producto.categoria_id === e.currentTarget.id);
            cargarProductos(productosBoton);
            
console.log("Productos:", productos);

        } else {
            tituloPrincipal.innerText = "Todos los Servicio";
            cargarProductos(productos);
        }

    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}


let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({//sirve para mostrar el menaje emergente
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right,rgb(250, 157, 157),rgb(253, 188, 203))",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
          },
        onClick: function(){} // se llama cuado se hace click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => String(producto.id) === idBoton);;//busca que coincida
    //si encuentra se busca el id y se incrementa 
    if(productosEnCarrito.some(producto => String(producto.id) === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => String(producto.id) === idBoton);
        productosEnCarrito[index].cantidad++;
        console.log(productosEnCarrito); 
    } else {
        //Si no está significa que no está agregado es eso en el carrito asi que lo lo pone a 1
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}