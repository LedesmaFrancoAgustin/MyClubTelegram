import { Scenes, Markup } from "telegraf";
import accountsModel from "../models/accounts.model.js";

export const registerScene = new Scenes.WizardScene(
  "registerScene",
  async (ctx) => {
    try {
      await ctx.reply(
        "Por favor, ingresa tu correo electrónico para registrarte:",
      );
      return ctx.wizard.next();
    } catch (error) {
      console.error("Error en la primera etapa del registro:", error);
      await ctx.reply("Ocurrió un error. Inténtalo de nuevo.");
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const email = ctx.message.text;
      const existingUser = await accountsModel.findOne({ email });

      if (existingUser) {
        await ctx.reply("Este correo ya está registrado. Usa otro correo.");
        return ctx.scene.leave();
      }

      ctx.wizard.state.email = email;
      await ctx.reply("Por favor, ingresa una contraseña:");
      return ctx.wizard.next();
    } catch (error) {
      console.error("Error en la verificación del correo:", error);
      await ctx.reply("Ocurrió un error. Inténtalo de nuevo.");
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const password = ctx.message.text;
      const newUser = new accountsModel({
        email: ctx.wizard.state.email.toLowerCase(), // Convertir a minúsculas
        password: password, // Considera encriptar la contraseña
        chatId: ctx.chat.id,
      });

      await newUser.save();
      await ctx.reply("¡Registro exitoso! Ya puedes iniciar sesión.");
      return ctx.scene.leave();
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      await ctx.reply(
        "Ocurrió un error al registrar el usuario. Inténtalo de nuevo más tarde.",
      );
      return ctx.scene.leave();
    }
  },
);

export const loginScene = new Scenes.WizardScene(
  "loginScene",
  async (ctx) => {
    try {
      await ctx.reply("Por favor, ingresa tu correo electrónico:");
      return ctx.wizard.next();
    } catch (error) {
      console.error("Error en la solicitud de correo electrónico:", error);
      await ctx.reply("Ocurrió un error. Inténtalo de nuevo más tarde.");
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      ctx.wizard.state.email = ctx.message.text;
      await ctx.reply("Por favor, ingresa tu contraseña:");
      return ctx.wizard.next();
    } catch (error) {
      console.error("Error en la solicitud de contraseña:", error);
      await ctx.reply("Ocurrió un error. Inténtalo de nuevo más tarde.");
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const email = ctx.wizard.state.email.toLowerCase(); // Convertir a minúsculas
      const password = ctx.message.text;
      const user = await accountsModel.findOne({ email, password });

      if (user) {
        ctx.session.isLoggedIn = true;
        ctx.session.userId = user._id;
        ctx.session.chatId = user.chatId;
        ctx.session.email = email;
        ctx.session.lastActive = Date.now();
        await ctx.reply("¡Inicio de sesión exitoso!", getButtonPass());
      } else {
        await ctx.reply("Correo o contraseña incorrectos. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error en el proceso de inicio de sesión:", error);
      await ctx.reply("Ocurrió un error. Inténtalo de nuevo más tarde.");
    }
    return ctx.scene.leave();
  },
);

// Función para verificar si la sesión está activa y expira en 1 minuto
export const isSessionValid = (ctx) => {
  try {
    if (ctx.session && ctx.session.isLoggedIn) {
      const now = Date.now();
      const sessionExpiration = 1 * 60 * 1000; // 1 minuto en milisegundos
      if (now - ctx.session.lastActive > sessionExpiration) {
        delete ctx.session.isLoggedIn;
        delete ctx.session.userId;
        delete ctx.session.chatId;
        delete ctx.session.lastActive;
        return false; // Retorna false porque la sesión ha expirado
      }
      ctx.session.lastActive = now; // Actualiza la última actividad
      return true; // Retorna true porque la sesión sigue activa
    }
    return false; // Retorna false porque no hay sesión activa
  } catch (error) {
    console.error("Error al verificar la sesión:", error);
    return false; // En caso de error, se considera que la sesión no es válida
  }
};

export const logout = async (ctx) => {
  try {
    if (ctx.session && ctx.session.isLoggedIn) {
      delete ctx.session.isLoggedIn;
      delete ctx.session.userId;
      delete ctx.session.chatId;
      delete ctx.session.email;
      delete ctx.session.lastActive;

      await ctx.reply("Has cerrado sesión exitosamente.");
    } else {
      await ctx.reply("No tienes ninguna sesión activa.");
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    await ctx.reply("Ocurrió un error al cerrar sesión. Inténtalo de nuevo.");
  }
};


const getButtonPass = () => {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: "Pass", callback_data: "Pass" }]],
    },
  };
};
