# Optimizador de Corte de Vidrio

Una aplicación web para optimizar el corte de láminas de vidrio, minimizando el desperdicio de material.

## Características

- **Optimización automática**: Algoritmo de bin-packing que distribuye las piezas de forma eficiente
- **Soporte para fracciones**: Ingresa medidas como `12 1/2` o `3/4`
- **Kerf configurable**: Considera el grosor del corte en los cálculos
- **Múltiples láminas**: Genera automáticamente las láminas necesarias
- **Exportar a PDF**: Descarga el diseño completo con todas las láminas
- **Imprimir**: Imprime todas las láminas con salto de página automático
- **Diseño responsive**: Funciona en desktop y móvil

## Demo

Visita: [https://glasskutter.github.io/glasscutter/](https://glasskutter.github.io/glasscutter/)

## Uso

1. Ingresa las dimensiones de la lámina (ancho × alto en pulgadas)
2. Opcionalmente activa el **Kerf** si necesitas considerar el grosor del corte
3. Agrega las piezas que necesitas cortar con sus dimensiones y cantidad
4. Haz clic en **Calcular Diseño Óptimo**
5. Revisa el resultado y exporta a PDF o imprime

## Desarrollo local

### Requisitos

- Node.js 18+
- npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/glasskutter/glasscutter.git
cd glasscutter

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |

## Tecnologías

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation

## Despliegue

El proyecto incluye un workflow de GitHub Actions que despliega automáticamente a GitHub Pages cuando se hace push a `main`.

Para configurar:

1. Ve a **Settings** → **Pages** en tu repositorio
2. En **Source**, selecciona **GitHub Actions**
3. Haz push a `main` y el deploy se ejecutará automáticamente

## Licencia

MIT
