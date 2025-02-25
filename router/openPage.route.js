import express from "express";
const router = express.Router();

router.get("/open-page", (req, res) => {
  res.send("✅ La ruta /open-page está funcionando correctamente.");
});

export default router;

