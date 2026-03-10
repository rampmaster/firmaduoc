<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Generador de Firmas Duoc UC

Aplicación web para generar firmas de correo estandarizadas para Duoc UC.

## Desarrollo local

**Prerequisitos:** Node.js 20+ y npm.

1. Instala dependencias con `npm install`.
2. Inicia el entorno local con `npm run dev`.
3. Abre la URL que indique Vite en tu navegador.

## Deploy a GitHub Pages

El repositorio ya queda preparado para desplegarse automáticamente con GitHub Pages mediante GitHub Actions.

### Cómo funciona

- El workflow está en `.github/workflows/deploy.yml`.
- Se ejecuta al hacer push a `main` o `master`.
- También puede lanzarse manualmente desde la pestaña **Actions**.
- Publica el contenido generado en `dist/`.
- La app usa `base: "./"` en `vite.config.ts`, así que funciona correctamente en GitHub Pages aunque se publique dentro de la subruta del repositorio.

### Configuración necesaria en GitHub

1. Ve a **Settings > Pages** del repositorio.
2. En **Build and deployment**, selecciona **Source: GitHub Actions**.
3. Haz push de estos cambios a `main` o `master`.
4. Espera a que termine el workflow **Deploy to GitHub Pages**.

## Validación rápida

- `npm run lint`
- `npm run build`

Si el build termina correctamente, GitHub Actions podrá publicar la app en Pages con la misma salida de producción.
