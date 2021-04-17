let linkUsuarios = document.getElementsByClassName("links")[2];
let linkRegiones = document.getElementsByClassName("links")[3];
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
let vector = []
let objeto = {
  "region": {      
  }
}
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
        if(i==0){
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
    regionCiudad.classList.add("none")
    regionCiudad.classList.remove("flex")
    usuarios.classList.remove("none");
});
linkRegiones.addEventListener("click",async()=>{  
  opcionesContactos.classList.add("none");
  contactos.classList.add("none");
  usuarios.classList.add("none");
  regionCiudad.classList.remove("none");
  regionCiudad.classList.add("flex")
  while(regionCiudad.firstElementChild){
    regionCiudad.removeChild(regionCiudad.firstElementChild);
    objeto = {
      "region": {      
      }
    }
  }
  await queryToJSON()
})
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

async function queryToJSON(){
  try {
    let consulta = await fetch("http://localhost:3000/regiones");
    let consultaAsJson = await consulta.json()
    vector = consultaAsJson;    
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
    addContentToTree(objeto.region)
  } catch (error) {
    console.log(error);
  }
}

function addContentToTree(obj){
  let id = 0;
  for (let region in obj) {    
    
    let divCardRegion = document.createElement("div");
    divCardRegion.setAttribute("class", "card region");
    let divCardBody = document.createElement("div");
    divCardBody.setAttribute("class", "card-body");
    
    let divRegionBody = document.createElement("div");
    divRegionBody.setAttribute("class", "region-body");
    let h5 = document.createElement("h5");
    h5.setAttribute("class","card-title")
    h5.textContent = region
    let button = document.createElement("button")
    button.setAttribute("class","btn btn-outline-success btn-add")    
    let spanBtn = document.createElement("span");
    spanBtn.textContent = "+";
    button.appendChild(spanBtn);
    divRegionBody.appendChild(h5)
    divRegionBody.appendChild(button);
    
    divCardBody.appendChild(divRegionBody);    
    let divTreeList = document.createElement("div");
    divTreeList.setAttribute("class","list-tree");
    divTreeList.setAttribute("id", id)    
    
    let ul = document.createElement("ul");        
    for(pais in obj[region]){      
      if(pais != "null"){
        let li = document.createElement("li");
        let spanCaret = document.createElement("span");
        spanCaret.setAttribute("class","caret")
        spanCaret.textContent = pais;
        let spanOpciones =document.createElement("span");
        spanOpciones.setAttribute("class","opciones");

        let spanSuccess = document.createElement("span");
        spanSuccess.setAttribute("class", "link-success");
        let iconPlus = document.createElement("i");
        iconPlus.setAttribute("class","fas fa-plus-circle");
        spanSuccess.appendChild(iconPlus);

        let spanLinkPrimary = document.createElement("span");
        spanLinkPrimary.setAttribute("class", "link-primary")        
        let iconEdit = document.createElement("i")
        iconEdit.setAttribute("class", "far fa-edit")
        spanLinkPrimary.appendChild(iconEdit);

        let spanLinkDanger = document.createElement("span");
        spanLinkDanger.setAttribute("class", "link-danger")
        let iconDelete = document.createElement("i")        
        iconDelete.setAttribute("class", "far fa-trash-alt");
        spanLinkDanger.appendChild(iconDelete);
        
        spanOpciones.appendChild(spanSuccess);
        spanOpciones.appendChild(spanLinkPrimary);
        spanOpciones.appendChild(spanLinkDanger);
  
        let ulNested = document.createElement("ul");
        ulNested.setAttribute("class","nested");      
        let arrayActual = obj[region][pais]
        for (let i = 0; i < arrayActual.length; i++) {            
          if(arrayActual[i]!=null){
            let liCiudades = document.createElement("li");
            liCiudades.setAttribute("class", "li-ciudades");
            let spanNombre = document.createElement("span");
            spanNombre.textContent = arrayActual[i]
            let spanOpciones =document.createElement("span");
            spanOpciones.setAttribute("class","opciones");
            let spanLinkPrimary = document.createElement("span");
            spanLinkPrimary.setAttribute("class", "link-primary")        
            let iconEdit = document.createElement("i")
            iconEdit.setAttribute("class", "far fa-edit")
            spanLinkPrimary.appendChild(iconEdit);

            let spanLinkDanger = document.createElement("span");
            spanLinkDanger.setAttribute("class", "link-danger")
            let iconDelete = document.createElement("i")        
            iconDelete.setAttribute("class", "far fa-trash-alt");
            spanLinkDanger.appendChild(iconDelete);
    
            spanOpciones.appendChild(spanLinkPrimary);
            spanOpciones.appendChild(spanLinkDanger);
    
            liCiudades.appendChild(spanNombre);
            liCiudades.appendChild(spanOpciones);
            ulNested.appendChild(liCiudades);        
          }
        }      
  
        li.appendChild(spanCaret);
        li.appendChild(spanOpciones);
        li.appendChild(ulNested);
        
        ul.appendChild(li)
      }
    }
    divTreeList.appendChild(ul)
    divCardBody.appendChild(divTreeList)
    

    divCardRegion.appendChild(divCardBody);
    regionCiudad.appendChild(divCardRegion);
    let tree = document.getElementById(id);    
    // divCardRegion.addEventListener("click",()=>{
    //   divCardRegion.classList.toggle("abrir-card");
    //   setTimeout(()=>{
    //     tree.classList.toggle("none"); 
    //   },100)
    // })
    id++;    
  }
}

activeLink()
formB()

