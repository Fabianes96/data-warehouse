import * as global from './global.js';

function addContentToTree(obj) {  
  for (let region in obj) {
    let divCardRegion = document.createElement("div");
    divCardRegion.setAttribute("class", "card region");
    let divCardBody = document.createElement("div");
    divCardBody.setAttribute("class", "card-body");

    let divRegionBody = document.createElement("div");
    divRegionBody.setAttribute("class", "region-body");
    let h5 = document.createElement("h5");
    h5.setAttribute("class", "card-title");
    h5.textContent = region;

    let button = document.createElement("i");
    button.setAttribute("class", "fas fa-plus-circle fa-lg");
    let buttonEdit = document.createElement("i");
    buttonEdit.setAttribute("class", "fas fa-edit fa-lg");
    let buttonDelete = document.createElement("i");
    buttonDelete.setAttribute("class", "fas fa-minus-circle fa-lg");

    button.setAttribute("data-bs-target", "#exampleModal");
    button.setAttribute("data-bs-toggle", "modal");
    button.addEventListener("click", () => {
      global.modalLabel.textContent = "Añadir pais";
      global.labelAddInModal.setAttribute("region", obj[region].id);
      global.labelAddInModal.textContent =
        "Escriba el nombre del pais a agregar";
    });

    buttonEdit.setAttribute("data-bs-target", "#exampleModal");
    buttonEdit.setAttribute("data-bs-toggle", "modal");
    buttonEdit.addEventListener("click", () => {
      global.modalLabel.textContent = "Editar región";
      global.labelAddInModal.setAttribute("eregion", obj[region].id);
      global.inputModal.value = region;
    });

    buttonDelete.setAttribute("data-bs-target", "#warningModal");
    buttonDelete.setAttribute("data-bs-toggle", "modal");
    buttonDelete.addEventListener("click", () => {
      global.labelWarning.textContent = `Está seguro que desea eliminar '${region}'?`;
      global.labelWarning.setAttribute("region", obj[region].id);
    });

    let spanBtn = document.createElement("span");
    spanBtn.setAttribute("class", "link-success");
    spanBtn.appendChild(button);

    let spanEdit = document.createElement("span");
    spanEdit.setAttribute("class", "link-primary");
    spanEdit.appendChild(buttonEdit);

    let spanDelete = document.createElement("span");
    spanDelete.setAttribute("class", "link-danger");
    spanDelete.appendChild(buttonDelete);

    let divOpciones = document.createElement("div");
    divOpciones.setAttribute("class", "div-opciones-flex");
    divOpciones.appendChild(spanBtn);
    divOpciones.appendChild(spanEdit);
    divOpciones.appendChild(spanDelete);

    divRegionBody.appendChild(h5);
    divRegionBody.appendChild(divOpciones);

    divCardBody.appendChild(divRegionBody);
    let divTreeList = document.createElement("div");
    divTreeList.setAttribute("class", "list-tree");

    let ul = document.createElement("ul");
    for (let pais in obj[region]) {
      if (pais != "null" && pais != "id") {
        let li = document.createElement("li");
        let spanCaret = document.createElement("span");
        spanCaret.setAttribute("class", "caret");
        spanCaret.textContent = pais;
        let spanOpciones = document.createElement("span");
        spanOpciones.setAttribute("class", "opciones");
        spanOpciones.setAttribute("pais", pais);
        spanOpciones.setAttribute("id_pais", obj[region][pais].id);

        let spanSuccess = document.createElement("span");
        spanSuccess.setAttribute("class", "link-success");
        let iconPlus = document.createElement("i");
        iconPlus.setAttribute("class", "fas fa-plus-circle");
        spanSuccess.setAttribute("data-bs-target", "#exampleModal");
        spanSuccess.setAttribute("data-bs-toggle", "modal");
        spanSuccess.addEventListener("click", () => {
          global.modalLabel.textContent = "Añadir ciudad";
          global.labelAddInModal.textContent = `Escriba el nombre de la ciudad a agregar en ${spanOpciones.getAttribute(
            "pais"
          )}.`;
          global.labelAddInModal.setAttribute(
            "pais",
            spanOpciones.getAttribute("id_pais")
          );
        });
        spanSuccess.appendChild(iconPlus);

        let spanLinkPrimary = document.createElement("span");
        spanLinkPrimary.setAttribute("class", "link-primary");
        spanLinkPrimary.setAttribute("data-bs-target", "#exampleModal");
        spanLinkPrimary.setAttribute("data-bs-toggle", "modal");
        spanLinkPrimary.addEventListener("click", () => {
          global.modalLabel.textContent = "Editar pais";
          global.labelAddInModal.textContent = "";
          global.inputModal.value = spanOpciones.getAttribute("pais");
          global.labelAddInModal.setAttribute(
            "epais",
            spanOpciones.getAttribute("id_pais")
          );
        });
        let iconEdit = document.createElement("i");
        iconEdit.setAttribute("class", "far fa-edit");

        spanLinkPrimary.appendChild(iconEdit);

        let spanLinkDanger = document.createElement("span");
        spanLinkDanger.setAttribute("class", "link-danger");
        let iconDelete = document.createElement("i");
        iconDelete.setAttribute("class", "far fa-trash-alt");
        spanLinkDanger.appendChild(iconDelete);
        spanLinkDanger.setAttribute("data-bs-target", "#warningModal");
        spanLinkDanger.setAttribute("data-bs-toggle", "modal");
        spanLinkDanger.addEventListener("click", () => {
          global.labelWarning.textContent = `Está seguro que desea eliminar '${spanOpciones.getAttribute(
            "pais"
          )}'?`;
          global.labelWarning.setAttribute(
            "pais",
            spanOpciones.getAttribute("id_pais")
          );
        });

        spanOpciones.appendChild(spanSuccess);
        spanOpciones.appendChild(spanLinkPrimary);
        spanOpciones.appendChild(spanLinkDanger);

        let ulNested = document.createElement("ul");
        ulNested.setAttribute("class", "nested");
        let arrayActual = obj[region][pais].ciudades;
        for (let i = 0; i < arrayActual.length; i++) {
          if (arrayActual[i].ciudad != null) {
            let liCiudades = document.createElement("li");
            liCiudades.setAttribute("class", "li-ciudades");
            let spanNombre = document.createElement("span");
            spanNombre.textContent = arrayActual[i].ciudad;
            let spanOpciones = document.createElement("span");
            spanOpciones.setAttribute("class", "opciones");
            spanOpciones.setAttribute("ciudad", arrayActual[i].ciudad);
            spanOpciones.setAttribute("id_ciudad", arrayActual[i].id);

            let spanLinkPrimary = document.createElement("span");
            spanLinkPrimary.setAttribute("class", "link-primary");
            spanLinkPrimary.setAttribute("data-bs-target", "#exampleModal");
            spanLinkPrimary.setAttribute("data-bs-toggle", "modal");
            spanLinkPrimary.addEventListener("click", () => {
              global.modalLabel.textContent = "Editar ciudad";
              global.labelAddInModal.textContent = "";
              global.inputModal.value = spanOpciones.getAttribute("ciudad");
              global.labelAddInModal.setAttribute(
                "eciudad",
                spanOpciones.getAttribute("id_ciudad")
              );
            });

            let iconEdit = document.createElement("i");
            iconEdit.setAttribute("class", "far fa-edit");
            spanLinkPrimary.appendChild(iconEdit);

            let spanLinkDanger = document.createElement("span");
            spanLinkDanger.setAttribute("class", "link-danger");
            spanLinkDanger.setAttribute("data-bs-target", "#warningModal");
            spanLinkDanger.setAttribute("data-bs-toggle", "modal");
            spanLinkDanger.addEventListener("click", () => {
              global.labelWarning.textContent = `Está seguro que desea eliminar '${spanOpciones.getAttribute(
                "ciudad"
              )}'?`;
              global.labelWarning.setAttribute(
                "ciudad",
                spanOpciones.getAttribute("id_ciudad")
              );
            });
            let iconDelete = document.createElement("i");
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

        ul.appendChild(li);
      }
    }
    divTreeList.appendChild(ul);
    divCardBody.appendChild(divTreeList);

    divCardRegion.appendChild(divCardBody);
    global.regionCiudad.appendChild(divCardRegion);
  }
}
async function loadOptions(options) {
  try {
    let res = await fetch("http://localhost:3000/regiones", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    let regiones = await res.json();
    global.clearOptions(options);
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected", "");
    options.appendChild(emptyOption);
    for (let i = 0; i < regiones.length; i++) {
      let option = document.createElement("option");
      option.textContent = regiones[i].nombre;
      option.setAttribute("value", regiones[i].id);
      options.appendChild(option);
    }
  } catch (error) {
    console.log(error);
  }
}

async function queryToJSON(objeto) {
  try {
    let consulta = await fetch("http://localhost:3000/infociudades");
    let consultaAsJson = await consulta.json();    
    consultaAsJson.forEach((obj) => {
      let prop = obj.region;
      let ciudades = [];
      if (prop in objeto.region) {
        if (prop != "id") {
          let pais = obj.pais;
          if (pais in objeto.region[prop]) {
            objeto.region[prop][pais].ciudades.push({
              id: obj.id_ciudad,
              ciudad: obj.ciudad,
            });
          } else {
            ciudades = [];
            objeto.region[prop][pais] = {
              id: obj.id_pais,
              ciudades: ciudades,
            };
            objeto.region[prop][pais].ciudades.push({
              id: obj.id_ciudad,
              ciudad: obj.ciudad,
            });
          }
        }
      } else {
        let pais = obj.pais;
        let id_region = "id";
        objeto.region[prop] = {};
        objeto.region[prop][id_region] = obj.id_region;
        objeto.region[prop][pais] = {
          id: obj.id_pais,
          ciudades: ciudades,
        };
        objeto.region[prop][pais].ciudades.push({
          id: obj.id_ciudad,
          ciudad: obj.ciudad,
        });
      }
    });    
    addContentToTree(objeto.region);
  } catch (error) {
    console.log(error);
  }
}
async function loadPaises(options, previewsOptions){  
  try {
    let res = await fetch("http://localhost:3000/paises");
    let arrayPaises = await res.json();      
    global.clearOptions(options);
    if(global.optionsCiudad.length > 1){    
      global.clearOptions(global.optionsCiudad);
    }
    if(global.selectCiudadContactos.length>1){
      global.clearOptions(global.selectCiudadContactos);
    }
    if(global.selectPaisContactos === options){      
      global.selectPaisContactos.disabled = false;
    }
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected","");
    options.appendChild(emptyOption);
    for (let i = 0; i < arrayPaises.length; i++) {      
      let option = document.createElement("option");         
      if(arrayPaises[i].region == previewsOptions.value){
        option.textContent = arrayPaises[i].nombre  
        option.setAttribute("value",arrayPaises[i].id);      
        options.appendChild(option);    
      }
    }     
  } catch (error) {
    console.log(error);
  }
}
async function loadCiudades(options,previewsOptions){  
  try {
    let res = await fetch("http://localhost:3000/ciudades");
    let arrayCiudades = await res.json();  
    global.clearOptions(options);
    if(global.selectCiudadContactos === options){      
      global.selectCiudadContactos.disabled = false;
    }
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected","");
    options.appendChild(emptyOption);
    for (let i = 0; i < arrayCiudades.length; i++) {      
      let option = document.createElement("option");         
      if(arrayCiudades[i].pais == previewsOptions.value){
        option.textContent = arrayCiudades[i].nombre        
        option.setAttribute("value",arrayCiudades[i].id)
        options.appendChild(option);    
      }
    }      
  } catch (error) {
    console.log(error);
  }
}
export { addContentToTree, loadOptions, queryToJSON, loadPaises, loadCiudades };
