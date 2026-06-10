import { auth, db } from "./firebase.js";

import {

onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {

ref,
onValue

}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const numeroWhatsApp =
"525636666497";

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";

return;

}

const usuarioRef =
ref(db,"usuarios/"+user.uid);

onValue(usuarioRef,(snapshot)=>{

const usuario = snapshot.val();

document.getElementById("saldoActual").innerText =
usuario.creditosAlfa || 0;

});

});

window.depositar = ()=>{

const cantidad =
prompt("Cantidad a depositar");

if(!cantidad) return;

const mensaje =

`Hola deseo depositar ${cantidad} Créditos Alfa`;

window.open(

`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`,

"_blank"

);

};

window.retirar = ()=>{

const cantidad =
prompt("Cantidad a retirar");

if(!cantidad) return;

const mensaje =

`Hola deseo retirar ${cantidad} Créditos Alfa`;

window.open(

`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`,

"_blank"

);

};