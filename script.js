const form = document.getElementById("formTurno");
const listaTurnos = document.getElementById("listaTurnos");
const borrarTodo = document.getElementById("borrarTodo");
const contenedorServicios = document.getElementById("servicios");

let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
let servicioSeleccionado = null;

// 📸 Lista de servicios con imágenes locales
const servicios = [
  { nombre: "Depilación láser", img: "img/images.jpg" },
  { nombre: "Limpieza facial profunda, Dermaplaning", img: "img/limpieza-facial-profunda.jpg" },
  { nombre: "Tratamiento con dermapen", img: "img/Tratamiento con dermapen.jpg" },
  { nombre: "Plasma pen", img: "img/Plasma pen.jpg" },
  { nombre: "Criolipólisis", img: "img/criolipolisis.jpg" },
  { nombre: "Mesoterapia capilar", img: "img/Mesoterapia capilar.jpg" },
  { nombre: "Plasma rico en plaquetas (Rostro, cuello, escote, manos)", img: "img/Plasma rico en plaquetas(Rostro,cuello,escote,manos).jpg" }
];

// Crear cards dinámicamente
servicios.forEach(serv => {
  const col = document.createElement("div");
  col.className = "col";

  const card = document.createElement("div");
  card.className = "card servicio-card text-center h-100";

  card.innerHTML = `
    <img src="${serv.img}" alt="${serv.nombre}" class="card-img-top">
    <div class="card-body d-flex align-items-center justify-content-center">
      <h6 class="card-title">${serv.nombre}</h6>
    </div>
  `;

  card.addEventListener("click", () => {
    document.querySelectorAll(".servicio-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    servicioSeleccionado = serv.nombre;
  });

  col.appendChild(card);
  contenedorServicios.appendChild(col);
});

mostrarTurnos();

// Guardar turno
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !fecha || !hora || !servicioSeleccionado) {
    alert("Por favor completa todos los campos y selecciona un servicio");
    return;
  }

  const existe = turnos.some((t) => t.fecha === fecha && t.hora === hora);
  if (existe) {
    alert("⚠️ Ya existe un turno registrado para esa fecha y hora.");
    return;
  }

  const turno = {
    id: Date.now(),
    nombre,
    fecha,
    hora,
    servicio: servicioSeleccionado
  };

  turnos.push(turno);
  guardarTurnos();
  mostrarTurnos();
  form.reset();

  document.querySelectorAll(".servicio-card").forEach(c => c.classList.remove("active"));
  servicioSeleccionado = null;
});

// Mostrar turnos
function mostrarTurnos() {
  listaTurnos.innerHTML = "";

  if (turnos.length === 0) {
    listaTurnos.innerHTML =
      '<li class="list-group-item text-center text-muted">No hay turnos registrados</li>';
    return;
  }

  turnos.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

  turnos.forEach((t) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${t.nombre}</strong> 
        <div class="text-muted">${t.fecha} - ${t.hora}</div>
        <span class="badge bg-info text-dark mt-2">${t.servicio}</span>
      </div>
      <button class="btn btn-sm btn-outline-danger">🗑️</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      if (confirm("¿Eliminar este turno?")) {
        turnos = turnos.filter((turno) => turno.id !== t.id);
        guardarTurnos();
        mostrarTurnos();
      }
    });

    listaTurnos.appendChild(li);
  });
}

function guardarTurnos() {
  localStorage.setItem("turnos", JSON.stringify(turnos));
}

borrarTodo.addEventListener("click", () => {
  if (confirm("¿Seguro que querés eliminar todos los turnos?")) {
    turnos = [];
    guardarTurnos();
    mostrarTurnos();
  }
});
