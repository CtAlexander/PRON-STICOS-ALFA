

import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
ref,
get,
onValue,
set,
update
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

let usuarioActual = null;
let partidoActual = null;
let partidoId = null;

let sistemaActivo = true;
let listenerSaldo = null;
let listenerPartido = null;

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "login.html";
return;
}

usuarioActual = user;
cargarPartido();
cargarSaldo();
escucharSaldo();

});

function cargarPartido() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    partidoId =
        params.get("id")
        ||
        localStorage.getItem(
            "partidoSeleccionado"
        );

    if (!partidoId) return;

    const partidoRef =
        ref(
            db,
            "partidos/" + partidoId
        );

    listenerPartido =
        onValue(
            partidoRef,
            (snap) => {

                if (!sistemaActivo)
                    return;

                partidoActual =
                    snap.val();

                if (!partidoActual)
                    return;

                renderPartido();

                /* ==========================
                   ACTUALIZAR DATOS
                ========================== */

                actualizarInformacionApuestas();

                if (
                    typeof actualizarBotonPremio
                    === "function"
                ) {

                    actualizarBotonPremio();

                }

            }
        );

}

function renderPartido() {

    const contenedor =
        document.getElementById(
            "partidoSeleccionado"
        );

    if (!contenedor)
        return;

    contenedor.innerHTML = `

    <div class="match-row">

        <div style="
            display:flex;
            justify-content:center;
            align-items:center;
            gap:15px;
            margin-bottom:15px;
        ">

            <img
                src="${partidoActual.logoLocal}"
                width="60"
                height="60"
            >

            <h2>
                ${partidoActual.local}
            </h2>

            <span>
                VS
            </span>

            <h2>
                ${partidoActual.visitante}
            </h2>

            <img
                src="${partidoActual.logoVisitante}"
                width="60"
                height="60"
            >

        </div>

        <div>
            🏆 Grupo ${partidoActual.grupo}
        </div>

        <div>
            📅 ${new Date(
                partidoActual.fecha
            ).toLocaleString("es-MX")}
        </div>

        <div>
            🏟️ ${partidoActual.estadio}
        </div>

        <div>
            🌎 ${partidoActual.ciudad || ""}
        </div>

        <div>
            👥 Usuarios apostando:
            <strong>
                ${partidoActual.usuariosParticipando || 0}
            </strong>
        </div>

        <div>
            💰 Bolsa acumulada:
            <strong>
                ${partidoActual.bolsaTotal || 0}
                Créditos Alfa
            </strong>
        </div>

    </div>

    `;

    /* ==========================
       SELECT GANADOR
    ========================== */

    if (
        typeof llenarSelect ===
        "function"
    ) {

        llenarSelect();

    }

    /* ==========================
       PANEL ESTADÍSTICAS
    ========================== */

    if (
        typeof actualizarInformacionApuestas ===
        "function"
    ) {

        actualizarInformacionApuestas();

    }

    /* ==========================
       BOTÓN PREMIO
    ========================== */

    if (
        typeof actualizarBotonPremio ===
        "function"
    ) {

        actualizarBotonPremio();

    }

    /* ==========================
       CONTADOR CIERRE
    ========================== */

    if (
        typeof iniciarContadorCierre ===
        "function"
    ) {

        iniciarContadorCierre();

    }

}
function llenarSelect() {

  const select =
    document.getElementById("ganador");

  if (!select || !partidoActual)
    return;

  select.innerHTML = `
    <option value="">
      Seleccionar
    </option>

    <option value="${partidoActual.local}">
      ${partidoActual.local}
    </option>

    <option value="${partidoActual.visitante}">
      ${partidoActual.visitante}
    </option>
  `;
}




async function cargarSaldo() {

if (!usuarioActual) return;

const r = ref(db, "usuarios/" + usuarioActual.uid);
const snap = await get(r);

if (!snap.exists()) return;

const u = snap.val();

const el = document.getElementById("saldoUsuario");
if (el) el.innerText = u.creditosAlfa || 0;

}

