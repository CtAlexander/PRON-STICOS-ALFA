import { auth, db } from "./firebase.js";

/* AUTH */
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

/* DATABASE */
import {
  ref,
  onValue,
  set,
  get
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

/* =========================
   API FOOTBALL
========================= */

const API_KEY = "a1e6b1e733198902b1ca4764905af41f";
const API_URL = "https://v3.football.api-sports.io";

/* =========================
   LOGIN
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  cargarUsuario(user.uid);

  await sincronizarPartidosHibrido();

  cargarPartidosDesdeFirebase();
});

/* =========================
   USUARIO
========================= */

function cargarUsuario(uid) {

  const usuarioRef = ref(db, "usuarios/" + uid);

  onValue(usuarioRef, (snapshot) => {

    const usuario = snapshot.val();

    if (!usuario) return;

    document.getElementById("nombreUsuario").innerText =
      usuario.nombre || "Usuario Alfa";

    document.getElementById("creditosAlfa").innerText =
      usuario.creditosAlfa || 0;

    document.getElementById("apostadas").innerText =
      usuario.apostadas || 0;

    document.getElementById("ganadas").innerText =
      usuario.ganadas || 0;

    document.getElementById("perdidas").innerText =
      usuario.perdidas || 0;
  });
}

/* =========================
   🔥 SISTEMA HÍBRIDO INTELIGENTE
========================= */

async function sincronizarPartidosHibrido() {

  try {

    const respuesta = await fetch(
      `${API_URL}/fixtures?from=2026-06-10&to=2026-06-30`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const datos = await respuesta.json();

    console.log("API RESPONSE:", datos);

    let partidos = datos.response || [];

    /* =========================
       ❌ SI API FALLA → CREAR BASE FIJA
    ========================= */

    if (partidos.length === 0) {

      console.log("⚠️ API vacía → creando partidos base en Firebase");

      await crearPartidosBase();

      return;
    }

    /* =========================
       ✔ SI API FUNCIONA → GUARDAR
    ========================= */

    for (const partido of partidos) {

      await set(
        ref(db, "partidos/" + partido.fixture.id),
        {
          fixtureId: partido.fixture.id,

          local: partido.teams.home.name,
          visitante: partido.teams.away.name,

          logoLocal: partido.teams.home.logo,
          logoVisitante: partido.teams.away.logo,

          fecha: partido.fixture.date,

          estadio: partido.fixture.venue?.name || "Por definir",
          ciudad: partido.fixture.venue?.city || "",

          estado: partido.fixture.status?.long || "Programado",
          minuto: partido.fixture.status?.elapsed || 0,

          golesLocal: partido.goals?.home ?? 0,
          golesVisitante: partido.goals?.away ?? 0,

          usuariosParticipando: 0,
          bolsaTotal: 0,

          actualizado: Date.now()
        }
      );
    }

    console.log("✅ Partidos sincronizados desde API");

  } catch (error) {

    console.log("❌ API falló → usando partidos base");

    await crearPartidosBase();
  }
}


/* =========================
   ESCUDOS
========================= */


  function obtenerEscudo(nombre) {

  const mapa = {

    // GRUPO A
    "México": "escudos/méxico.jpg",
    "Sudáfrica": "escudos/sudáfrica.jpg",
    "Corea del Sur": "escudos/corea del sur.jpg",
    "Chequia": "escudos/chequia.jpg",

    // GRUPO B
    "Canadá": "escudos/canadá.jpg",
    "Bosnia": "escudos/bosnia.jpg",
    "Estados Unidos": "escudos/estados unidos.jpg",
    "Paraguay": "escudos/paraguay.jpg",

    // GRUPO C
    "Qatar": "escudos/qatar.jpg",
    "Suiza": "escudos/suiza.jpg",
    "Brasil": "escudos/brasil.jpg",
    "Marruecos": "escudos/marruecos.jpg",

    // GRUPO D
    "Haití": "escudos/haití.jpg",
    "Escocia": "escudos/escocia.jpg",
    "Australia": "escudos/australia.jpg",
    "Turquía": "escudos/turquía.jpg",

    // GRUPO E
    "Alemania": "escudos/alemania.jpg",
    "Curazao": "escudos/curazao.jpg",
    "Holanda": "escudos/holanda.jpg",
    "Japón": "escudos/japón.jpg",

    // GRUPO F
    "Costa de Marfil": "escudos/costa de marfil.jpg",
    "Ecuador": "escudos/ecuador.jpg",
    "Suecia": "escudos/suecia.jpg",
    "Túnez": "escudos/túnez.jpg",

    // GRUPO G
    "Argentina": "escudos/argentina.jpg",
    "Polonia": "escudos/polonia.jpg",
    "Egipto": "escudos/egipto.jpg",
    "Irán": "escudos/irán.jpg",

    // GRUPO H
    "Francia": "escudos/francia.jpg",
    "Dinamarca": "escudos/dinamarca.jpg",
    "Perú": "escudos/perú.jpg",
    "China": "escudos/china.jpg"

  };

  return mapa[nombre] || "escudos/default.jpg";

}


/* =========================
   ⚽ CREAR PARTIDOS BASE
========================= */

async function crearPartidosBase() {

  try {

    const snapshot = await get(ref(db, "partidos"));

    // Si ya existen partidos no volver a crearlos
    if (snapshot.exists()) {

      console.log("✅ Los partidos ya existen en Firebase");

      return;

    }

    console.log("⚽ Creando partidos iniciales...");

    const partidosBase = [

      {
        id: 1,
        local: "México",
        visitante: "Sudáfrica",
        logoLocal: obtenerEscudo("México"),
        logoVisitante: obtenerEscudo("Sudáfrica"),
        fecha: "2026-06-11T13:00:00",
        estadio: "Estadio Azteca",
        ciudad: "CDMX",
        grupo: "A"
      },

      {
        id: 2,
        local: "Corea del Sur",
        visitante: "Chequia",
        logoLocal: obtenerEscudo("Corea del Sur"),
        logoVisitante: obtenerEscudo("Chequia"),
        fecha: "2026-06-11T20:00:00",
        estadio: "Estadio Guadalajara",
        ciudad: "Guadalajara",
        grupo: "A"
      },

      {
        id: 3,
        local: "Canadá",
        visitante: "Bosnia",
        logoLocal: obtenerEscudo("Canadá"),
        logoVisitante: obtenerEscudo("Bosnia"),
        fecha: "2026-06-12T13:00:00",
        estadio: "Toronto Stadium",
        ciudad: "Toronto",
        grupo: "B"
      },

      {
        id: 4,
        local: "Estados Unidos",
        visitante: "Paraguay",
        logoLocal: obtenerEscudo("Estados Unidos"),
        logoVisitante: obtenerEscudo("Paraguay"),
        fecha: "2026-06-12T19:00:00",
        estadio: "Los Ángeles Stadium",
        ciudad: "Los Ángeles",
        grupo: "D"
      }

    ];

    for (const p of partidosBase) {

      await set(
        ref(db, "partidos/" + p.id),
        {
          fixtureId: p.id,

          grupo: p.grupo,

          local: p.local,
          visitante: p.visitante,

          logoLocal: p.logoLocal,
          logoVisitante: p.logoVisitante,

          fecha: p.fecha,
          estadio: p.estadio,
          ciudad: p.ciudad,

          estado: "Programado",

          golesLocal: 0,
          golesVisitante: 0,

          usuariosParticipando: 0,
          bolsaTotal: 0,

          cierreApuestas:
            new Date(p.fecha).getTime() - (60 * 60 * 1000),

          actualizado: Date.now()
        }
      );

    }

    console.log("🔥 Partidos creados correctamente");

  } catch (error) {

    console.error(
      "❌ Error creando partidos:",
      error
    );

  }

}
/* =========================
   PARTIDO DESTACADO
========================= */

function cargarPartidoDestacado(partidos) {

  if (!partidos.length) return;

  partidos.sort(
    (a, b) =>
      new Date(a.fecha) - new Date(b.fecha)
  );

  const partido = partidos[0];

  document.getElementById("equipoLocal").innerText =
    partido.local;

  document.getElementById("equipoVisitante").innerText =
    partido.visitante;

  document.getElementById("logoLocal").src =
    partido.logoLocal ||
    obtenerEscudo(partido.local);

  document.getElementById("logoVisitante").src =
    partido.logoVisitante ||
    obtenerEscudo(partido.visitante);

  document.getElementById("infoPartido").innerHTML = `
    📅 ${new Date(partido.fecha).toLocaleString("es-MX")}<br>
    🏟️ ${partido.estadio}<br>
    🌎 ${partido.ciudad}
  `;

  document.getElementById("btnApostar").onclick = () => {
    abrirPartido(partido.fixtureId);
  };

}
/* =========================
   MOSTRAR PARTIDOS
========================= */

function cargarPartidosDesdeFirebase() {

  const contenedor =
    document.getElementById("listaPartidos");

  if (!contenedor) return;

  const partidosRef =
    ref(db, "partidos");

  onValue(partidosRef, (snapshot) => {

    const datos = snapshot.val();

    contenedor.innerHTML = "";

    if (!datos) {

      contenedor.innerHTML = `
        <div style="padding:20px">
          No hay partidos disponibles.
        </div>
      `;

      return;
    }

    let partidos = Object.values(datos);

    // ORDENAR POR FECHA
    partidos.sort((a, b) =>
      new Date(a.fecha) - new Date(b.fecha)
    );

    const ahora = new Date();

    // SOLO PARTIDOS FUTUROS
    const proximos = partidos.filter(partido =>
      new Date(partido.fecha) > ahora
    );

    if (proximos.length === 0) {

      contenedor.innerHTML = `
        <div style="padding:20px">
          No hay más partidos programados.
        </div>
      `;

      return;
    }

    // PARTIDO DESTACADO
    cargarPartidoDestacado(proximos);

    // MOSTRAR SOLO LOS SIGUIENTES 3
    const mostrar =
      proximos.slice(0, 3);

    contenedor.innerHTML = "";

    mostrar.forEach(partido => {

      contenedor.innerHTML += `

      <div class="match-row">

        <div style="
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          margin-bottom:10px;
        ">

          <img
            src="${partido.logoLocal}"
            width="45"
            height="45"
          >

          <strong>
            ${partido.local}
          </strong>

          <span>VS</span>

          <strong>
            ${partido.visitante}
          </strong>

          <img
            src="${partido.logoVisitante}"
            width="45"
            height="45"
          >

        </div>

        <div>
          🏆 Grupo ${partido.grupo || "-"}
        </div>

        <div>
          📅 ${new Date(
            partido.fecha
          ).toLocaleString("es-MX")}
        </div>

        <div>
          🏟️ ${partido.estadio}
        </div>

        <div>
          🌎 ${partido.ciudad}
        </div>

        <div>
          ⚽ ${partido.golesLocal || 0}
          -
          ${partido.golesVisitante || 0}
        </div>

        <div>
          🔴 ${partido.estado || "Programado"}
        </div>

        <div>
          👥 ${partido.usuariosParticipando || 0}
          usuarios apostando
        </div>

        <div>
          💰 Bolsa:
          ${partido.bolsaTotal || 0}
          Créditos Alfa
        </div>

        <button
          class="odds-btn"
          onclick="abrirPartido('${partido.fixtureId}')">

          APOSTAR

        </button>

      </div>

      `;

    });

  });

}
/* =========================
   APUESTAS
========================= */

window.abrirPartido = function (id) {

  localStorage.setItem("partidoSeleccionado", id);
  window.location.href = "apuestas.html";
};

/* =========================
   LOGOUT
========================= */

window.cerrarSesion = async function () {

  await signOut(auth);
  window.location.href = "login.html";
};

/* =========================
   AUTO REFRESH
========================= */

setInterval(() => {
  sincronizarPartidosHibrido();
}, 300000);