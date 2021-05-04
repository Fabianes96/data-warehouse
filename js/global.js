let linkContactos = document.getElementsByClassName("links")[0];
let linkCompanias = document.getElementsByClassName("links")[1];
let linkUsuarios = document.getElementsByClassName("links")[2];
let linkRegiones = document.getElementsByClassName("links")[3];
let cerrarSesion = document.getElementsByClassName("links")[4];
let opcionesContactos = document.getElementById("opciones-contactos");
let companias = document.getElementById("companias");
let contactos = document.getElementById("contactos");
let usuarios = document.getElementById("usuarios");
let btnCrearUsuario = document.getElementById("btn-crear-usuario");
let inputNombre = document.getElementById("inputNombre");
let inputApellido = document.getElementById("inputApellido");
let inputEmailUsuario = document.getElementById("inputEmailUsuario");
let perfil = document.getElementById("perfil");
let inputPasswordUsuario = document.getElementById("inputPasswordUsuario");
let regionCiudad = document.getElementById("region-ciudad");
let regiones = document.getElementById("regiones")
let modalLabel = document.getElementById("addModalLabel");
let btnAceptarModal = document.getElementById("btnAceptarModal");
let btnEliminar = document.getElementById("btnAceptarWarningModal");
let labelAddInModal = document.getElementById("labelInfoAdd");
let labelWarning = document.getElementById("labelWarning");
let inputModal = document.getElementById("inputModal");
let btnAgregarRegion = document.getElementById("btnAgregarRegion");
let btnClose = document.getElementById("close");
let xClose =document.getElementById("xclose");
let modal = document.getElementById("exampleModal");
let modalCompania = document.getElementById("modalCompania")
let xCloseCompania = document.getElementById("xcloseCompania");
let btnCloseCompania = document.getElementById("btnCloseModalCompania")
let bodyTabla = document.getElementById("tbody");
let bodyTablaContactos = document.getElementById("tbodyContactos");
let btnAddCompanias = document.getElementById("addCompanias");
let inputModalCompaniaNombre = document.getElementById("inputModalCompaniaNombre")
let inputModalCompaniaDireccion = document.getElementById("inputModalCompaniaDireccion")
let inputModalCompaniaEmail = document.getElementById("inputModalCompaniaEmail")
let inputModalCompaniaTelefono = document.getElementById("inputModalCompaniaTelefono")
let optionsGroup = document.getElementById("optionsGroup");    
let optionsGroupContactos =document.getElementById("selectRegionContactos");
let optionsCiudad = document.getElementById("optionsCiudad");  
let optionsPais = document.getElementById("optionsPais");  
let flexCheck = document.getElementById("flexCheck");
let divSearch = document.getElementById("div-icon-search");
let inputSearch = document.getElementById("inputSearch");
let btnAceptarModalCompania = document.getElementById("btnAceptarModalCompania");
let nroSeleccion = document.getElementById("nro-seleccion");
let opCabecera = contactos.firstElementChild
let linkEliminar = document.getElementById("eliminar-contacto")
let btnAddContactos = document.getElementById("btnAddContactos");
let selectCiudadContactos = document.getElementById("selectCiudadContactos");
let selectPaisContactos = document.getElementById("selectPaisContactos");
let inputModalContactoDireccion = document.getElementById("inputModalContactoDireccion");
let selectCanal = document.getElementById("selectCanal");
let selectPreferencia = document.getElementById("selectPreferencia");
let inputCuentaContacto = document.getElementById("inputCuentaContacto")
let agregarCanal = document.getElementById("agregarCanal");
let masCanales = document.getElementById("masCanales");
let selectCompanias = document.getElementById("selectContactoCompania");
let btnAddContactoForm = document.getElementById("btnSubmitContacto");
let btnAddNuevoContacto = document.getElementById("btnAddNuevoContacto");
let inputModalContactoNombre = document.getElementById("inputModalContactoNombre");
let inputModalContactoApellido = document.getElementById("inputModalContactoApellido");
let inputModalContactoCargo = document.getElementById("inputModalContactoCargo");
let inputModalContactEmail = document.getElementById("inputModalContactoEmail");
let selectInteres = document.getElementById("selectInteres");
let selectRegionContactos = document.getElementById("selectRegionContactos");
let modalAddContactos = document.getElementById("modalAddContactos");
let btnCancelModalAddContacto = document.getElementById("btnCancelModalAddContacto");
let btnCloseModalAddContactos = document.getElementById("btnCloseModalAddContactos");
let btnEliminarModalAddContacto = document.getElementById("btnEliminarModalAddContacto");
let btnEditarNuevoContacto = document.getElementById("btnEditarNuevoContacto");
let formContactos = document.getElementById("formContactos")
let formCompania = document.getElementById("formCompania")
let bodyTablaUsuarios = document.getElementById("tbodyUsuarios");
let modalUsuarios = document.getElementById("modalUsuarios");
let xcloseUsuario = document.getElementById("xcloseUsuario");
let formUsuario = document.getElementById("formUsuario");
let inputModalUsuarioNombre = document.getElementById("inputModalUsuarioNombre");
let inputModalUsuarioApellido = document.getElementById("inputModalUsuarioApellido");
let inputModalUsuarioEmail = document.getElementById("inputModalUsuarioEmail")
let usuarioPerfil = document.getElementById("usuarioPerfil");
let btnCloseModalUsuario = document.getElementById("btnCloseModalUsuario");
let btnAceptarModalUsuario =document.getElementById("btnAceptarModalUsuario");
let nroSeleccionUser = document.getElementById("nro-seleccion-user");
let opCabeceraUser = document.getElementById("opCabeceraUser");
let flexCheckUsuarios = document.getElementById("flexCheckUsuarios");
let toAddUserForm = document.getElementById("toAddUserForm");
let userHeader = document.getElementById("userHeader");
let addUsersForm = document.getElementById("addUsersForm");
let divUsersTable = document.getElementById("div-users-table");
let spanListaUsuarios = document.getElementById("spanListaUsuarios");
let eliminarUsuarios = document.getElementById("eliminar-usuario");
let inputEditPasswordUsuario = document.getElementById("inputEditPasswordUsuario");
let newPasswordUsuario = document.getElementById("newPasswordUsuario");
let changePassword = document.getElementById("changePassword");
let divPassword = document.getElementById("divPassword");
let invalidNewPass = document.getElementById("invalidNewPass");
let invalidPass = document.getElementById("invalidPass");
let repeatPasswordUsuario = document.getElementById("repeatPasswordUsuario");
let cancelWarningModal =document.getElementById("cancelWarningModal");
let invalidPassLenght = document.getElementById("invalidPassLenght");
let tituloModalContacto = document.getElementById("tituloModalContacto");
let closeTag = document.getElementById("closeTag");
let coincidencias = document.getElementById("coincidencias");
function clearOptions(options){
    while(options.firstElementChild){
      options.removeChild(options.firstElementChild);
    }
}
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

