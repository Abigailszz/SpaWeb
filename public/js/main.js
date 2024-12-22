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

        } else {
            tituloPrincipal.innerText = "Todos los Servicio";
            cargarProductos(productos);
        }

    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar ");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const productId = e.currentTarget.id;

            // Agregar al carrito
            agregarAlCarrito(e);

            // Abrir el modal
            openProductModal(productId);
        });
    });
}

function openProductModal(productId) {
    fetch(`http://localhost:3000/productos/${Number(productId)}`)
        .then(response => response.json())
        .then(product => {
            if (product) {
                // Llenar el modal con los datos del producto
                document.getElementById("productName").innerText = product.titulo;
                document.getElementById("productDescription").innerText = product.descripcion || "Sin descripción disponible";
                document.getElementById("productPrice").innerText = `$${product.precio}`;
                document.getElementById("productSesion").innerText=product.sesion;

                document.getElementById("productModal").style.display = "block";
            } else {
                console.error("Producto no encontrado");
            }
        })
        .catch(error => console.error("Error al cargar el producto:", error));
}

// Cerrar el modal
document.getElementById("closeModal").onclick = function () {
    document.getElementById("productModal").style.display = "none";
};

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

}// Obtener elementos del DOM
const reservarBtn = document.getElementById("reservarBtn");
const calendarModal = document.getElementById("calendarModal");
const closeCalendarModal = document.getElementById("closeCalendarModal");
const closeCalendarBtn = document.getElementById("closeCalendarBtn");
const saveBtn = document.getElementById("saveBtn");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const monthYear = document.getElementById("monthYear");
const calendarElement = document.getElementById("calendar");
const timeSelector = document.getElementById("time");

// Variables para el calendario
let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Función para generar el calendario
// Función para generar el calendario (actualizada)
function generateCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay(); // Día de la semana en el que comienza el mes
    
    // Limpiar el calendario
    calendarElement.innerHTML = '';

    // Mostrar el mes y el año en la parte superior
    monthYear.textContent = `${getMonthName(currentMonth)} ${currentYear}`;

    // // Crear los encabezados de los días de la semana
    // const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    // const weekRow = document.createElement("div");
    // weekRow.classList.add("week-row"); // Agregar una clase para estilizar si es necesario

    // weekDays.forEach(day => {
    //     const dayHeader = document.createElement("div");
    //     dayHeader.textContent = day;
    //     dayHeader.classList.add("day-header"); // Clase opcional para estilos
    //     weekRow.appendChild(dayHeader);
    // });

    // calendarElement.appendChild(weekRow);

    // Rellenar los días vacíos antes del primer día del mes
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement("div");
        calendarElement.appendChild(emptyCell);
    }

    // Generar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.textContent = day;

        // Añadir evento de clic para seleccionar el día
        dayCell.addEventListener("click", function() {
            if (selectedDate) {
                selectedDate.classList.remove("selected"); // Quitar selección previa
            }
            dayCell.classList.add("selected"); // Pintar día seleccionado
            selectedDate = dayCell; // Actualizar día seleccionado
        });

        // Resaltar el día de hoy
        const today = new Date();
        if (today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
            dayCell.classList.add("today");
        }

        calendarElement.appendChild(dayCell);
    }
}

// Función para obtener el nombre del mes
function getMonthName(monthIndex) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return months[monthIndex];
}

// Función para cambiar el mes
prevMonthBtn.addEventListener("click", function() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
});

nextMonthBtn.addEventListener("click", function() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
});

// Mostrar el calendario cuando se presiona "Reservar"
reservarBtn.addEventListener("click", function() {
    calendarModal.style.display = "block"; // Muestra el calendario
    generateCalendar(); // Genera el calendario
});

// Cerrar el segundo modal (calendario)
closeCalendarModal.addEventListener("click", function() {
    calendarModal.style.display = "none"; // Oculta el calendario
});

// Cerrar el segundo modal con el botón "Cerrar"
closeCalendarBtn.addEventListener("click", function() {
    calendarModal.style.display = "none"; // Oculta el calendario
});

// Guardar la selección de la fecha y hora
saveBtn.addEventListener("click", function() {
    if (selectedDate) {
        const selectedTime = timeSelector.value;
        alert(`Fecha seleccionada: ${selectedDate.textContent}, Hora: ${selectedTime}`);
        calendarModal.style.display = "none"; // Oculta el calendario después de guardar
    } else {
        alert("Por favor, selecciona una fecha.");
    }
});