function escucharSaldo() {

if (!usuarioActual) return;

const r = ref(db, "usuarios/" + usuarioActual.uid);

onValue(r, (snap) => {

if (!snap.exists()) return;

const u = snap.val();

const el = document.getElementById("saldoUsuario");
if (el) el.innerText = u.creditosAlfa || 0;

});

}

function mostrarModalConfirmacion() {

const ganador = document.getElementById("ganador").value;
const local = document.getElementById("marcadorLocal").value;
const visitante = document.getElementById("marcadorVisitante").value;
const creditos = document.getElementById("creditos").value;

if (!ganador) return alert("Selecciona ganador");

const modal = document.getElementById("modalConfirmacion");
if (!modal) return;

// 🔥 TEXTO DINÁMICO PRO
modal.querySelector("p").innerHTML =
`Vas a apostar <b>${creditos}</b> créditos en este partido`;

modal.querySelector("ul").innerHTML = `
<li><b>${ganador}</b> como ganador</li>
<li>Marcador: <b>${local} - ${visitante}</b></li>
<li>Bolsa total se actualiza automáticamente</li>
<li>No se puede cancelar después de confirmar</li>
<li>Premios se calculan al finalizar el partido</li>
`;

modal.style.display = "flex";
}


document.addEventListener("DOMContentLoaded", () => {

document.getElementById("btnContinuar")
?.addEventListener("click", mostrarModalConfirmacion);

document.getElementById("btnCancelar")
?.addEventListener("click", () => {
document.getElementById("modalConfirmacion").style.display = "none";
});

document.getElementById("btnConfirmar")
?.addEventListener("click", async () => {

document.getElementById("modalConfirmacion").style.display = "none";

await registrarApuesta(
document.getElementById("ganador").value,
Number(document.getElementById("marcadorLocal").value || 0),
Number(document.getElementById("marcadorVisitante").value || 0),
Number(document.getElementById("creditos").value || 0)
);

});

});

async function registrarApuesta(ganador, local, visitante, creditos) {

    // 🔥 VALIDAR SI LAS APUESTAS YA CERRARON
    if (apuestasCerradas()) {

        alert(
            "⛔ Las apuestas para este partido ya están cerradas."
        );

        return;
    }

    if (!usuarioActual || !partidoActual) return;

    const uid = usuarioActual.uid;

    // 🔥 EVITAR DOBLE APUESTA
    const apuestaRef = ref(db, `apuestas/${partidoId}/${uid}`);
    const existe = await get(apuestaRef);

    if (existe.exists()) {
        alert("Ya apostaste en este partido");
        return;
    }

    // 🔥 USUARIO
    const userRef = ref(db, "usuarios/" + uid);
    const userSnap = await get(userRef);
    const user = userSnap.val();

    if ((user.creditosAlfa || 0) < creditos) {
        alert("Sin créditos");
        return;
    }

    // 🔥 GUARDAR APUESTA
    await set(apuestaRef, {
        uid,
        nombre: user.nombre,
        ganador,
        marcadorLocal: local,
        marcadorVisitante: visitante,
        creditos,
        fecha: Date.now()
    });

    // 🔥 DESCONTAR SALDO
    await update(userRef, {
        creditosAlfa: user.creditosAlfa - creditos
    });

    // 🔥 ACTUALIZAR PARTIDO
    const partidoRef = ref(db, "partidos/" + partidoId);
    const partidoSnap = await get(partidoRef);
    const partido = partidoSnap.val();

    await update(partidoRef, {
        usuariosParticipando: (partido.usuariosParticipando || 0) + 1,
        bolsaTotal: (partido.bolsaTotal || 0) + creditos
    });

    alert("APUESTA REGISTRADA ✔");
    location.reload();

}

function apuestasCerradas() {

    if (!partidoActual) return true;
    const fechaPartido =
        new Date(
            partidoActual.fecha
        ).getTime();

    // Cierre 1 hora antes del inicio
    const cierreApuestas =
        fechaPartido -
        (60 * 60 * 1000);

    return Date.now() >= cierreApuestas;

}

/* ==========================================
   BOTON RECLAMAR PREMIO ALFA
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const btn =
        document.getElementById(
            "btnReclamarPremio"
        );

    if (!btn) return;

    btn.addEventListener(
        "click",
        async (e) => {

            e.preventDefault();

            await reclamarPremioAutomatico();

        }
    );

});

/* ==========================================
   RECLAMAR PREMIO
========================================== */

