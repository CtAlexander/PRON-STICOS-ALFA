import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
ref,
set
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";


// ======================================
// REGISTRO
// ======================================

window.registrarUsuario = async function(){

const nombre =
document.getElementById("nombre").value.trim();

const correo =
document.getElementById("correo").value.trim();

const telefono =
document.getElementById("telefono").value.trim();

const password =
document.getElementById("password").value;

const confirmPassword =
document.getElementById("confirmPassword").value;

if(
!nombre ||
!correo ||
!telefono ||
!password ||
!confirmPassword
){
alert("Completa todos los campos");
return;
}

if(password !== confirmPassword){

alert("Las contraseñas no coinciden");
return;

}

try{

const credencial =
await createUserWithEmailAndPassword(
auth,
correo,
password
);

await set(
ref(db,"usuarios/" + credencial.user.uid),
{
uid: credencial.user.uid,
nombre: nombre,
correo: correo,
telefono: telefono,

creditosAlfa:0,
alfaCoins:0,

apostadas:0,
ganadas:0,
perdidas:0,

nivel:1,
xp:0,

fechaRegistro:new Date().toISOString()
}
);

alert("Cuenta creada correctamente");

window.location.href =
"login.html";

}
catch(error){

console.error(error);

alert(error.message);

}

};


// ======================================
// LOGIN
// ======================================

window.login = async function(){

const correo =
document.getElementById("loginCorreo").value.trim();

const password =
document.getElementById("loginPassword").value;

const mensaje =
document.getElementById("mensaje");

try{

await signInWithEmailAndPassword(
auth,
correo,
password
);

mensaje.innerHTML =
"✅ Acceso correcto";

setTimeout(()=>{

window.location.href =
"dashboard.html";

},1000);

}
catch(error){

console.error(error);

mensaje.innerHTML =
"❌ " + error.code;

}

}


// ======================================
// CERRAR SESIÓN
// ======================================

window.cerrarSesion = async function(){

try{

await signOut(auth);

window.location.href =
"login.html";

}
catch(error){

console.error(error);

}

};