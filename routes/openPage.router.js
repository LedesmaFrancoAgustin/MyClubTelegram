import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";


const router = express.Router();

router.get('/open-socio', async (req, res) => {
  try {
      const browser = await puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
      });

      const page = await browser.newPage();
      await page.goto('https://soysocio.bocajuniors.com.ar/login');

      await page.type('#email', 'usuario@example.com');
      await page.type('#password', '1234');
      await page.click('button[type="submit"]');

      await page.waitForNavigation();
      await page.goto('https://soysocio.bocajuniors.com.ar/');

      res.send('Sesión iniciada en SoySocio');
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).send('Error al abrir la página');
  }
});

export default router;
