import mongoose from "mongoose";

const sessionCookieSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Asociado a la cuenta
    localStorage: { type: Object, default: {} },
    sessionStorage: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SessionCookie", sessionCookieSchema);
