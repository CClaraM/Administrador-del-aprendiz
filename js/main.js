// main.js
// Autor: Cristian Camilo Lara Montero
// Fecha: 2024-06-20
// Descripción: Interfaz principal, visualización de datos de aprendices.

document.addEventListener('DOMContentLoaded', () => {
    validarLogin();
    inicializarEventos();
    cargarFichas();
});

// Función para validar si el usuario ha iniciado sesión
function validarLogin() {
    if (sessionStorage.getItem('loggedIn') !== 'true' || sessionStorage.getItem('usuario') === null) {
        Swal.fire({
            title: "Acceso denegado",
            text: "Debes iniciar sesión para acceder a esta página",
            icon: "error",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "login.html";
        });
    } else {
        document.querySelector('#usuarioActivo').textContent = sessionStorage.getItem('usuario');
        document.querySelector('.container').style.display = 'block';
    }
}

// Función para inicializar eventos
function inicializarEventos() {
    // Evento para el botón de Salir
    document.querySelector('#BtnSalir').addEventListener('click', () => {
        sessionStorage.clear();
        localStorage.clear();
        Swal.fire({
            title: "Sesión cerrada",
            text: "Has cerrado sesión exitosamente",
            icon: "info",
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "login.html";
        });
    });

    // Cambio de ficha
    document.querySelector('#fichaSelect').addEventListener('change', (event) => {
        const fichaSeleccionada = event.target.value;
        if (fichaSeleccionada) {
            cargarAprendices(fichaSeleccionada);
        }
    });
}

// Cargo de aprendices desde API
async function cargarFichas() {
    try {
        const respuesta = await fetch('https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/SENA-CTPI.matriculados.json');
        const data = await respuesta.json();
        console.log("Total aprendices: ", data.length);
        //console.log(data);

        const select = document.querySelector('#fichaSelect');
        select.innerHTML = '<option value="">Seleccione una ficha</option>';

        // toco usar un Set para evitar repetidos
        const fichasUnicas= new Set();

        data.forEach(aprendiz => {
            const fichaCodigo = String(aprendiz.FICHA).trim();
            if (!fichasUnicas.has(fichaCodigo)) {
                fichasUnicas.add(fichaCodigo);
                const opcion = document.createElement('option');
                opcion.value = fichaCodigo;
                opcion.textContent = `${fichaCodigo} - ${aprendiz.PROGRAMA}`;
                select.appendChild(opcion);
            }
        });
    } catch (error) {
        console.error('Error al cargar las fichas:', error);
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar las fichas",
            icon: "error",
            timer: 2000,
            showConfirmButton: false
        });
    }
}

async function cargarAprendices(codigoFicha) {
    console.log(`Cargando aprendices ficha ${codigoFicha}`);
    try {
        const respuesta = await fetch('https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/SENA-CTPI.matriculados.json');
        const aprendices = await respuesta.json();

        console.log("Filtrando ",aprendices.length, " aprendices");

        const lista = aprendices.filter((a) => String(a.FICHA).trim() === codigoFicha);
        console.log("Tamanio de la lista es ",lista.length);
        console.log(lista);
        // Guardar info en localStorage
        if (lista.length > 0) {
            localStorage.setItem("codigoFicha", codigoFicha);
            localStorage.setItem("estadoFicha", lista[0].ESTADO_FICHA);
            localStorage.setItem("nivelFormacion", lista[0].NIVEL_DE_FORMACION);
            localStorage.setItem("nombrePrograma", lista[0].PROGRAMA);
        }

        mostrarAprendices(lista);
    } catch (error) {
        console.error('Error al cargar los aprendices:', error);
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los aprendices",
            icon: "error",
            timer: 2000,
            showConfirmButton: false
        });
    }
}

// Función para mostrar aprendices en la tabla
function mostrarAprendices(lista) {
    const tbody = document.querySelector("#tablaAprendices");
    tbody.innerHTML = "";

    lista.forEach(aprendiz => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${aprendiz.TIPO_DOCUMENTO}</td>
            <td>${aprendiz.NUMERO_DOCUMENTO}</td>
            <td>${aprendiz.NOMBRE}</td>
            <td>${aprendiz.PRIMER_APELLIDO}</td>
            <td>${aprendiz.SEGUNDO_APELLIDO}</td>
            <td>${aprendiz.ESTADO_APRENDIZ}</td>
        `

        // Resaltar si estado = Retiro Voluntario
        if (aprendiz.ESTADO_APRENDIZ === "Retiro voluntario") {
            fila.classList.add("table-danger");
        }

        if (aprendiz.ESTADO_APRENDIZ === "Cancelado") {
            fila.classList.add("table-secondary");    
        }
        tbody.appendChild(fila);
    });
}