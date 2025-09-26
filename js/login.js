// login.js
// Autor: Cristian Camilo Lara Montero
// Fecha: 2024-06-20
// Descripción: Manejo del login y redirección a main.html si las credenciales son correctas.
// Credenciales válidas: cualquier usuario con la contraseña "adso3064975".

// Esperar a que el DOM esté completamente cargado y luego iniciar la aplicación.
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente cargado');
    inicioApp();
});

document.querySelector('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario
    
    const usuario = document.querySelector("#usuario");
    const password = document.querySelector("#password");

    if (usuario.value !== "" && password.value === "adso3064975") {
        
        // Limpiar los campos del formulario
        const username =  usuario.value;
        usuario.value = "";
        password.value = "";

        // Usando SweetAlert para mostrar el mensaje de éxito
        Swal.fire({
            title: "Login exitoso",
            text: "Credenciales correctas",
            icon: "success"
        }).then(() => {
           
            // Guardar el estado de login en sessionStorage
            sessionStorage.setItem('loggedIn','true');
            sessionStorage.setItem('usuario', username);

            // Redirigir a main.html
            window.location.href = "main.html";
        });
    } else {
        Swal.fire({
            title: "Error de login",
            text: "Credenciales incorrectas",
            icon: "error",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }
});
    
// Función para iniciar la aplicación y verificar el estado de login
function inicioApp() {
    
    // Verificar si el usuario ya ha iniciado sesión
    if (sessionStorage.getItem('loggedIn') === 'true' && sessionStorage.getItem('usuario') !== null) {
        Swal.fire({
        title: "Redireccionando...",
        text: "Ya estás logueado",
        icon: "info",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
        }).then(() => {
        window.location.href = "main.html"; // Redirigir a main.html
        });
    }
}
