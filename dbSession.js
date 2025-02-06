// dbSeccion.js
import session from 'express-session';
import MongoStore from 'connect-mongo';

export const sessionConfig = (app) => {
  // URL de conexión a MongoDB (puedes poner tu propia URL aquí)
  const mongoURI = process.env.MONGO_URI; // o tu URL de MongoDB Atlas

  app.use(session({
    secret: 'mi-secreto', // Cambiar por un valor seguro
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoURI, // Utilizamos la URL de la base de datos aquí
      ttl: 14 * 24 * 60 * 60, // Tiempo de vida de la sesión en segundos (14 días)
    }),
  }));
};
