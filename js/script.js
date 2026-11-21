import { productosIniciales } from "./data.js";

// ELEMENTOS DEL DOM
const contenedorProductos = document.getElementById("contenedor-productos"); // donde se van a mostrar los productos
const contenedorCarrito = document.getElementById("contenedorCarrito"); // donde se muestran productos en el carrito
const contadorCarrito = document.getElementById("contadorCarrito"); // contador de productos en el carrito
const totalCarrito = document.getElementById("totalCarrito"); // precio total del carrito
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito"); // botón para vaciar el carrito
const btnCarrito = document.getElementById("btnCarrito"); // botón para abrir el carrito
const carritoDropdown = document.getElementById("carritoDropdown"); // menú desplegable (dropdown) del carrito
const btnCerrarCarrito = document.getElementById("btnCerrarCarrito"); // botón para cerrar el carrito

let carrito = [];

//FUNCIONES DEL LOCAL STORAGE

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");

  if (carritoGuardado) {
    carrito = [...JSON.parse(carritoGuardado)];
  }

  guardarCarrito();
}

function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter((item) => item.id !== idProducto);
  guardarCarrito();
  renderizarCarrito();
}

function actualizarCantidad(idProducto, nuevaCantidad) {
  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(idProducto);
    return;
  }

  carrito = carrito.map((item) =>
    item.id === idProducto ? { ...item, cantidad: nuevaCantidad } : item,
  );

  guardarCarrito();
  renderizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  renderizarCarrito();
}

//FUNCIONES DEL CARRITO

function agregarCarrito(producto) {
  const { id, nombre, precio } = producto;
  const productoExistente = carrito.find((item) => item.id === id);

  if (productoExistente) {
    carrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
    );
  } else {
    const nuevoItem = { id, nombre, precio, cantidad: 1 };
    carrito = [...carrito, nuevoItem];
  }

  guardarCarrito();
  renderizarCarrito();
}

//FUNCIONES DE RENDERIZADO

function renderizarProductos() {
  contenedorProductos.innerHTML = productosIniciales
    .map((producto) => {
      const { id, nombre, precio, stock } = producto;

      return `
                <div class="producto-card">
                    <h3>${nombre}</h3>
                    <div class="producto-info">
                        <span class="precio">${precio.toFixed(2)}€</span>
                        <span class="stock">Stock: ${stock}</span>
                    </div>
                    <button class="btn-agregar" data-id="${id}">
                        Agregar al carrito
                    </button>
                </div>        
        `;
    })
    .join("");
}

function renderizarCarrito() {
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `
                    <div class="carrito-vacio">
                        <p>Tu carrito está vacío</p>
                    </div>
        `;
    contadorCarrito.textContent = "0";
    totalCarrito.textContent = "0.00€";
    return;
  }

  const total = carrito.reduce(
    (suma, { precio, cantidad }) => suma + precio * cantidad,
    0,
  );

  contenedorCarrito.innerHTML = carrito
    .map((item) => {
      const { id, nombre, precio, cantidad } = item;
      const subtotal = precio * cantidad;

      return `
            <div class="carrito-item">
                <div class="item-info">
                    <h4>${nombre}</h4>
                    <p class="item-precio">${precio.toFixed(2)}</p>
                </div>
                <div class="item-cantidad">
                    <button class="btn-cant btn-decrementar" data-id="${id}">-</button>
                    <span>${cantidad}</span>
                    <button class="btn-cant btn-incrementar" data-id="${id}">+</button>
                </div>
                <div class="item-subtotal">${subtotal.toFixed(2)}</div>
                <button class="btn-eliminar" data-id="${id}">x</button>
            </div>
    `;
    })
    .join("");

  const totalItems = carrito.reduce((suma, { cantidad }) => suma + cantidad, 0);
  contadorCarrito.textContent = totalItems;
  totalCarrito.textContent = total.toFixed(2);
}

//EVENTOS

contenedorProductos.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-agregar")) {
    const id = parseInt(evento.target.dataset.id);
    const producto = productosIniciales.find((p) => p.id === id);
    if (producto) {
      agregarCarrito(producto);
    }
  }
});

contenedorCarrito.addEventListener("click", (evento) => {
  const id = parseInt(evento.target.dataset.id);

  if (evento.target.classList.contains("btn-eliminar")) {
    eliminarDelCarrito(id);
  } else if (evento.target.classList.contains("btn-decrementar")) {
    const producto = carrito.find((item) => item.id === id);
    if (producto) {
      actualizarCantidad(id, producto.cantidad - 1);
    }
  } else if (evento.target.classList.contains("btn-incrementar")) {
    const producto = carrito.find((item) => item.id === id);
    if (producto) {
      actualizarCantidad(id, producto.cantidad + 1);
    }
  }
});

btnVaciarCarrito.addEventListener("click", () => {
  if (carrito.length > 0) {
    if (confirm("¿Estás seguro que deseas vaciar el carrito?")) {
      vaciarCarrito();
    }
  }
});

//EVENTOS BOTONES DEL CARRITO

btnCarrito.addEventListener("click", (evento) => {
  evento.stopPropagation();
  carritoDropdown.classList.toggle("active");
});

btnCerrarCarrito.addEventListener("click", (evento) => {
  carritoDropdown.classList.remove("active");
});

carritoDropdown.addEventListener("click", (evento) => {
  evento.stopPropagation();
});

document.addEventListener("click", () => {
  carritoDropdown.classList.remove("active");
});

//INICIO DE LA APLICACIÓN

function init() {
  cargarCarrito();
  renderizarProductos();
  renderizarCarrito();
}

init();
