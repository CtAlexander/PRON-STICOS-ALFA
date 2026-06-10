import { db } from "./firebase.js";

import {
ref,
set,
get,
update,
onValue
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
function obtenerEscudo(nombre) {

    if (!nombre)
        return "escudos/default.jpg";

    const normalizado = nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const mapa = {

        "mexico": "escudos/mexico.jpg",
        "sudafrica": "escudos/sudafrica.jpg",
        "corea del sur": "escudos/corea del sur.jpg",
        "chequia": "escudos/chequia.jpg",

        "canada": "escudos/canada.jpg",
        "bosnia": "escudos/bosnia.jpg",

        "estados unidos": "escudos/estados unidos.jpg",
        "paraguay": "escudos/paraguay.jpg",

        "qatar": "escudos/qatar.jpg",
        "suiza": "escudos/suiza.jpg",

        "brasil": "escudos/brasil.jpg",
        "marruecos": "escudos/marruecos.jpg",

        "haiti": "escudos/haiti.jpg",
        "escocia": "escudos/escocia.jpg",

        "australia": "escudos/australia.jpg",
        "turquia": "escudos/turquia.jpg",

        "alemania": "escudos/alemania.jpg",
        "curazao": "escudos/curazao.jpg",

        "holanda": "escudos/holanda.jpg",
        "japon": "escudos/japon.jpg",

        "costa de marfil": "escudos/costa-marfil.jpg",
        "ecuador": "escudos/ecuador.jpg",

        "suecia": "escudos/suecia.jpg",
        "tunez": "escudos/tunez.jpg",

        "espana": "escudos/espana.jpg",
        "cabo verde": "escudos/cabo-verde.jpg",

        "belgica": "escudos/belgica.jpg",
        "egipto": "escudos/egipto.jpg",

        "arabia saudita": "escudos/arabia-saudita.jpg",
        "uruguay": "escudos/uruguay.jpg",

        "iran": "escudos/iran.jpg",
        "nueva zelanda": "escudos/nueva-zelanda.jpg",

        "francia": "escudos/francia.jpg",
        "senegal": "escudos/senegal.jpg",

        "irak": "escudos/irak.jpg",
        "noruega": "escudos/noruega.jpg",

        "argentina": "escudos/argentina.jpg",
        "argelia": "escudos/argelia.jpg",

        "austria": "escudos/austria.jpg",
        "jordania": "escudos/jordania.jpg",

        "ghana": "escudos/ghana.jpg",
        "panama": "escudos/panama.jpg",

        "inglaterra": "escudos/inglaterra.jpg",
        "croacia": "escudos/croacia.jpg",

        "portugal": "escudos/portugal.jpg",
        "congo": "escudos/congo.jpg",

        "uzbekistan": "escudos/uzbekistan.jpg",
        "colombia": "escudos/colombia.jpg"

    };

    return mapa[normalizado] ||
        "escudos/default.jpg";

}


async function repararEscudosFirebase() {

    const partidosRef =
        ref(db, "partidos");

    const snap =
        await get(partidosRef);

    if (!snap.exists())
        return;

    const partidos =
        snap.val();

    for (const id in partidos) {

        const partido =
            partidos[id];

        await update(
            ref(db, "partidos/" + id),
            {
                logoLocal:
                    obtenerEscudo(
                        partido.local
                    ),

                logoVisitante:
                    obtenerEscudo(
                        partido.visitante
                    )
            }
        );

        console.log(
            "Reparado:",
            partido.local,
            "vs",
            partido.visitante
        );

    }

}

async function crearPartidosFaltantes() {

const partidos = [

/* YA EXISTEN EN DASHBOARD:
1001 México vs Sudáfrica
1002 Corea del Sur vs Chequia
1003 Canadá vs Bosnia
*/

/* ===== PARTIDOS FALTANTES ===== */

{
id:1004,
grupo:"D",
local:"Estados Unidos",
visitante:"Paraguay",
fecha:"2026-06-12T19:00:00",
ciudad:"Los Ángeles"
},

{
id:1005,
grupo:"B",
local:"Qatar",
visitante:"Suiza",
fecha:"2026-06-13T13:00:00",
ciudad:"San Francisco"
},

{
id:1006,
grupo:"C",
local:"Brasil",
visitante:"Marruecos",
fecha:"2026-06-13T16:00:00",
ciudad:"New York"
},

{
id:1007,
grupo:"C",
local:"Haití",
visitante:"Escocia",
fecha:"2026-06-13T19:00:00",
ciudad:"Boston"
},

{
id:1008,
grupo:"D",
local:"Australia",
visitante:"Turquía",
fecha:"2026-06-13T22:00:00",
ciudad:"Vancouver"
},

{
id:1009,
grupo:"E",
local:"Alemania",
visitante:"Curazao",
fecha:"2026-06-14T11:00:00",
ciudad:"Houston"
},

{
id:1010,
grupo:"F",
local:"Holanda",
visitante:"Japón",
fecha:"2026-06-14T14:00:00",
ciudad:"Dallas"
},

{
id:1011,
grupo:"E",
local:"Costa de Marfil",
visitante:"Ecuador",
fecha:"2026-06-14T17:00:00",
ciudad:"Philadelphia"
},

{
id:1012,
grupo:"F",
local:"Suecia",
visitante:"Túnez",
fecha:"2026-06-14T20:00:00",
ciudad:"Monterrey"
},

{
id:1013,
grupo:"H",
local:"España",
visitante:"Cabo Verde",
fecha:"2026-06-15T13:00:00",
ciudad:"Atlanta"
},

{
id:1014,
grupo:"G",
local:"Bélgica",
visitante:"Egipto",
fecha:"2026-06-15T13:00:00",
ciudad:"Seattle"
},

{
id:1015,
grupo:"H",
local:"Arabia Saudita",
visitante:"Uruguay",
fecha:"2026-06-15T16:00:00",
ciudad:"Miami"
},

{
id:1016,
grupo:"G",
local:"Irán",
visitante:"Nueva Zelanda",
fecha:"2026-06-15T19:00:00",
ciudad:"Los Ángeles"
},

{
id:1017,
grupo:"I",
local:"Francia",
visitante:"Senegal",
fecha:"2026-06-16T12:00:00",
ciudad:"New York"
},

{
id:1018,
grupo:"I",
local:"Irak",
visitante:"Noruega",
fecha:"2026-06-16T16:00:00",
ciudad:"Boston"
},

{
id:1019,
grupo:"J",
local:"Argentina",
visitante:"Argelia",
fecha:"2026-06-16T19:00:00",
ciudad:"Kansas City"
},

{
id:1020,
grupo:"J",
local:"Austria",
visitante:"Jordania",
fecha:"2026-06-16T22:00:00",
ciudad:"San Francisco"
},

{
id:1021,
grupo:"L",
local:"Ghana",
visitante:"Panamá",
fecha:"2026-06-17T17:00:00",
ciudad:"Toronto"
},

{
id:1022,
grupo:"L",
local:"Inglaterra",
visitante:"Croacia",
fecha:"2026-06-17T14:00:00",
ciudad:"Dallas"
},

{
id:1023,
grupo:"K",
local:"Portugal",
visitante:"Congo",
fecha:"2026-06-17T11:00:00",
ciudad:"Houston"
},

{
id:1024,
grupo:"K",
local:"Uzbekistán",
visitante:"Colombia",
fecha:"2026-06-17T20:00:00",
ciudad:"México"
},

{
id:1025,
grupo:"A",
local:"Chequia",
visitante:"Sudáfrica",
fecha:"2026-06-18T10:00:00",
ciudad:"Atlanta"
},

{
id:1026,
grupo:"B",
local:"Suiza",
visitante:"Bosnia",
fecha:"2026-06-18T13:00:00",
ciudad:"Los Ángeles"
},

{
id:1027,
grupo:"B",
local:"Canadá",
visitante:"Qatar",
fecha:"2026-06-18T16:00:00",
ciudad:"Vancouver"
},

{
id:1028,
grupo:"A",
local:"México",
visitante:"Corea del Sur",
fecha:"2026-06-18T19:00:00",
ciudad:"Guadalajara"
},

{
id:1029,
grupo:"C",
local:"Brasil",
visitante:"Haití",
fecha:"2026-06-19T18:30:00",
ciudad:"Philadelphia"
},

{
id:1030,
grupo:"C",
local:"Escocia",
visitante:"Marruecos",
fecha:"2026-06-19T16:00:00",
ciudad:"Boston"
},

{
id:1031,
grupo:"D",
local:"Turquía",
visitante:"Paraguay",
fecha:"2026-06-19T21:00:00",
ciudad:"San Francisco"
},

{
id:1032,
grupo:"D",
local:"Estados Unidos",
visitante:"Australia",
fecha:"2026-06-19T13:00:00",
ciudad:"Seattle"
},

{
id:1033,
grupo:"E",
local:"Alemania",
visitante:"Costa de Marfil",
fecha:"2026-06-20T14:00:00",
ciudad:"Toronto"
},

{
id:1034,
grupo:"E",
local:"Ecuador",
visitante:"Curazao",
fecha:"2026-06-20T18:00:00",
ciudad:"Kansas City"
},

{
id:1035,
grupo:"F",
local:"Holanda",
visitante:"Suecia",
fecha:"2026-06-20T11:00:00",
ciudad:"Houston"
},

{
id:1036,
grupo:"F",
local:"Túnez",
visitante:"Japón",
fecha:"2026-06-20T22:00:00",
ciudad:"Monterrey"
},

{
id:1037,
grupo:"H",
local:"Uruguay",
visitante:"Cabo Verde",
fecha:"2026-06-21T16:00:00",
ciudad:"Miami"
},

{
id:1038,
grupo:"H",
local:"España",
visitante:"Arabia Saudita",
fecha:"2026-06-21T10:00:00",
ciudad:"Atlanta"
},

{
id:1039,
grupo:"G",
local:"Bélgica",
visitante:"Irán",
fecha:"2026-06-21T13:00:00",
ciudad:"Los Ángeles"
},

{
id:1040,
grupo:"G",
local:"Nueva Zelanda",
visitante:"Egipto",
fecha:"2026-06-21T19:00:00",
ciudad:"Vancouver"
},

{
id:1041,
grupo:"I",
local:"Noruega",
visitante:"Senegal",
fecha:"2026-06-22T18:00:00",
ciudad:"New York"
},

{
id:1042,
grupo:"I",
local:"Francia",
visitante:"Irak",
fecha:"2026-06-22T15:00:00",
ciudad:"Philadelphia"
},

{
id:1043,
grupo:"J",
local:"Argentina",
visitante:"Austria",
fecha:"2026-06-22T11:00:00",
ciudad:"Dallas"
},

{
id:1044,
grupo:"J",
local:"Jordania",
visitante:"Argelia",
fecha:"2026-06-22T21:00:00",
ciudad:"San Francisco"
},

{
id:1045,
grupo:"K",
local:"Inglaterra",
visitante:"Ghana",
fecha:"2026-06-23T14:00:00",
ciudad:"Boston"
},

{
id:1046,
grupo:"L",
local:"Panamá",
visitante:"Croacia",
fecha:"2026-06-23T17:00:00",
ciudad:"Toronto"
},

{
id:1047,
grupo:"L",
local:"Portugal",
visitante:"Uzbekistán",
fecha:"2026-06-23T11:00:00",
ciudad:"Houston"
},

{
id:1048,
grupo:"K",
local:"Colombia",
visitante:"Congo",
fecha:"2026-06-23T20:00:00",
ciudad:"Guadalajara"
},

{
id:1049,
grupo:"C",
local:"Brasil",
visitante:"Escocia",
fecha:"2026-06-24T16:00:00",
ciudad:"Atlanta"
},

{
id:1050,
grupo:"C",
local:"Marruecos",
visitante:"Haití",
fecha:"2026-06-24T16:00:00",
ciudad:"Miami"
},

{
id:1051,
grupo:"B",
local:"Suiza",
visitante:"Canadá",
fecha:"2026-06-24T13:00:00",
ciudad:"Vancouver"
},

{
id:1052,
grupo:"B",
local:"Bosnia",
visitante:"Qatar",
fecha:"2026-06-24T13:00:00",
ciudad:"Seattle"
},

{
id:1053,
grupo:"A",
local:"Chequia",
visitante:"México",
fecha:"2026-06-24T19:00:00",
ciudad:"México"
},

{
id:1054,
grupo:"A",
local:"Sudáfrica",
visitante:"Corea del Sur",
fecha:"2026-06-24T19:00:00",
ciudad:"Monterrey"
},

{
id:1055,
grupo:"E",
local:"Curazao",
visitante:"Costa de Marfil",
fecha:"2026-06-25T14:00:00",
ciudad:"Houston"
},

{
id:1056,
grupo:"E",
local:"Ecuador",
visitante:"Alemania",
fecha:"2026-06-25T14:00:00",
ciudad:"New York"
},

{
id:1057,
grupo:"F",
local:"Japón",
visitante:"Suecia",
fecha:"2026-06-25T17:00:00",
ciudad:"Dallas"
},

{
id:1058,
grupo:"F",
local:"Túnez",
visitante:"Holanda",
fecha:"2026-06-25T17:00:00",
ciudad:"Kansas City"
},

{
id:1059,
grupo:"D",
local:"Turquía",
visitante:"Estados Unidos",
fecha:"2026-06-25T20:00:00",
ciudad:"Los Ángeles"
},

{
id:1060,
grupo:"D",
local:"Paraguay",
visitante:"Australia",
fecha:"2026-06-25T20:00:00",
ciudad:"San Francisco"
},

{
id:1061,
grupo:"I",
local:"Noruega",
visitante:"Francia",
fecha:"2026-06-26T13:00:00",
ciudad:"Boston"
},

{
id:1062,
grupo:"I",
local:"Senegal",
visitante:"Irak",
fecha:"2026-06-26T13:00:00",
ciudad:"Toronto"
},

{
id:1063,
grupo:"G",
local:"Egipto",
visitante:"Irán",
fecha:"2026-06-26T21:00:00",
ciudad:"Seattle"
},

{
id:1064,
grupo:"G",
local:"Nueva Zelanda",
visitante:"Bélgica",
fecha:"2026-06-26T21:00:00",
ciudad:"Vancouver"
},

{
id:1065,
grupo:"H",
local:"Cabo Verde",
visitante:"Arabia Saudita",
fecha:"2026-06-26T18:00:00",
ciudad:"Houston"
},

{
id:1066,
grupo:"H",
local:"Uruguay",
visitante:"España",
fecha:"2026-06-26T18:00:00",
ciudad:"Guadalajara"
},

{
id:1067,
grupo:"L",
local:"Panamá",
visitante:"Inglaterra",
fecha:"2026-06-27T15:00:00",
ciudad:"New York"
},

{
id:1068,
grupo:"L",
local:"Croacia",
visitante:"Ghana",
fecha:"2026-06-27T15:00:00",
ciudad:"Philadelphia"
},

{
id:1069,
grupo:"J",
local:"Argelia",
visitante:"Austria",
fecha:"2026-06-27T20:00:00",
ciudad:"Kansas City"
},

{
id:1070,
grupo:"J",
local:"Jordania",
visitante:"Argentina",
fecha:"2026-06-27T20:00:00",
ciudad:"Dallas"
},

{
id:1071,
grupo:"K",
local:"Colombia",
visitante:"Portugal",
fecha:"2026-06-27T17:30:00",
ciudad:"Miami"
},

{
id:1072,
grupo:"K",
local:"Congo",
visitante:"Uzbekistán",
fecha:"2026-06-27T17:30:00",
ciudad:"Atlanta"
}

];

for(const partido of partidos){

const partidoRef =
ref(db,"partidos/"+partido.id);

const snap =
await get(partidoRef);

if(snap.exists()){

console.log(
"Ya existe",
partido.id
);

continue;

}

await set(partidoRef,{

fixtureId: partido.id,

grupo: partido.grupo,

local: partido.local,
visitante: partido.visitante,

logoLocal:
obtenerEscudo(partido.local),

logoVisitante:
obtenerEscudo(partido.visitante),

fecha: partido.fecha,

estadio: partido.ciudad,

ciudad: partido.ciudad,

estado:"Programado",

golesLocal:0,
golesVisitante:0,

usuariosParticipando:0,

bolsaTotal:0,

cierreApuestas:
new Date(partido.fecha).getTime()
-
3600000,

actualizado:Date.now()

});

console.log(
"Partido creado",
partido.id
);

}

}

function cargarCalendario() {

  const lista =
    document.getElementById(
      "listaCalendario"
    );

  if (!lista) {

    console.error(
      "No existe #listaCalendario en el HTML"
    );

    return;
  }

  onValue(
    ref(db, "partidos"),
    (snapshot) => {

      const datos = snapshot.val();

      if (!datos) {

        lista.innerHTML = `
          <div style="padding:20px">
            No hay partidos.
          </div>
        `;

        return;
      }

      let partidos =
        Object.values(datos);

      partidos.sort(
        (a, b) =>
          new Date(a.fecha) -
          new Date(b.fecha)
      );

      lista.innerHTML = "";

      partidos.forEach((p) => {

        lista.innerHTML += `

        <div class="match-row">

          <div style="
            display:flex;
            align-items:center;
            gap:10px;
          ">

            <img
              src="${p.logoLocal}"
              width="35">

            <strong>
              ${p.local}
            </strong>

            <span>VS</span>

            <strong>
              ${p.visitante}
            </strong>

            <img
              src="${p.logoVisitante}"
              width="35">

          </div>

          <div>
            🏆 Grupo ${p.grupo}
          </div>

          <div>
            📅 ${new Date(
              p.fecha
            ).toLocaleString("es-MX")}
          </div>

          <div>
            👥 ${p.usuariosParticipando}
          </div>

          <div>
            💰 ${p.bolsaTotal}
          </div>

          <button
class="odds-btn"
onclick="location.href='apuestas.html?id=${p.fixtureId}'">

APOSTAR

</button>

        </div>

        `;

      });

    }
  );

}


await crearPartidosFaltantes();

await repararEscudosFirebase();

cargarCalendario();

