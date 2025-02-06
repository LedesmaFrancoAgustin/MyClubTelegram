import mongoose from "mongoose";

export async function initMongoDB() {
  try {
    const mongoURI = process.env.MONGO_URI;  // Usar la variable de entorno
    await mongoose.connect(mongoURI, { dbName: 'PassSoySocio' });
    console.log("✅ Conectado a BackendDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
  }
}

export default initMongoDB;