let btnIngresar = document.getElementById("btnIngresar");
let email = document.getElementById("inputEmail");
let password = document.getElementById("inputPassword")
let authFailed = document.getElementById("auth-failed");
const authInfo = localStorage.getItem("jwt");
if(authInfo){
    window.location.href = "/index.html";
}
btnIngresar.addEventListener("click",async()=>{
    try {
        const res = await fetch('http://localhost:3000/login',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        if(!res.ok){
            authFailed.classList.remove("none");
            throw 'Error de autenticación';
        }
        const resAsJSON = await res.json();
        localStorage.setItem("jwt", resAsJSON);
        authFailed.classList.add("none");
        window.location.href = "/index.html"
    } catch (error) {
        console.log("Algo salio mal: ", error);
    }
})