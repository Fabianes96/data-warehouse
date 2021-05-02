import * as global from "./global.js";
import * as regiones from './regiones.js'
async function loadCompaniaToModal(arrayCompanias) {
  try {
    let res = await fetch("http://localhost:3000/companias", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    global.clearOptions(global.selectCompanias);
    arrayCompanias = await res.json();
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("selected", "");
    global.selectCompanias.appendChild(emptyOption);
    for (let i = 0; i < arrayCompanias.length; i++) {
      let option = document.createElement("option");
      option.textContent = arrayCompanias[i].compania;
      option.setAttribute("value", arrayCompanias[i].id_compania);
      global.selectCompanias.appendChild(option);
    }
  } catch (error) {
    console.log(error);
  }
}
function clearModalCompania() {
  global.inputModalCompaniaNombre.value = "";
  global.inputModalCompaniaDireccion.value = "";
  global.inputModalCompaniaEmail.value = "";
  global.inputModalCompaniaTelefono.value = "";
  global.modalCompania.removeAttribute("compania");
  global.formCompania.classList.remove("was-validated");
  global.clearOptions(global.optionsPais);
  global.clearOptions(global.optionsCiudad);
}
async function getCompanias() {
  let res = await fetch("http://localhost:3000/companias", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  let resAsJSON = await res.json();
  return resAsJSON;
}
function addCompaniesToTable(arrayCompanias) {
  for (let i = 0; i < arrayCompanias.length; i++) {
    let tr = document.createElement("tr");
    let tdNombre = document.createElement("td");
    tdNombre.textContent = arrayCompanias[i].compania;
    let tdEmail = document.createElement("td");
    tdEmail.textContent = arrayCompanias[i].email;
    let tdUbicacion = document.createElement("td");
    tdUbicacion.textContent =
      arrayCompanias[i].ciudad + " - " + arrayCompanias[i].pais;
    let tdTelefono = document.createElement("td");
    tdTelefono.textContent = arrayCompanias[i].telefono;
    let tdDireccion = document.createElement("td");
    tdDireccion.textContent = arrayCompanias[i].direccion;
    let tdOpciones = document.createElement("td");
    let divOpciones = document.createElement("div");
    divOpciones.setAttribute("class", "div-opciones-companias");
    let spanPrimary = document.createElement("span");
    spanPrimary.setAttribute("class", "link-primary");
    let iEdit = document.createElement("i");
    iEdit.setAttribute("class", "far fa-edit");
    iEdit.setAttribute("data-bs-toggle", "modal");
    iEdit.setAttribute("data-bs-target", "#modalCompania");
    iEdit.addEventListener("click", async () => {
      global.inputModalCompaniaNombre.value = arrayCompanias[i].compania;
      global.inputModalCompaniaEmail.value = arrayCompanias[i].email;
      global.inputModalCompaniaDireccion.value = arrayCompanias[i].direccion;
      global.inputModalCompaniaTelefono.value = arrayCompanias[i].telefono;
      global.modalCompania.setAttribute(
        "compania",
        arrayCompanias[i].id_compania
      );
      await regiones.loadOptions(global.optionsGroup);
      global.optionsGroup.value = arrayCompanias[i].id_region;
      await regiones.loadPaises(global.optionsPais, global.optionsGroup);
      global.optionsPais.value = arrayCompanias[i].id_pais;
      await regiones.loadCiudades(global.optionsCiudad, global.optionsPais);
      global.optionsCiudad.value = arrayCompanias[i].id_ciudad;
    });
    spanPrimary.appendChild(iEdit);
    let spanDelete = document.createElement("span");
    spanDelete.setAttribute("class", "link-danger");
    let iDelete = document.createElement("i");
    iDelete.setAttribute("class", "fas fa-times-circle");
    iDelete.setAttribute("data-bs-target", "#warningModal");
    iDelete.setAttribute("data-bs-toggle", "modal");
    iDelete.addEventListener("click", () => {
      global.labelWarning.textContent = `Está seguro que desea eliminar '${arrayCompanias[i].compania}'?`;
      global.labelWarning.setAttribute(
        "compania",
        arrayCompanias[i].id_compania
      );
    });
    spanDelete.appendChild(iDelete);
    divOpciones.appendChild(spanPrimary);
    divOpciones.appendChild(spanDelete);
    tdOpciones.appendChild(divOpciones);

    tr.appendChild(tdNombre);
    tr.appendChild(tdEmail);
    tr.appendChild(tdUbicacion);
    tr.appendChild(tdTelefono);
    tr.appendChild(tdDireccion);
    tr.appendChild(tdOpciones);
    global.bodyTabla.appendChild(tr);
  }
}

async function companiaActionsInModal() {
  try {
    let comp = global.modalCompania.getAttribute("compania");
    if (!comp) {
      let res = await fetch("http://localhost:3000/companias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          nombre: global.inputModalCompaniaNombre.value,
          email: global.inputModalCompaniaEmail.value,
          direccion: global.inputModalCompaniaDireccion.value,
          telefono: global.inputModalCompaniaTelefono.value,
          ciudad: global.optionsCiudad.value,
        }),
      });
      clearModalCompania();
      let mensaje = await res.json();
      if (!res.ok) {
        throw mensaje;
      }
      console.log("Compañia agregada con exito");
      window.location.reload();
    } else {
      let res = await fetch(
        `http://localhost:3000/companias/${global.modalCompania.getAttribute(
          "compania"
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({
            nombre: global.inputModalCompaniaNombre.value,
            email: global.inputModalCompaniaEmail.value,
            direccion: global.inputModalCompaniaDireccion.value,
            telefono: global.inputModalCompaniaTelefono.value,
            ciudad: global.optionsCiudad.value,
          }),
        }
      );
      clearModalCompania();
      let mensaje = await res.json();
      if (!res.ok) {
        throw mensaje;
      }
      console.log("Compañia actualizada");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}
export {
  loadCompaniaToModal,
  clearModalCompania,
  getCompanias,
  addCompaniesToTable,
  companiaActionsInModal
};
