
import { handleUserInput } from '../handlers/authHandlers.js';
export const handleQuiensoy = (ctx) => {
    ctx.reply('Soy un bot de ejemplo');  // Enviar el mensaje al chat
  };
  
  export const handleInformacion = (ctx) => {
    ctx.reply('Aquí tienes la información...');
  };
  
  export const handleIniciarSecion = (ctx) => {
    // Solicitar el correo electrónico
    ctx.reply('Por favor, ingresa tu correo electrónico para iniciar sesión.');
    ctx.session.awaitingEmail = true; // Marcamos que estamos esperando el correo
  };
  
  
  export const handleRegistrar = (ctx) => {
    ctx.reply('Por favor, ingresa tus datos para registrarte');
  };
  
  export const handlePass = (ctx) => {
    ctx.reply('Aquí puedes configurar tu contraseña');
  };
  
  export const handleDetener = (ctx) => {
    ctx.reply('Deteniendo el bot...');
  };
  