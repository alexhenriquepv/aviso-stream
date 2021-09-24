import { initializeApp } from "firebase/app"
import { getDatabase, ref } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyDjhs93LWblwqZV7dtvJ1njIl8vg0wNs80",
  authDomain: "nibcount.firebaseapp.com",
  databaseURL: "https://nibcount.firebaseio.com",
  projectId: "nibcount",
  storageBucket: "nibcount.appspot.com",
  messagingSenderId: "506213256598",
  appId: "1:506213256598:web:a6a3f7ac896237b78361b7"
}

initializeApp(firebaseConfig)

const db = getDatabase()
const transmissaoRef = ref(db, '/transmissao')

export {
    db, transmissaoRef
}