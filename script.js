// 1. REFERENCIAS Y ESTADO INICIAL
const modal = document.querySelector('#modalPasos');
const btnIniciar = document.querySelector('#btnIniciar');
const btnFinalizar = document.querySelector('#btnFinalizar');
const galeria = document.querySelector('#galeriaMusica');

// Cargar canciones del LocalStorage al iniciar
let misCanciones = JSON.parse(localStorage.getItem('coleccionMusica')) || [];

// Al cargar el DOM, dibujamos la colección guardada
document.addEventListener('DOMContentLoaded', () => {
  actualizarPantalla();
});

// 2. MANEJO DEL MODAL Y PASOS
btnIniciar.addEventListener('click', () => {
  modal.classList.remove('oculto');
  siguientePaso(1);
});

window.siguientePaso = (n) => {
  document.querySelectorAll('.paso').forEach(p => p.classList.add('oculto'));
  const pasoActual = document.querySelector(`#paso${n}`);
  if (pasoActual) {
    pasoActual.classList.remove('oculto');
    const input = pasoActual.querySelector('input');
    if (input) input.focus();
  }
};

modal.addEventListener('click', (e) => {
  if (e.target === modal) cerrarModal();
});

function cerrarModal() {
  modal.classList.add('oculto');
  document.querySelectorAll('.modal input').forEach(i => i.value = '');
}

// 3. LÓGICA DE PERSISTENCIA Y RENDERIZADO

function actualizarPantalla() {
  galeria.innerHTML = ''; // Limpiamos la vista
  misCanciones.forEach(cancion => {
    renderizarTarjeta(cancion);
  });
}

function renderizarTarjeta(datos) {
  const card = document.createElement('div');
  card.classList.add('spotify-card');
  card.dataset.id = datos.id; // Clave para borrar después

  card.innerHTML = `
        <div class="img-container">
            <img src="${datos.portada}" alt="Portada">
            <div class="play-btn">▶</div>
        </div>
        <div class="card-info">
            <h3>${datos.titulo}</h3>
            <p>${datos.artista}</p>
        </div>
    `;
  galeria.appendChild(card);
}

// 4. EVENTO FINALIZAR (EL QUE GUARDA DE VERDAD)
btnFinalizar.addEventListener('click', () => {
  const titulo = document.querySelector('#inputCancion').value;
  const artista = document.querySelector('#inputArtista').value;
  const portada = document.querySelector('#inputPortada').value;

  if (!titulo || !artista || !portada) {
    alert("Completa todos los datos");
    return;
  }

  // Crear el OBJETO de la canción
  const nuevaCancion = {
    id: Date.now(),
    titulo: titulo,
    artista: artista,
    portada: portada
  };

  // AGREGAR AL ARRAY
  misCanciones.push(nuevaCancion);

  // GUARDAR EL ARRAY EN LOCALSTORAGE (Convertido a texto)
  localStorage.setItem('coleccionMusica', JSON.stringify(misCanciones));

  // MOSTRAR EN PANTALLA
  renderizarTarjeta(nuevaCancion);

  cerrarModal();
});

// 5. BORRAR (CON PERSISTENCIA)
galeria.addEventListener('dblclick', (e) => {
  const tarjetaHTML = e.target.closest('.spotify-card');
  if (tarjetaHTML) {
    const idBorrar = tarjetaHTML.dataset.id;

    // Quitar del ARRAY
    misCanciones = misCanciones.filter(c => c.id != idBorrar);

    // Actualizar el LOCALSTORAGE con el array nuevo
    localStorage.setItem('coleccionMusica', JSON.stringify(misCanciones));

    // Animación y quitar del DOM
    tarjetaHTML.style.opacity = '0';
    setTimeout(() => tarjetaHTML.remove(), 300);
  }
});


// Soporte para tecla Enter en los inputs del modal
modal.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const pasoVisible = document.querySelector('.paso:not(.oculto)');
        const btnSiguiente = pasoVisible.querySelector('button');
        if (btnSiguiente) btnSiguiente.click();
    }
});