async function reclamarPremioAutomatico() {

    const mensaje =
        document.getElementById(
            "mensajePremio"
        );

    if (
        !usuarioActual ||
        !partidoActual
    ) {
        return;
    }

    /* ==========================
       PARTIDO NO TERMINADO
    ========================== */

    if (
        partidoActual.estado !==
        "Finalizado"
    ) {

        mensaje.innerHTML = `
            <div class="match-row">
                ⏳ El partido aún no ha finalizado.
                <br>
                Los premios estarán disponibles
                cuando se registre el resultado final.
            </div>
        `;

        return;
    }

    /* ==========================
       EVITAR DOBLE RECLAMO
    ========================== */

    const premioRef =
        ref(
            db,
            `premiosReclamados/${partidoId}/${usuarioActual.uid}`
        );

    const premioSnap =
        await get(premioRef);

    if (premioSnap.exists()) {

        mensaje.innerHTML = `
            <div class="match-row">
                ✅ Este premio ya fue reclamado.
            </div>
        `;

        return;
    }

    /* ==========================
       OBTENER APUESTAS
    ========================== */

    const apuestasRef =
        ref(
            db,
            `apuestas/${partidoId}`
        );

    const apuestasSnap =
        await get(apuestasRef);

    if (!apuestasSnap.exists()) {

        mensaje.innerHTML = `
            <div class="match-row">
                No existen apuestas registradas.
            </div>
        `;

        return;
    }

    const apuestas =
        apuestasSnap.val();

    /* ==========================
       CALCULAR PREMIO
    ========================== */

    const resultado =
        calcularPremioUsuario(
            apuestas,
            usuarioActual.uid
        );

    if (!resultado) {

        mensaje.innerHTML = `
            <div class="match-row">
                ❌ No obtuviste premio
                en este encuentro.
            </div>
        `;

        return;
    }

    /* ==========================
       SUMAR CREDITOS
    ========================== */

    const usuarioRef =
        ref(
            db,
            "usuarios/" +
            usuarioActual.uid
        );

    const usuarioSnap =
        await get(usuarioRef);

    const usuario =
        usuarioSnap.val();

    await update(
        usuarioRef,
        {
            creditosAlfa:
                (usuario.creditosAlfa || 0)
                +
                resultado.monto
        }
    );

    /* ==========================
       GUARDAR RECLAMO
    ========================== */

    await set(
        premioRef,
        {
            uid:
                usuarioActual.uid,

            partidoId,

            monto:
                resultado.monto,

            fecha:
                Date.now()
        }
    );

    /* ==========================
       MENSAJE FINAL
    ========================== */

    mensaje.innerHTML = `
        <div class="match-row">

            <h3>
                🎉 FELICIDADES
            </h3>

            <p>
                ${resultado.tipo}
            </p>

            <p>
                ${resultado.detalle}
            </p>

            <h2>
                💰 ${resultado.monto}
                Créditos Alfa
            </h2>

            <p>
                Los créditos ya fueron
                abonados a tu cuenta.
            </p>

        </div>
    `;

    cargarSaldo();

}

/* ==========================================
   CALCULAR PREMIO AUTOMATICO
========================================== */

