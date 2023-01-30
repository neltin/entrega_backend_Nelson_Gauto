//cliente
const socket = io(); //Conectar al servidor Socket => (connection)

//Nombre de usuario
let user;
const Name = document.getElementById("name");
/**
 * Inicializacion de Sweet Alert
 * -----------------------------
 * Antes de ingresar al chat el usuario tiene que completar su nombre de usuario
 * Se guarda y se envia emit() el nombre para el resto de los usuarios.
 */

//Login
 Swal.fire({
    title: 'Ingrese su correo electronico',
    input: 'text',
    inputValidator: (value)=>{
      if(!value){
        return "Ingrese su correo electronico para loguearce al chat.";
      }
    },
    allowOutsideClick: false, //bloquea salir del modal con click
    allowEscapeKey: false, //bloquea salir del modal con enter
    padding: '16px'
   }).then((result) => {
      user = result.value;
      Name.innerHTML = user;
      //Trae el chat antes de conectarte
      socket.emit('login', user);
  });


/**
 * Chat
 * ----
 */
  const chat = document.getElementById("chat");
  const textArea = document.getElementById("textarea");
  const sent = document.getElementById("sent");

  //Template de Mensajes
  const RenderMsjUser = (user, msj)=>{
    return `<li class="other">
      <div class="avatar"><img src="https://i.imgur.com/DY6gND0.png" draggable="false"/></div>
        <div class="msg">
            <p><strong>${user}</strong></p>
            <p>${msj}</p>
        </div>
      </li>`;
  }
  
  const RenderMsj = (msj)=>{
    return `<li class="self">
      <div class="avatar"><img src="https://i.imgur.com/HYcn9xO.png" draggable="false"/></div>
        <div class="msg">
          <p><strong>yo</strong></p>
          <p>${msj}</p>
      </div>
    </li>`
  }

//Enviamos el Msj al Back-end
sent.addEventListener("click", (e)=>{
  //Si algun valor - elimina las comillas
  e.preventDefault()
  if(textArea.value.trim().length){
    socket.emit("msj", {user: user , message: textArea.value})
    textArea.value = "";
  }
})

textArea.addEventListener("keyup", (e)=>{

  //Si se presiona en el Enter
  if(e.key === "Enter"){
    //Si algun valor - elimina las comillas
    if(textArea.value.trim().length){
      socket.emit("msj", {user: user , message: textArea.value})
      textArea.value = "";
    }
  } 
})

//Datos que recibimos de Back-end
socket.on('msj-chat', (data) => {
  const html = data.map(item => {
    if (item.user === user) {
      return RenderMsj(item.message);
    } else {
      return RenderMsjUser(item.user, item.message);
    }
  }).join("\n");

  chat.innerHTML = html;
})

/**
 * Funciones de TOAST
 * ------------------
 * Sirve para mensajes temporales
*/
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})




//Usuario Nuevo conectado
socket.on('new-user', (user) => {
  Toast.fire({
    icon: 'info',
    title: `${user} esta en linea`
  })
});

//Bienvenido Usuario conectado
socket.on('welcome', (user) => {
  Toast.fire({
    icon: 'success',
    title: `Bienvenido ${user}!`
  })
});