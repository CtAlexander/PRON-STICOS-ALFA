import { auth, db }
from "./firebase.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
ref,
get
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

let usuarioActual = null;

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

usuarioActual = user;

await cargarMisApuestas();

});

async function cargarMisApuestas(){

const contenedor =
document.getElementById(
"contenedorApuestas"
);

contenedor.innerHTML="";

const partidosRef =
ref(db,"partidos");

const partidosSnap =
await get(partidosRef);

if(!partidosSnap.exists()){

contenedor.innerHTML=
"No existen partidos";

return;

}

const partidos =
partidosSnap.val();

let html="";

for(const partidoId in partidos){

const apuestaRef =
ref(
db,
`apuestas/${partidoId}/${usuarioActual.uid}`
);

const apuestaSnap =
await get(apuestaRef);

if(!apuestaSnap.exists())
continue;

const apuesta =
apuestaSnap.val();

const partido =
partidos[partidoId];

html += crearTarjetaApuesta(
partidoId,
partido,
apuesta
);

}

if(html===""){

html=`

<div class="card">

<h2>

Todavía no tienes apuestas

</h2>

</div>

`;

}

contenedor.innerHTML=html;

}

function crearTarjetaApuesta(
partidoId,
partido,
apuesta
){

let estadoApuesta =
"⏳ En Curso";

let clase =
"curso";

if(
partido.estado ===
"Finalizado"
){

const gl =
Number(
partido.golesLocal || 0
);

const gv =
Number(
partido.golesVisitante || 0
);

let ganadorReal =
"EMPATE";

if(gl > gv)
ganadorReal =
partido.local;

if(gv > gl)
ganadorReal =
partido.visitante;

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

if(acertoMarcador){

estadoApuesta =
"🎯 Marcador Exacto";

clase =
"exacto";

}

else if(acertoGanador){

estadoApuesta =
"✅ Ganada";

clase =
"ganada";

}

else{

estadoApuesta =
"❌ Perdida";

clase =
"perdida";

}

}

return `

<div class="card-apuesta ${clase}">

<h2>

${partido.local}

VS

${partido.visitante}

</h2>

<p>

📅

${new Date(
partido.fecha
).toLocaleString("es-MX")}

</p>

<p>

🏆 Grupo

${partido.grupo}

</p>

<p>

💰 Apostaste

${apuesta.creditos}
 Créditos Alfa

</p>

<p>

⚽ Ganador elegido:

${apuesta.ganador}

</p>

<p>

🎯 Marcador:

${apuesta.marcadorLocal}
-

${apuesta.marcadorVisitante}

</p>

<p>

📊 Estado Partido:

${partido.estado}

</p>

<p>

🏁 Resultado:

${partido.golesLocal || 0}
-

${partido.golesVisitante || 0}

</p>

<h3>

${estadoApuesta}

</h3>

</div>

`;

}