export {linkContactos, linkCompanias, linkUsuarios, linkRegiones,cerrarSesion, opcionesContactos, companias, usuarios, btnCrearUsuario,inputNombre,inputApellido,inputEmailUsuario, perfil,inputPasswordUsuario,regionCiudad,regiones,modalLabel, btnAceptarModal,btnEliminar,labelAddInModal,labelWarning, inputModal,btnAgregarRegion,btnClose,xClose, modal,modalCompania,xCloseCompania, btnCloseCompania, bodyTabla, bodyTablaContactos,btnAddCompanias,inputModalCompaniaNombre,inputModalCompaniaTelefono,inputModalCompaniaEmail, inputModalCompaniaDireccion, optionsGroup,optionsGroupContactos,optionsCiudad, optionsPais,flexCheck, divSearch, inputSearch,btnAceptarModalCompania,nroSeleccion,opCabecera,linkEliminar,btnAddContactos,selectCiudadContactos,selectPaisContactos, inputModalContactoDireccion,selectCanal,selectPreferencia,inputCuentaContacto,agregarCanal,masCanales,selectCompanias,btnAddContactoForm,btnAddNuevoContacto,inputModalContactoNombre,inputModalContactoApellido,inputModalContactoCargo,inputModalContactEmail,selectInteres,selectRegionContactos,modalAddContactos,btnCancelModalAddContacto,btnEliminarModalAddContacto,btnCloseModalAddContactos,btnEditarNuevoContacto,contactos, clearOptions, formB,formContactos, formCompania, bodyTablaUsuarios,modalUsuarios,xcloseUsuario,formUsuario, inputModalUsuarioNombre, inputModalUsuarioApellido,inputModalUsuarioEmail,usuarioPerfil,btnCloseModalUsuario,btnAceptarModalUsuario,nroSeleccionUser,opCabeceraUser, flexCheckUsuarios,toAddUserForm,userHeader, addUsersForm, divUsersTable, spanListaUsuarios,eliminarUsuarios, inputEditPasswordUsuario,changePassword,divPassword, newPasswordUsuario,invalidNewPass, repeatPasswordUsuario, invalidPass, cancelWarningModal, invalidPassLenght,tituloModalContacto, closeTag,coincidencias}