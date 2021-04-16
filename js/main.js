let linkUsuarios = document.getElementsByClassName("links")[2];
let opcionesContactos = document.getElementById("opciones-contactos");
let contactos = document.getElementById("contactos");
let usuarios = document.getElementById("usuarios");
let btnCrearUsuario = document.getElementById("btn-crear-usuario");
let inputNombre = document.getElementById("inputNombre");
let inputApellido = document.getElementById("inputApellido");
let inputEmailUsuario = document.getElementById("inputEmailUsuario");
let perfil = document.getElementById("perfil");
let inputPasswordUsuario = document.getElementById("inputPasswordUsuario");
let regionCiudad = document.getElementById("region-ciudad");

function activeLink(){
    let menu = document.getElementById("menu");
    let a = menu.getElementsByClassName("links");      
    for (let i = 0; i < a.length; i++) {
      a[i].addEventListener("click",()=>{
        let current = document.getElementsByClassName("active");      
        if(current.length > 0){
          current[0].classList.add("no-selected");
          current[0].classList.remove("active");    
        }      
        a[i].classList.remove("no-selected")
        a[i].classList.add("active")
        if(i!=2){
            noLinkUsuarios()
        }
      })
    }
}
function noLinkUsuarios(){
    opcionesContactos.classList.remove("none");
    contactos.classList.remove("none");
    usuarios.classList.add("none");
}
linkUsuarios.addEventListener("click",()=>{
    opcionesContactos.classList.add("none");
    contactos.classList.add("none");
    usuarios.classList.remove("none");
});
btnCrearUsuario.addEventListener("click",async()=>{
  let admin = "0";
  if(perfil.value =="Admin"){
    admin = "1"
  }
  try {
    const res = await fetch("http://localhost:3000/usuarios",{
      method: "POST",
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
          nombre: inputNombre.value,
          apellido: inputApellido.value,          
          email: inputEmailUsuario.value,
          perfil: admin,
          password: inputPasswordUsuario.value
      })
    })
    inputNombre.value = "";
    inputApellido.value ="";
    inputEmailUsuario.value = "";
    admin = "";
    inputPasswordUsuario.value = "";

    if(!res.ok){
      throw "Error al registrar usuario";
    }      
    console.log("Usuario registrado con exito");    
  } catch (error) {    
    console.log("Algo salió mal: ", error);
  }
})
function formB () { 
  
  var forms = document.querySelectorAll('.needs-validation')  
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
}

let prueba = document.getElementById("card-region");
let tree = document.getElementById("list-tree")
let region = document.querySelector(".region")
prueba.addEventListener("click", ()=>{
  prueba.classList.toggle("abrir-card")
  setTimeout(()=>{
    tree.classList.toggle("none"); 
  },100)
  
})
let vector = []
let objeto = {
  "region": {      
  }
}
async function pruebaxd(){
  try {
    let consulta = await fetch("http://localhost:3000/regiones");
    let consultaAsJson = await consulta.json()
    vector = consultaAsJson;
    console.log(vector);
    vector.forEach((obj)=>{
      let prop = obj.region      
      if(prop in objeto.region){
        let pais = obj.pais;
        if(pais in objeto.region[prop]){          
          objeto.region[prop][pais].push(obj.ciudad)          
        }else{
          objeto.region[prop][pais] = []          
          objeto.region[prop][pais].push(obj.ciudad)          
        }
      }else{        
        let pais = obj.pais;
        objeto.region[prop] = {}
        objeto.region[prop][pais] = []     
        objeto.region[prop][pais].push(obj.ciudad)
      }
    })    
  } catch (error) {
    console.log(error);
  }
}


activeLink()
formB()
pruebaxd()
