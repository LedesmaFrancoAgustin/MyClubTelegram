import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config(); // Cargar las variables de entorno

export const sessionConfig = (app) => {
  const mongoUrl = process.env.MONGO_URI; // Cambiar mongoURI a mongoUrl
  const keySession = process.env.KEY_SESSION;

  if (!mongoUrl) {
    throw new Error(
      "❌ Error: La variable de entorno MONGO_URI no está definida.",
    );
  }

  if (!keySession) {
    throw new Error(
      "❌ Error: La variable de entorno KEY_SESSION no está definida.",
    );
  }

  app.use(
    session({
      secret: keySession, // Cambiar por un valor seguro
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl, // Ahora está correctamente escrito
        ttl: 14 * 24 * 60 * 60, // 14 días en segundos
      }),
    }),
  );

  console.log("✅ Sesión configurada correctamente.");
};
