import bcrypt from 'bcrypt';
import accountsModel from '../models/accounts.model.js';

export const handleUserInput = async (ctx) => {
    if (ctx.session.awaitingEmail) {
      const email = ctx.message.text;
      await verifyEmail(ctx, email);
      ctx.session.awaitingEmail = false; // Dejamos de esperar el correo
    } else if (ctx.session.awaitingPassword) {
      const password = ctx.message.text;
      await verifyPassword(ctx, password);
      ctx.session.awaitingPassword = false; // Dejamos de esperar la contraseña
    }
  };
  
  // Función para verificar el correo en la base de datos
  const verifyEmail = async (ctx, email) => {
    try {
      const user = await accountsModel.findOne({ email });
      if (user) {
        ctx.reply('Correo verificado. Ahora, por favor ingresa tu contraseña.');
        ctx.session.awaitingPassword = true; // Activamos la espera de la contraseña
      } else {
        ctx.reply('Correo no registrado. Por favor, regístrate primero.');
      }
    } catch (error) {
      console.error(error);
      ctx.reply('Hubo un error al verificar tu correo. Intenta nuevamente.');
    }
  };
  
  // Función para verificar la contraseña
  const verifyPassword = async (ctx, password) => {
    try {
      const user = await accountsModel.findOne({ email: ctx.session.email });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          ctx.reply(`¡Bienvenido, ${user.email}! Has iniciado sesión correctamente.`);
        } else {
          ctx.reply('Contraseña incorrecta. Intenta nuevamente.');
        }
      } else {
        ctx.reply('Correo no registrado. Intenta de nuevo.');
      }
    } catch (error) {
      console.error(error);
      ctx.reply('Hubo un error al verificar tu contraseña. Intenta nuevamente.');
    }
  };
  