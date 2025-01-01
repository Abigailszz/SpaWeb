const menuItems = document.querySelectorAll('.boton-menu'); 
const tituloPrincipal = document.getElementById('titulo-principal');
const calendarWrapper = document.querySelector('.calendar-wrapper');
const turnosContainer = document.querySelector('.turnos-container');
const dynamicContainer = document.getElementById('dynamic-container');
const contenedorProductos = document.getElementById('contenedor-productos');
const createServiceButton = document.querySelector(".create-service-button");
const solicitudTurnos = document.querySelector('.solicitud-Turnos');

       
document.addEventListener("DOMContentLoaded", () => {
    const tituloPrincipal = document.getElementById('titulo-principal');

    // Inicializar el título principal como "Servicios activos"
    tituloPrincipal.textContent = "Servicios activos";

    // Mostrar el contenedor dinámico y cargar servicios activos
    actualizarVisibilidad();
    obtenerServiciosActivos(); 
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
    
    // Función para actualizar la visibilidad del bloque dinámico
    function actualizarVisibilidad() {
        if (tituloPrincipal.textContent.trim() === "Servicios activos") {
            dynamicContainer.style.display = "block"; // Muestra el bloque
            contenedorProductos.style.display = "block"; // Asegúrate de mostrar el contenedor de productos
            createServiceButton.style.display = "inline-block"; // Muestra el botón de "Crear Servicio"
            solicitudTurnos.style.display = 'none';
        } else if (tituloPrincipal.textContent.trim() === "Servicios inactivos") {
            dynamicContainer.style.display = "block"; // Muestra el bloque
            contenedorProductos.style.display = "block"; // Asegúrate de mostrar el contenedor de productos
            createServiceButton.style.display = "none"; // Oculta el botón de "Crear Servicio"
            solicitudTurnos.style.display = 'none';
        }else if (tituloPrincipal.textContent.trim() === "Turnos"){
            calendarWrapper.style.display = 'block';
            solicitudTurnos.style.display = 'none';
            turnosContainer.style.display = 'block';
            dynamicContainer.style.display = "none"; // Muestra el bloque
            contenedorProductos.style.display = "none"; // Asegúrate de mostrar el contenedor de productos
            createServiceButton.style.display = "none"; // Muestra el botón de "Crear Servicio"
        }else if  (tituloPrincipal.textContent.trim() === "Solicitud Turno"){
            solicitudTurnos.style.display = 'block';
            calendarWrapper.style.display = 'none';
            turnosContainer.style.display = 'none';
            dynamicContainer.style.display = "none"; // Muestra el bloque
            contenedorProductos.style.display = "none"; // Asegúrate de mostrar el contenedor de productos
            createServiceButton.style.display = "none"; // Muestra el botón de "Crear Servicio"
        }
  
    }
// Escuchar los clics en los botones del menú
menuItems.forEach((boton) => {
    boton.addEventListener("click", (e) => {
        menuItems.forEach(boton => boton.classList.remove("active")); // Quitar la clase activa
        e.currentTarget.classList.add("active"); // Agregar clase activa al botón clicado

        const titulo = e.currentTarget.textContent.trim(); // Obtener el texto del botón
        tituloPrincipal.textContent = titulo; // Cambiar el título principal

        // Ocultar todos los contenedores por defecto
        document.querySelectorAll('.dynamic-container, .calendar-wrapper, .turnos-container').forEach(container => {
            container.style.display = 'none';
        });

        if (titulo === "Servicios activos") {
            actualizarVisibilidad();
            obtenerServiciosActivos();
        } else if (titulo === "Servicios inactivos") {
            actualizarVisibilidad();
            obtenerServiciosInactivos();
        } else if (titulo === "Turnos") {
            actualizarVisibilidad();
            inicializarTurnos();
           
        }else if (titulo === "Solicitud Turno"){
            actualizarVisibilidad();
            TurnosSolicitados(); 
        }
    });
});    
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

async function obtenerServiciosActivos() {
    try {
        const response = await fetch('/productos/activos');
        if (!response.ok) throw new Error('Error al obtener servicios inactivos');
        const productosActivos = await response.json();
        cargarProductos(productosActivos); // Usa la función existente para renderizar productos
    } catch (error) {
        console.error('Error:', error);
    }
}
async function TurnosSolicitados() {
    try {
        const response = await fetch('/soliTurnos'); // Ajusta la URL según tu API
        if (!response.ok) throw new Error("Error al obtener turnos solicitados");

        const turnosData = await response.json();
        const turnosSoliTable = document.getElementById('turnos-soli');

        turnosSoliTable.innerHTML = ""; // Limpiar la tabla antes de cargar nuevos datos
        

        if (turnosData.length === 0) {
            turnosSoliTable.innerHTML = "<tr><td colspan='6'>No hay turnos solicitados</td></tr>";
        } else {
            turnosData.forEach(turno => {
                     // Formatear la fecha
                     const fecha = new Date(turno.dia);
                     const dia = fecha.getDate().toString().padStart(2, '0');
                     const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11
                     const año = fecha.getFullYear();
                     const fechaFormateada = `${dia}/${mes}/${año}`;
                const turnoRow = document.createElement('tr');
                turnoRow.innerHTML = `
                    <td>${turno.cliente}</td>
                    <td>${turno.servicio}</td>
                    <td>${fechaFormateada}</td>
                    <td>${turno.hora}</td>
                    <td>${turno.metodo_pago}</td>
                    <td data-label="Acciones" class="acciones">
                        <button class='aceptar'><i class="bi bi-calendar2-check"></i> Aceptar</button>
                        
                        <button class='rechazar'><i class="bi bi-calendar-x-fill"></i> Rechazar</button>
                    </td>
                `;
                turnosSoliTable.appendChild(turnoRow);
            });
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function inicializarTurnos() {
    const daysContainer = document.getElementById("days-container");
    const currentMonthElement = document.getElementById("current-month");
    const turnosContainer = document.querySelector(".turnos-container");
    const selectedDateElement = document.getElementById("selected-date");
    const turnosList = document.getElementById("turnos-list");
    const searchClientInput = document.getElementById("search-client");
        
    let currentDate = new Date();
    let turnosData = [];
        
    async function fetchTurnos() {
        try {
            const response = await fetch('/nombreCliente-Servicio');
            if (!response.ok) throw new Error("Error al obtener turnos");
                turnosData = await response.json();
            } catch (error) {
                console.error("Error:", error);
            }
        }
        
        async function renderCalendar() {
            await fetchTurnos();
        
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
        
            currentMonthElement.textContent = currentDate.toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
            });
        
            daysContainer.innerHTML = "";
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
        
            for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
                const emptyCell = document.createElement("div");
                emptyCell.classList.add("empty-cell");
                daysContainer.appendChild(emptyCell);
            }
        
            for (let day = 1; day <= daysInMonth; day++) {
                const dayString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayButton = document.createElement("button");
                dayButton.textContent = day;
                dayButton.classList.add("day-button");
        
                const hasTurnos = turnosData.some(turno => turno.fecha.startsWith(dayString));
                if (hasTurnos) {
                    dayButton.classList.add("has-turnos");
                }
        
                dayButton.addEventListener("click", () => mostrarTurnos(dayString));
                daysContainer.appendChild(dayButton);    
            }
        }
        
        function cambiarMes(delta) {
            currentDate.setMonth(currentDate.getMonth() + delta);
            renderCalendar();
        }
        
        function mostrarTurnos(fecha) {
            const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        
            selectedDateElement.textContent = fechaFormateada;
            turnosContainer.style.display = "block";
        
            const turnosDelDia = turnosData.filter(turno => turno.fecha.startsWith(fecha));
        
            turnosList.innerHTML = "";
                if (turnosDelDia.length === 0) {
                    turnosList.innerHTML = "<tr><td colspan='6'>No hay turnos reservados</td></tr>";
                } else {
                    turnosDelDia.forEach(turno => {
                        const turnoRow = document.createElement("tr");
                        turnoRow.innerHTML = `
                            <td>${turno.cliente}</td>
                            <td>${turno.servicio}</td>
                            <td>${turno.hora}</td>
                            <td>${turno.estado === 1 ? "Confirmado" : "Cancelado"}</td>
                            
                            <td> <button class='rechazar'><i class="bi bi-calendar-x-fill"></i> Cancelar</button></td>
                        `;
                        turnosList.appendChild(turnoRow);
                    });
                }
            }
        
        searchClientInput.addEventListener("input", () => {
            const searchTerm = searchClientInput.value.toLowerCase();
            const filteredTurnos = turnosData.filter(turno => turno.id_cliente.toLowerCase().includes(searchTerm));
        
            turnosList.innerHTML = "";
            if (filteredTurnos.length === 0) {
                turnosList.innerHTML = "<tr><td colspan='6'>No hay turnos que coincidan con la búsqueda</td></tr>";
            } else {
                filteredTurnos.forEach(turno => {
                    const turnoRow = document.createElement("tr");
                    turnoRow.innerHTML = `
                    <td>${turno.cliente}</td>
                    <td>${turno.servicio}</td>
                    <td>${turno.hora}</td>
                    <td>${turno.estado === 1 ? "Confirmado" : "Cancelado"}</td>
                    <td><button class='cancelar-button'>Cancelar</button></td>`;
            turnosList.appendChild(turnoRow);
        });
        }
        });
        
    document.getElementById("prev-month").addEventListener("click", () => cambiarMes(-1));
    document.getElementById("next-month").addEventListener("click", () => cambiarMes(1));
        
    renderCalendar();
}
        
   
