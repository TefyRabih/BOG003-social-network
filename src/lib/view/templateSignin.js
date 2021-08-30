import {
  loginGoogle,
  signUpWithEmailPassword,
  sendLink,
  setDataUser,
} from '../utils/firebaseIndex.js';

import { validDate } from '../index.js';

/** Crear el div que contiene el template de signin (Registro) */
export const signin = () => {
  const divSignin = document.createElement('div');
  divSignin.setAttribute('class', 'divSignin');
  let viewSignin = `
    <div class='headSignin'>
      <img class='logo' src='./images/protest.svg'></img>
    </div>
    <div class='section-signin'>
      <div class='input-group'>
        <input type='email' id='inputEmail' placeholder='E-mail'>
        <div id='msj-error-email' class='msj-error-date-none'>
         <img src= './images/bx-x-circle.svg'></img><p id='error-email'> </p>
        </div>
        <input type='text' id='inputName' placeholder='Nombre' required>
        <input type='text' id='inputNameUser' placeholder='Nombre de usuario' required>
        <select id='gender'>
        <option disabled> Selecciona el género </option>
        <option>Femenino</option>
        <option>Masculino</option>
        <option>GenderQueer</option>
        </select>
        <p> Fecha de nacimiento</p><input type='date' id='date'>
        <div id='msj-error-date' class='msj-error-date-none'>
          <img src= './images/bx-x-circle.svg'></img><p id='errorDate'> </p>
        </div>
        <input type='password' name='' id='inputPass' placeholder='Contraseña'>
        <div id='msj-error-password' class='msj-error-date-none'>
          <img src= './images/bx-x-circle.svg'></img><p id='errorPassword'> </p>
        </div>
        <input type='password' name='' id='inputPassConfirm' placeholder='Confirma tu contraseña'>
        <div id='msj-error-confirm' class='msj-error-date-none'>
          <img src= './images/bx-x-circle.svg'></img><p id='errorPasswordConfirm'> </p>
        </div>
          </div>
          <div id= 'msj-verified' class= 'msj-verified'>
          <img class= 'bx-mail' src= './images/bx-mail-send.png'></img><p>¡Registro exitoso! Te hemos enviado un correo de verificación para tu ingreso</p>
          </div>  
        <button class='btn-register' id='signinEmail'> Regístrate </button>
        <div id= 'msj-error-default' class= 'msj-error-date-none'>
        <img class= 'bx-errorMesage' src= './images/error_outline.png'><p id='errorMesageSignin'></p>
        </div>
        <div class='line'>
        <div class='line-one'>
        </div>
        <p>o ingresa con</p>
        <div class='line-two'>
        </div>
        </div>  
        <img src= './images/logo-google.png' id='signinGoogle'></img>
        <div class='link-account'>
         <p> ¿Ya tienes cuenta?</p><a href='#/'>Inicia sesión</a>
        </div> 
    </div>
        `;

  divSignin.innerHTML = viewSignin;

  const btnSigninGoogle = divSignin.querySelector('#signinGoogle');
  btnSigninGoogle.addEventListener('click', () => {
    loginGoogle();
  });
  /** console.log('ingresa al if blur') 
   userPassword.addEventListener('focus', (event) => {
     event.target.style.background = 'pink';
     /*if (userPassword.length < 6) {
       document.querySelector('#errorMesageSignin').innerHTML = 'La contraseña es muy débil';
     }
   } */
  /** Este evento permite al usuario el registro mediante correo y contraseña */
  let btnSigninEmail = divSignin.querySelector('#signinEmail');
  btnSigninEmail.addEventListener('click', () => {
    document.querySelector('#errorMesageSignin').innerHTML = '';
    let userPassword = document.querySelector('#inputPass').value;
    let userEmail = document.querySelector('#inputEmail').value;
    let userPasswordConfirm = document.querySelector('#inputPassConfirm').value;
    let date = document.querySelector('#date').value;
    let name = document.querySelector('#inputName').value;
    let nameUser = document.querySelector('#inputNameUser').value;
    let gender = document.querySelector('#gender').value;
    let isValidDate = false;
      
    if (date === '' || date === null || date.length < 10) {
      document.querySelector('#msj-error-date').classList.remove('msj-error-date-none');
      document.querySelector('#msj-error-date').classList.add('msj-error-date-show');
      document.querySelector('#errorDate').innerHTML =
        'No puedes ingresar un campo vacío';

    } else if (validDate(date)) {
      document.querySelector('#msj-error-date').classList.remove('msj-error-date-none');
      document.querySelector('#msj-error-date').classList.add('msj-error-date-show');
      document.querySelector('#errorDate').innerHTML =
        'Por favor ingresa una fecha válida';

    } else {
      isValidDate = true;
      document.querySelector('#msj-error-date').classList.remove('msj-error-date-show');
      document.querySelector('#msj-error-date').classList.add('msj-error-date-none');
    }
    if (gender !== '' && nameUser !== '' && name !== '' && isValidDate === true){
      if (userPassword === userPasswordConfirm) {
        /** Usamos el metodo signUpWithEmailPassword para ingresar con usuario y contraseña*/
        signUpWithEmailPassword(userEmail, userPassword)
          .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            /** Si el usuario no está verificado enviar el link de confirmación */
            if (user.emailVerified === false) {
              let inputName = document.querySelector('#inputName').value;
              sendLink(inputName);
              document.querySelector('#msj-verified').classList.remove('msj-verified');
              document.querySelector('#msj-verified').classList.add('show-msj');             
              document.querySelector('#inputEmail').value = '';
              document.querySelector('#inputPass').value = '';
              document.querySelector('#inputPassConfirm').value = '';
              document.querySelector('#gender').value = '';
              document.querySelector('#date').value = '';
              document.querySelector('#inputName').value = '';
              document.querySelector('#inputNameUser').value = ''; 
              setDataUser(
                user,
                document.querySelector('#inputName').value,
                document.querySelector('#inputNameUser').value,
                document.querySelector('#gender').value,
                document.querySelector('#date').value
              );
            }
          })
          .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            /** Objeto de errores de registro */
            const objectErrorSignin = {
              'auth/weak-password':
                'Contraseña débil, escribe al menos seis caracteres.',
              'auth/too-many-requests':
                'Has excedido el número de intentos permitidos.',
              'auth/email-already-in-use':
                'Esta cuenta ya está registrada, inicia sesión o verifica tu correo.',
              'auth/email-already-exists':
                'Esta cuenta ya está registrada, inicia sesión o verifica tu correo.',
              'auth/invalid-email': 'Por favor ingresa un correo válido.',
              'auth/internal-error':
                'Ha ocurrido un error inesperado, por favor intenta nuevamente.',
            };
            /** Si es un caso de los que se encuentra en el objeto envia el mensaje de error */
            if (Object.keys(objectErrorSignin).includes(errorCode)) {            
              if (errorCode.indexOf('email')!== -1 ) {
                document.querySelector('#msj-error-email').classList.remove('msj-error-date-none');
                document.querySelector('#msj-error-email').classList.add('msj-error-date-show');
                document.querySelector('#error-email').innerHTML = objectErrorSignin[errorCode];
              } else if ((errorCode.indexOf('password')!== -1 )){
                document.querySelector('#msj-error-password').classList.remove('msj-error-date-none');
                document.querySelector('#msj-error-password').classList.add('msj-error-date-show');
                document.querySelector('#errorPassword').innerHTML = objectErrorSignin[errorCode];
              } else {
                document.querySelector('#msj-error-email').classList.remove('msj-error-date-show');
                document.querySelector('#msj-error-email').classList.add('msj-error-date-none');
                document.querySelector('#msj-error-password').classList.remove('msj-error-date-show');
                document.querySelector('#msj-error-password').classList.add('msj-error-date-none'); 
                document.querySelector('#msj-error-default').classList.add('msj-error-date-show');
                document.querySelector('#msj-error-default').classList.remove('msj-error-date-none');
                document.querySelector('#errorMesageSignin').innerHTML = objectErrorSignin[errorCode];
              }
              
  
            } else {
              document.querySelector('#msj-error-default').classList.add('msj-error-date-show');
              document.querySelector('#msj-error-default').classList.remove('msj-error-date-none');
              /** Error por defecto en caso de que no sea ninguno de los incluidos en el objeto */
              document.querySelector('#errorMesageSignin').innerHTML =
                objectErrorSignin['auth/internal-error'] + ' ' + errorCode;
            }
            // ..
          });
                document.querySelector('#msj-error-email').classList.remove('msj-error-date-show');
                document.querySelector('#msj-error-email').classList.add('msj-error-date-none');
                document.querySelector('#msj-error-password').classList.remove('msj-error-date-show');
                document.querySelector('#msj-error-password').classList.add('msj-error-date-none');
                document.querySelector('#msj-error-default').classList.remove('msj-error-date-show');
                document.querySelector('#msj-error-default').classList.add('msj-error-date-none');
  
                  setTimeout(()=>{ 
                  document.querySelector('#msj-verified').classList.remove('show-msj');  
                  document.querySelector('#msj-verified').classList.add('msj-verified')
                }, 7000);
                document.querySelector('#msj-error-confirm').classList.remove('msj-error-date-show');
                document.querySelector('#msj-error-confirm').classList.add('msj-error-date-none');
      } else {
          document.querySelector('#msj-error-confirm').classList.remove('msj-error-date-none');
          document.querySelector('#msj-error-confirm').classList.add('msj-error-date-show');
          document.querySelector('#errorPasswordConfirm').innerHTML = 'La contraseña no coincide';
      }      
    } else {
      document.querySelector('#msj-error-default').classList.add('msj-error-date-show');
      document.querySelector('#msj-error-default').classList.remove('msj-error-date-none');
      document.querySelector('#errorMesageSignin').innerHTML = 'No puedes ingresar un campo vacío';
    }

   /** document.querySelector('#foot').classList.remove('foot');
    document.querySelector('#foot').classList.add('foot-two'); */
  });

  return divSignin;
};
