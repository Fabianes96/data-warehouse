import * as global from './global.js';
import * as compania from './compania.js'
import * as regiones from './regiones.js'


async function loadContactos(){
    try {
      let res = await fetch("http://localhost:3000/contactos",{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },      
      });
      let arrayContactos = await res.json()    
      return arrayContactos
    } catch (error) {
      console.log(error);
    }  
}
function addContactos(arrayContactos, arrayCompanias,contadorSeleccionadas){    
    for (let i = 0; i < arrayContactos.length; i++) {    
      let tr = document.createElement("tr");
      tr.setAttribute("cid",arrayContactos[i].id)
      let th = document.createElement("th");
      th.setAttribute("scope","row");
      let divCheck = document.createElement("div")
      divCheck.setAttribute("class","form-check");
      let inputDiv = document.createElement("input");
      inputDiv.setAttribute("class","form-check-input")
      inputDiv.setAttribute("type","checkbox");
      tr.setAttribute("class","to-be-checked");
      inputDiv.addEventListener("change",(e)=>{
        let sp = global.nroSeleccion.firstElementChild;
        if(e.currentTarget.checked){
          tr.classList.add("tr-hover")
          contadorSeleccionadas++;
          sp.textContent = contadorSeleccionadas + " seleccionadas";
          global.opCabecera.classList.remove("none");
          global.opCabecera.classList.add("opciones-cabecera");
        }else{
          tr.classList.remove("tr-hover")
          contadorSeleccionadas = contadorSeleccionadas -1;         
          sp.textContent = contadorSeleccionadas + " selecciondas";
          if(contadorSeleccionadas==0){
            global.opCabecera.classList.remove("opciones-cabecera");
            global.opCabecera.classList.add("none");            
            global.flexCheck.checked = false;            
          }
        }        
      })
      let label = document.createElement("label");
      label.setAttribute("class", "form-check-label");
      divCheck.appendChild(inputDiv);
      divCheck.appendChild(label)
      th.appendChild(divCheck);
      tr.appendChild(th);
  
      let td = document.createElement("td");
      let divInfoContact = document.createElement("div");
      divInfoContact.setAttribute("class","info-contact");
      let spanContacto = document.createElement("span");
      spanContacto.textContent = arrayContactos[i].nombre;
      let spanContactoEmail = document.createElement("span");
      spanContactoEmail.textContent = arrayContactos[i].email;
      divInfoContact.appendChild(spanContacto);
      divInfoContact.appendChild(spanContactoEmail);
      td.appendChild(divInfoContact);
      tr.appendChild(td)
  
      let tdPais = document.createElement("td");
      let divPais = document.createElement("div");
      divPais.setAttribute("class","info-contact");
      let spanPais = document.createElement("span");
      spanPais.textContent = arrayContactos[i].pais;
      let spanRegion = document.createElement("span");
      spanRegion.textContent = arrayContactos[i].region;
      divPais.appendChild(spanPais);
      divPais.appendChild(spanRegion);
      tdPais.appendChild(divPais);
      tr.appendChild(tdPais);
  
      let tdCompania = document.createElement("td");
      tdCompania.textContent = arrayContactos[i].compania
      tr.appendChild(tdCompania);
  
      let tdCargo = document.createElement("td");
      tdCargo.textContent = arrayContactos[i].cargo;
      tr.appendChild(tdCargo);
  
      let tdInteres =document.createElement("td");
      tdInteres.setAttribute("colspan", "4");
      let divProgresoGroup = document.createElement("div");
      divProgresoGroup.setAttribute("class","progress-group");    
      let spanProgreso = document.createElement("span");    
      let divProgress = document.createElement("div");
      divProgress.setAttribute("class","progress");
      let divBar = document.createElement("div");
      divBar.setAttribute("class","progress-bar");    
      divBar.setAttribute("role", "progressbar");   
      let porcentaje = arrayContactos[i].porcentaje;
      spanProgreso.textContent = porcentaje + "%";
      switch (porcentaje) {
        case 100:
          divBar.classList.add("bg-danger");
          divBar.setAttribute("style","width: 100%");
          break;
        case 75:
          divBar.classList.add("bg-orange");
          divBar.setAttribute("style","width: 75%");
          break;
        case 50:
          divBar.classList.add("bg-warning");
          divBar.setAttribute("style","width: 50%");
          break;
        case 25:
          divBar.classList.add("bg-info");
          divBar.setAttribute("style","width: 25%");
          break;
        default:        
          break;  
      }
      divProgress.appendChild(divBar);
      divProgresoGroup.appendChild(spanProgreso);
      divProgresoGroup.appendChild(divProgress);  
      tdInteres.appendChild(divProgresoGroup);
      tr.appendChild(tdInteres);
  
      let tdAcciones = document.createElement("td");
      let divOpciones = document.createElement("div");
      divOpciones.setAttribute("class", "div-opciones");
      let spanLinkPrimary = document.createElement("span");
      spanLinkPrimary.setAttribute("class","link-primary")
      let iconEdit = document.createElement("i");
      iconEdit.setAttribute("class","far");
      iconEdit.classList.add("fa-edit");
      iconEdit.setAttribute("data-bs-toggle","modal")
      iconEdit.setAttribute("data-bs-target","#modalAddContactos")
      iconEdit.addEventListener("click",async()=>{
        global.btnCancelModalAddContacto.classList.add("none");
        global.btnAddNuevoContacto.classList.add("none");
        global.btnEditarNuevoContacto.classList.remove("none");
        global.btnEliminarModalAddContacto.classList.remove("none");
        global.modalAddContactos.setAttribute("id_c", arrayContactos[i].id);
        global.inputModalContactoNombre.value = arrayContactos[i].nombre
        global.inputModalContactoApellido.value = arrayContactos[i].apellido
        global.inputModalContactoCargo.value = arrayContactos[i].cargo
        global.inputModalContactEmail.value = arrayContactos[i].email
        global.inputModalContactoDireccion.value = arrayContactos[i].direccion
        global.inputModalContactoDireccion.disabled = false;
        await compania.loadCompaniaToModal(arrayCompanias)
        global.selectCompanias.value = arrayContactos[i].id_compania;
        await regiones.loadOptions(global.optionsGroupContactos);
        global.optionsGroupContactos.value = arrayContactos[i].id_region      
        await regiones.loadPaises(global.selectPaisContactos,global.optionsGroupContactos);
        global.selectPaisContactos.value = arrayContactos[i].id_pais
        await regiones.loadCiudades(global.selectCiudadContactos,global.selectPaisContactos);
        global.selectCiudadContactos.value = arrayContactos[i].id_ciudad;
        await loadCanales(global.selectCanal);  
        switch (porcentaje) {
          case 100:
            global.selectInteres.value = 5
            break;
          case 75:
            global.selectInteres.value = 4
            break;
          case 50:
            global.selectInteres.value = 3
            break;
          case 25:
            global.selectInteres.value = 2
            break;
          default:
            global.selectInteres.value = 1                  
            break;  
        }
        let res = await fetch(`http://localhost:3000/canalesporcontactos?contacto=${arrayContactos[i].id}`,{
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        if(!res.ok){
          throw 'Error al consultar los registros de la base de datos';
        }
        let cuentas = await res.json();      
        global.modalAddContactos.setAttribute("cuentas", cuentas.length);      
        for (let i = 0; i < cuentas.length; i++) {
          await addCanalToModal(cuentas[i].canal,cuentas[i].cuenta,cuentas[i].preferencia,true,cuentas[i].id_canal,cuentas[i].id_preferencia, cuentas[i].id);              
        }      
      })    
      spanLinkPrimary.appendChild(iconEdit);
      
      let spanLinkDanger = document.createElement("span");
      spanLinkDanger.setAttribute("class","link-danger");
      let iconDelete = document.createElement("i");
      iconDelete.setAttribute("class","far")
      iconDelete.classList.add("fa-times-circle");    
      iconDelete.setAttribute("data-bs-target","#warningModal");
      iconDelete.setAttribute("data-bs-toggle","modal")
      iconDelete.addEventListener("click",()=>{
        global.labelWarning.textContent = `Está seguro que desea eliminar este contacto?`
        global.labelWarning.setAttribute("contacto",arrayContactos[i].id);  
      })
      spanLinkDanger.appendChild(iconDelete);
      divOpciones.appendChild(spanLinkPrimary);
      divOpciones.appendChild(spanLinkDanger);
      tdAcciones.appendChild(divOpciones);
      tr.appendChild(tdAcciones);
  
      global.bodyTablaContactos.appendChild(tr);    
    }    
}
async function deleteContacto(id){
    try {
      let res = await fetch(`http://localhost:3000/contactos/${id}`,{
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },      
      });
      if(!res.ok){
        throw 'Error al eliminar los datos';
      }    
    } catch (error) {
      console.log(error);
    }
}
async function loadCanales(select){
    try {
      let res = await fetch("http://localhost:3000/canales",{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
      });    
      let canales = await res.json();    
      global.clearOptions(select);        
      let emptyOption = document.createElement("option");
      emptyOption.setAttribute("selected","");
      select.appendChild(emptyOption);
      for (let i = 0; i < canales.length; i++) {      
        let option = document.createElement("option");            
        option.textContent = canales[i].nombre        
        option.setAttribute("value",canales[i].id);
        select.appendChild(option);      
      }    
    } catch (error) {
      console.log(error);
    }
}
async function loadPreferencias(selectP){
    try {
      let res = await fetch("http://localhost:3000/preferencias",{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
      });
      if(selectP=== global.selectPreferencia){
        global.selectPreferencia.disabled = false;
        global.inputCuentaContacto.disabled = false
      }
      let preferencias = await res.json()
      global.clearOptions(selectP);        
      let emptyOption = document.createElement("option");
      emptyOption.setAttribute("selected","");
      selectP.appendChild(emptyOption);
      for (let i = 0; i < preferencias.length; i++) {      
        let option = document.createElement("option");            
        option.textContent = preferencias[i].nombre        
        option.setAttribute("value",preferencias[i].id);
        selectP.appendChild(option);      
      }
    } catch (error) {
      console.log(error);
    }
}
async function addCanalToModal(selectCanalValue,inputCuentaContactoValue, selectPreferenciaValue, edicion, pos1=0,pos2=0, id_reg=0){  

    let selectC = document.createElement("select");      
    selectC.setAttribute("class","form-select");
    selectC.setAttribute("required","")
    selectC.setAttribute("disabled","");

    await loadCanales(selectC);
    selectC.removeChild(selectC.firstElementChild);
    if(pos1!=0){
      selectC.value = pos1
    }else{
      selectC.value = selectCanalValue    
    }
    
    let inputCC = document.createElement("input");
    inputCC.setAttribute("type","text");
    inputCC.setAttribute("class","form-control");
    inputCC.setAttribute("required","");
    inputCC.setAttribute("disabled","");
    inputCC.value = inputCuentaContactoValue
  
    let select = document.createElement("select");      
    select.setAttribute("class","form-select");
    select.setAttribute("required","")
    select.setAttribute("disabled","");
    
    await loadPreferencias(select);
    select.removeChild(select.firstElementChild);
    if(pos2!=0){
      select.value = pos2;
    }else{
      select.value = selectPreferenciaValue;
    }        
    let spanPrimary = document.createElement("span");
    let iconEdit = document.createElement("i");
    let spanEditar = document.createElement("span");
    spanEditar.textContent = "Editar canal"
    iconEdit.setAttribute("class","fas");
    iconEdit.classList.add("fa-pen")
    spanPrimary.setAttribute("class","btn");
    spanPrimary.classList.add("btn-outline-primary");
    spanPrimary.appendChild(iconEdit);
    spanPrimary.appendChild(spanEditar);
    if(id_reg!=0){
     spanPrimary.setAttribute("id_reg",id_reg); 
    }    
    spanPrimary.addEventListener("click",()=>{
      selectC.disabled = false;
      inputCC.disabled = false;
      select.disabled = false;
    })

    let spanDelete = document.createElement("span");
    let iconDelete = document.createElement("i");
    let spanEliminar = document.createElement("span");
    spanEliminar.textContent = "Eliminar canal";
    iconDelete.setAttribute("class","fas");
    iconDelete.classList.add("fa-trash-alt");
    spanDelete.setAttribute("class","btn");
    spanDelete.classList.add("btn-outline-secondary");
    spanDelete.appendChild(iconDelete);
    spanDelete.appendChild(spanEliminar);        

    spanDelete.addEventListener("click",async()=>{
      global.masCanales.removeChild(selectC)
      global.masCanales.removeChild(inputCC)
      global.masCanales.removeChild(select)
      global.masCanales.removeChild(spanPrimary)
      global.masCanales.removeChild(spanDelete)
      if(edicion){
        let res = await fetch(`http://localhost:3000/canalesporcontactos/${id_reg}`,{
          method: 'DELETE',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
        })
        if(!res.ok){
          throw 'Error al eliminar el registro';
        }
      }
    })    
    global.masCanales.appendChild(selectC);
    global.masCanales.appendChild(inputCC);
    global.masCanales.appendChild(select);
    global.masCanales.appendChild(spanPrimary);    
    global.masCanales.appendChild(spanDelete);  
}
async function addCanales(contacto,i=0){
  let iCanal ="";
  let iCuenta="";
  let iPreferencia ="";
  for (i; i < global.masCanales.childElementCount; i++) {
    let children = global.masCanales.children[i]
    if(!children.classList.contains("btn")){            
      if(i%5 == 0){
        iCanal = children.value
      }else if(i%5==1){
        iCuenta = children.value
      }else if(i%5==2){
        iPreferencia = children.value
      }
    }else{
      if(i%5 ==3){         
        let res = await fetch("http://localhost:3000/canalesporcontactos",{
          method: "POST",
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
          body: JSON.stringify({
              contacto: contacto,
              canal: iCanal,
              preferencia: iPreferencia,
              cuenta: iCuenta
          })
        });
        let mensaje = await res.json()
        if(!res.ok){
          throw mensaje;
        }
      }
    }
  }
}
async function editCanales(contacto,cont){
  let iCanal ="";
  let iCuenta="";
  let iPreferencia ="";
  let i = 0;
  let count = global.masCanales.childElementCount
  for (i; i < count; i++) {
    let children = global.masCanales.children[i]
    if(!children.classList.contains("btn")){            
      if(i%5 == 0){
        iCanal = children.value
      }else if(i%5==1){
        iCuenta = children.value
      }else if(i%5==2){
        iPreferencia = children.value
      }
    }else{
      if(i%5 ==3 && cont!=0){         
        let res = await fetch(`http://localhost:3000/canalesporcontactos/${children.getAttribute("id_reg")}`,{
          method: "PATCH",
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
          body: JSON.stringify({              
              canal: iCanal,
              preferencia: iPreferencia,
              cuenta: iCuenta
          })
        });
        let mensaje = await res.json()
        if(!res.ok){
          throw mensaje;
        }
        cont--
      }      
      if(cont==0){
        break;
      }
    }
  }  
  if(i+1!=count-1){
    await addCanales(contacto,i)
  }
}

function clearModalContactos(){
    global.inputModalContactoNombre.value = "";
    global.inputModalContactoApellido.value = "";
    global.inputModalContactoCargo.value = "";
    global.inputModalContactEmail.value = "";
    global.clearOptions(global.selectPaisContactos);
    global.selectPaisContactos.setAttribute("disabled","");
    global.clearOptions(global.selectCiudadContactos);
    global.selectCiudadContactos.setAttribute("disabled","");
    global.inputModalContactoDireccion.value = "";
    global.inputModalContactoDireccion.setAttribute("disabled","");  
    global.inputCuentaContacto.value = ""
    global.inputCuentaContacto.setAttribute("disabled","");
    global.selectPreferencia.setAttribute("disabled","");
    global.selectInteres.value = 1    
    global.formContactos.classList.remove("was-validated");
    global.clearOptions(global.masCanales)  
}
async function addContactoForm(){
    try {    
        if(global.inputModalContactoNombre.value != "" && global.inputModalContactoApellido.value != "" && global.inputModalContactoCargo.value != "" && global.inputModalContactEmail.value != "" && global.selectCompanias.value != "" && global.selectCiudadContactos.value != "" && global.selectInteres.value != "" && global.inputModalContactoDireccion.value != ""){
          if(global.selectCanal.value != "" && (global.inputCuentaContacto.value == "" || global.selectPreferencia.value == "")){
            console.log("Faltan parámetros");
            return;
          }
          let res = await fetch("http://localhost:3000/contactos",{
            method: "POST",
            headers:{
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                nombre: global.inputModalContactoNombre.value,
                apellido: global.inputModalContactoApellido.value, 
                cargo: global.inputModalContactoCargo.value,         
                email: global.inputModalContactEmail.value,
                compania: global.selectCompanias.value,
                ciudad: global.selectCiudadContactos.value,
                interes: global.selectInteres.value,
                direccion: global.inputModalContactoDireccion.value          
            })
          });
          let resAsJSON = await res.json()      
          if(res.ok){
            if(global.masCanales.childElementCount != 0){
              await addCanales(resAsJSON[0]);
            }
            clearModalContactos();      
            window.location.reload()
          }else{
            throw resAsJSON;
          }
        }
    } catch (error) {
        console.log(error);
    }
}
async function editContactoForm(){
    try {
        if(global.inputModalContactoNombre.value != "" && global.inputModalContactoApellido.value != "" && global.inputModalContactoCargo.value != "" && global.inputModalContactEmail.value != "" && global.selectCompanias.value != "" && global.selectCiudadContactos.value != "" && global.selectInteres.value != "" && global.inputModalContactoDireccion.value != ""){
          let idContacto = global.modalAddContactos.getAttribute("id_c")
          let res = await fetch(`http://localhost:3000/contactos/${idContacto}`,{
            method: "PATCH",
            headers:{
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                nombre: global.inputModalContactoNombre.value,
                apellido: global.inputModalContactoApellido.value, 
                cargo: global.inputModalContactoCargo.value,         
                email: global.inputModalContactEmail.value,
                compania: global.selectCompanias.value,
                ciudad: global.selectCiudadContactos.value,
                interes: global.selectInteres.value,
                direccion: global.inputModalContactoDireccion.value          
            })
          });          
          let contador = global.modalAddContactos.getAttribute("cuentas");    
          let children = global.masCanales.childElementCount;
          if(children != 0 && contador == 0){      
            await addCanales(idContacto);
          }else{
            await editCanales(idContacto,contador);
          }
          if(!res.ok){
            throw 'Error al actualizar datos';
          }      
          window.location.reload()  
        }        
    } catch (error) {
        console.log(error);
    }  
}
function toCheck(e,contadorSeleccionadas){
  let checklist = document.getElementsByClassName("to-be-checked");
  if(e.currentTarget.checked){    
    for (let i = 0; i < checklist.length; i++) {            
      checklist[i].classList.add("tr-hover")
      let th = checklist[i].firstElementChild;
      let div = th.firstElementChild
      let check = div.firstElementChild
      check.checked = true      
    }
    contadorSeleccionadas = checklist.length;
    global.nroSeleccion.firstElementChild.textContent = contadorSeleccionadas + " selecciondas";    
  }
  else{
    for (let i = 0; i < checklist.length; i++) {      
      checklist[i].classList.remove("tr-hover");
      let th = checklist[i].firstElementChild;
      let div = th.firstElementChild
      let check = div.firstElementChild
      check.checked = false
    }    
    contadorSeleccionadas = 0;  
  }
  if(!(e.currentTarget.checked && global.opCabecera.classList.contains("opciones-cabecera"))){
    global.opCabecera.classList.toggle("none");
    global.opCabecera.classList.toggle("opciones-cabecera");
  }
}
  
export {loadContactos, addContactos, deleteContacto, loadCanales, addCanalToModal,editCanales,addCanales,clearModalContactos, addContactoForm, editContactoForm, loadPreferencias, toCheck}