function calcularPremioUsuario(
    apuestas,
    uid
) {

    const gl =
        Number(
            partidoActual.golesLocal || 0
        );

    const gv =
        Number(
            partidoActual.golesVisitante || 0
        );

    let ganadorReal = "EMPATE";

    if (gl > gv)
        ganadorReal =
            partidoActual.local;

    if (gv > gl)
        ganadorReal =
            partidoActual.visitante;

    const bolsaTotal =
        Number(
            partidoActual.bolsaTotal || 0
        );

    /* ==========================
       10% PARA ALFA
    ========================== */

    const bolsaNeta =
        Math.floor(
            bolsaTotal * 0.90
        );

    let exactos = [];
    let ganadores = [];

    for (const id in apuestas) {

        const apuesta =
            apuestas[id];

        const acertoGanador =
            apuesta.ganador ===
            ganadorReal;

        const acertoMarcador =

            Number(
                apuesta.marcadorLocal
            ) === gl

            &&

            Number(
                apuesta.marcadorVisitante
            ) === gv;

        if (acertoMarcador) {

            exactos.push(
                apuesta
            );

        }

        else if (
            acertoGanador
        ) {

            ganadores.push(
                apuesta
            );

        }

    }

    const soyExacto =
        exactos.find(
            x => x.uid === uid
        );

    const soyGanador =
        ganadores.find(
            x => x.uid === uid
        );

    /* ==========================
       MARCADOR EXACTO
    ========================== */

    if (exactos.length > 0) {

        const fondoExacto =
            Math.floor(
                bolsaNeta * 0.70
            );

        const fondoGanadores =
            Math.floor(
                bolsaNeta * 0.30
            );

        if (soyExacto) {

            return {

                monto:
                    Math.floor(
                        fondoExacto /
                        exactos.length
                    ),

                tipo:
                    "🎯 Marcador Exacto",

                detalle:
                    `Compartido entre ${exactos.length} ganador(es)`

            };

        }

        if (
            soyGanador &&
            ganadores.length > 0
        ) {

            return {

                monto:
                    Math.floor(
                        fondoGanadores /
                        ganadores.length
                    ),

                tipo:
                    "🏆 Acertaste el ganador",

                detalle:
                    `Compartido entre ${ganadores.length} ganador(es)`

            };

        }

        return null;

    }

    /* ==========================
       SOLO GANADOR
    ========================== */

    if (
        ganadores.length > 0 &&
        soyGanador
    ) {

        return {

            monto:
                Math.floor(
                    bolsaNeta /
                    ganadores.length
                ),

            tipo:
                "🏆 Acertaste el ganador",

            detalle:
                `Compartido entre ${ganadores.length} ganador(es)`

        };

    }

    return null;

}

/* ==========================================
   INFORMACIÓN DE APUESTAS EN TIEMPO REAL
========================================== */

function actualizarInformacionApuestas() {

    if (!partidoActual) return;

    /* ==========================
       USUARIOS PARTICIPANDO
    ========================== */

    const usuarios =
        partidoActual.usuariosParticipando || 0;

    const usuariosEl =
        document.getElementById(
            "usuariosParticipando"
        );

    if (usuariosEl) {

        usuariosEl.innerText =
            usuarios;

    }

    /* ==========================
       BOLSA TOTAL
    ========================== */

    const bolsa =
        partidoActual.bolsaTotal || 0;

    const bolsaEl =
        document.getElementById(
            "bolsaTotal"
        );

    if (bolsaEl) {

        bolsaEl.innerText =
            bolsa;

    }

}



let intervaloContador = null;

function iniciarContadorCierre() {

    const contador =
        document.getElementById("contador");

    if (!contador) return;

    if (!partidoActual) return;

    clearInterval(intervaloContador);

    intervaloContador = setInterval(() => {

        const fechaPartido =
            new Date(
                partidoActual.fecha
            ).getTime();

        if (isNaN(fechaPartido)) {

            contador.innerText =
                "SIN FECHA";

            return;
        }

        /* CIERRE = 1 HORA ANTES */

        const fechaCierre =
            fechaPartido -
            (60 * 60 * 1000);

        const ahora =
            Date.now();

        const restante =
            fechaCierre - ahora;

        /* APUESTAS CERRADAS */

        if (restante <= 0) {

            contador.innerText =
                "CERRADO";

            sistemaActivo = false;

            clearInterval(
                intervaloContador
            );

            return;
        }

        sistemaActivo = true;

        const dias =
            Math.floor(
                restante /
                86400000
            );

        const horas =
            Math.floor(
                (restante % 86400000)
                / 3600000
            );

        const minutos =
            Math.floor(
                (restante % 3600000)
                / 60000
            );

        const segundos =
            Math.floor(
                (restante % 60000)
                / 1000
            );

        contador.innerText =
            `${dias}d ${String(horas).padStart(2,"0")}h ${String(minutos).padStart(2,"0")}m ${String(segundos).padStart(2,"0")}s`;

    }, 1000);

}