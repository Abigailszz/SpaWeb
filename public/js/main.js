//VARIABLES GLOBALES
let productos = [];
let productoSeleccionadoId = null;
let diaSeleccionado = null; //  la fecha seleccionada

// Variables para el calendario
let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let reservedSlots = []; // Para almacenar las fechas y horas reservadas


//ELEMENTOS DEL DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

//MODAL DEL PRODUCTO
const reservarBtn = document.getElementById("reservarBtn");
const calendarModal = document.getElementById("calendarModal");
const closeCalendarModal = document.getElementById("closeCalendarModal");
const closeCalendarBtn = document.getElementById("closeCalendarBtn");
const saveBtn = document.getElementById("saveBtn");

//ELEMENTOS DEL CALENDARIO 
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const monthYear = document.getElementById("monthYear");
const calendarElement = document.getElementById("calendar");
const timeSelector = document.getElementById("time");

//VARIABLES PARA EL CARRITO 
let productosEnCarrito = [];
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

//INICIALIZACION 
if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

// Fetch inicial de productos
fetch("http://localhost:3000/productos") // Cambia la URL al endpoint del backend
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    });

//sirve en version celular 
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))

// Función para cargar productos
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
// Función para actualizar botones "Agregar"
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar ");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            productoSeleccionadoId= e.currentTarget.id;

            // Agregar al carrito
            agregarAlCarrito(e);

            // Abrir el modal
            openProductModal(productoSeleccionadoId);
        });
    });
}

// Modal de producto
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

// Referencias a los elementos
const btnUsuario = document.getElementById('btnUsuario');
const modalLogin = document.getElementById('modalLogin');


// Mostrar el modal al presionar el botón "Usuario"
btnUsuario.addEventListener('click', () => {
    modalLogin.style.display = 'flex';
});


// Cerrar el modal si se hace clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === modalLogin) {
        modalLogin.style.display = 'none';
    }
});

// Cerrar el modal
document.getElementById("closeModal").onclick = function () {
    document.getElementById("productModal").style.display = "none";
};

// Función para generar el calendario
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

 // Generar los días del calendario
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

        
        // Llamar a la función para deshabilitar las horas reservadas
        diaSeleccionado = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Formato de fecha "YYYY-MM-DD"
        loadAvailableHours();  
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
    window.location.href = "./index.html"; // Redirige al enlace
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

// Obtener el método de pago seleccionado
const obtenerMetodoPago = () => {
    const metodoSeleccionado = document.querySelector('input[name="paymentMethod"]:checked');
    return metodoSeleccionado ? metodoSeleccionado.value : null;
};

// Guardar la selección de la fecha y hora
saveBtn.addEventListener("click", function() {
    const metodoPagoSeleccionado = obtenerMetodoPago();
    if (!metodoPagoSeleccionado) {
        alert("Por favor, seleccione un método de pago.");
        return; // Detener el envío si no se seleccionó un método
    }

    if (selectedDate) {
        const selectedTime = timeSelector.value;
        const selectedDateStr = `${currentYear}-${currentMonth + 1}-${selectedDate.textContent}`; // Formato de fecha "YYYY-MM-DD"
        console.log(selectedDateStr);

        // Datos que se van a enviar a la base de datos
        const turnoData = {
            clienteId: 1, // Reemplazar con el ID real del cliente
            servicioId: productoSeleccionadoId, // Reemplazar con el ID real del servicio
            fecha: selectedDateStr, // Fecha seleccionada
            hora: selectedTime, // Hora seleccionada
            estado: true, // Estado del turno, false por defecto (puede ser un valor dinámico)
           metodopago: metodoPagoSeleccionado
        };
       

        // Realizar la solicitud POST al servidor
        fetch('http://localhost:3000/turnos/guardar-turno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(turnoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Mensaje de éxito
                calendarModal.style.display = "none"; // Cerrar el calendario después de guardar
            }
        })
        .catch(error => {
            console.error('Error al guardar el turno:', error);
            alert('Hubo un error al guardar el turno');
        });
        
    } else {
        alert("Por favor, selecciona una fecha.");
    }
});

const allHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]; // Todas las horas posibles
const timeSelect = document.getElementById("time");

// Función para cargar las horas disponibles
async function loadAvailableHours() {
    try {
        // Obtener las fechas y horas reservadas desde la API
        const response = await fetch('http://localhost:3000/turnos/reservados');
        reservedSlots = await response.json(); // Las fechas y horas reservadas de la API

        // Obtener la fecha seleccionada
      
        timeSelect.innerHTML = ""; // Limpiar opciones previas

        // Iterar sobre las horas disponibles
        allHours.forEach(hour => {
            const option = document.createElement("option");
            option.value = hour;
            option.textContent = hour;

            // Deshabilitar las horas reservadas solo para la fecha seleccionada
            const isReserved = reservedSlots.some(slot => slot.date === diaSeleccionado && slot.hour === hour);

            if (isReserved) {
                option.disabled = true;
                option.textContent += " (No disponible)";
            }

            timeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las horas disponibles:', error);
    }
}

// Llamada inicial para cargar las horas dinámicamente
loadAvailableHours();

document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/personal/verificar-rol', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {

            const userButton = document.querySelector('#btnUsuario');
            if (data.rol === 'administrador') {
                userButton.textContent = '<i class="bi bi-person-circle"></i>  Administrador';
                window.location.href = '/admin.html';
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
});