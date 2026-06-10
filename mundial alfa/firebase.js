import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { getDatabase }
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {

apiKey: "AIzaSyD323PEVx7xnnBWpMr2usOEEFQQ20YUcD8",

authDomain: "plataforma-39bde.firebaseapp.com",

databaseURL:
"https://plataforma-39bde-default-rtdb.firebaseio.com",

projectId: "plataforma-39bde",

storageBucket: "plataforma-39bde.appspot.com",

messagingSenderId: "313253115880",

appId:
"1:313253115880:web:fcaf513b16c4f892ae965d",

measurementId:
"G-D959K30F9R"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);