# App de Registro de Tiempo ⏱️

Aplicación web para registrar tareas y tiempo de trabajo, ideal para autoempleados o trabajadores que necesitan llevar control de sus horas por tarea.

## Características ✨

- ⏰ **Timer en tiempo real** - Inicia una tarea y el tiempo comienza a correr automáticamente
- ⏸️ **Pausar/Reanudar** - Pausa y reanuda tareas en cualquier momento
- 📝 **Historial completo** - Ve todas tus tareas completadas con su tiempo registrado
- ✏️ **Editar tareas** - Modifica nombres y tiempos de tareas del historial
- 🗑️ **Eliminar tareas** - Borra entradas erróneas del historial
- 📊 **Resumen diario y semanal** - Visualiza tus totales de tiempo agrupados
- 💾 **Almacenamiento local** - Todos tus datos se guardan en tu navegador

## Instalación y Uso Local 🚀

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   La aplicación estará disponible en `http://localhost:5173`

## Despliegue en GitHub Pages 🌐

Para publicar la aplicación en GitHub Pages:

1. **Construir y desplegar**
   ```bash
   npm run deploy
   ```

2. **Configurar GitHub Pages**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - En "Source", selecciona la rama `gh-pages`
   - Guarda los cambios

3. **Acceder a tu aplicación**
   Tu app estará disponible en: `https://[tu-usuario].github.io/App-de-registro-de-tiempo/`

## Cómo Usar la App 📖

### Registrar una Tarea

1. En la pestaña **Registro**, escribe el nombre de tu tarea
2. Presiona "Iniciar Tarea"
3. El timer comenzará automáticamente

### Pausar/Reanudar

- Usa el botón **⏸ Pausar** para detener temporalmente el timer
- Usa el botón **▶ Reanudar** para continuar

### Completar una Tarea

- Presiona **✓ Completar** cuando termines
- La tarea se guardará en el historial

### Ver Historial

- Ve a la pestaña **Historial**
- Verás todas tus tareas completadas
- Puedes editar o eliminar cualquier entrada

### Ver Resumen

- Ve a la pestaña **Resumen**
- Alterna entre vista **Diaria** y **Semanal**
- Ve el tiempo total registrado y el desglose por período

## Tecnologías Utilizadas 🛠️

- **React** - Framework de UI
- **React Native Web** - Componentes nativos para web
- **Vite** - Build tool y dev server
- **LocalStorage** - Persistencia de datos
- **GitHub Pages** - Hosting gratuito

## Notas 📌

- Todos los datos se almacenan localmente en tu navegador
- No se envía información a ningún servidor
- Si borras el caché del navegador, perderás tus datos
- La aplicación funciona offline después de la primera carga

---

Hecho con ❤️ para facilitar el registro de tiempo de trabajo
