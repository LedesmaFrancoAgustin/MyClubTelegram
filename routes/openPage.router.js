import express from "express";

const router = express.Router();

router.get('/open-socio', async (req, res) => {
  try {
    res.send(`
      <html>
        <head>
          <title>SoySocio</title>
        </head>
        <body>
          <iframe src="https://bocasocios.bocajuniors.com.ar/auth/login" width="100%" height="800px" style="border:none;"></iframe>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error al cargar la página:', error);
    res.status(500).send('Error al abrir la página');
  }
});

export default router;
