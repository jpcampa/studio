# Mapa de Navegación de la Aplicación EMOTIVA

Este documento describe la estructura de navegación y las rutas principales de la aplicación.

## 1. Flujo de Autenticación y Acceso

El acceso a la aplicación se gestiona a través de un flujo de autenticación que separa las páginas públicas de las privadas.

- **`/` (Raíz):**
  - Es la página de entrada.
  - **Función:** Redirige automáticamente al usuario.
    - Si el usuario **está autenticado**, le lleva a `/dashboard`.
    - Si el usuario **no está autenticado**, le lleva a `/login`.

- **`/welcome`:**
  - Es una pantalla de bienvenida que se muestra la primera vez que un usuario inicia sesión.

### 1.1. Grupo de Rutas de Autenticación `(auth)`

Estas rutas tienen un diseño específico para el inicio de sesión y el registro.

- **`/login`:** Página de inicio de sesión para usuarios existentes.
- **`/register`:** Página de registro para nuevos usuarios.

## 2. Flujo Principal de la Aplicación (Autenticado)

Una vez que el usuario ha iniciado sesión, accede a la sección principal de la aplicación, que cuenta con una barra de navegación lateral y un encabezado común.

### 2.1. Panel Principal

- **`/dashboard`:**
  - Es la página principal para usuarios autenticados.
  - Muestra un resumen del estado de bienestar del usuario, su progreso, y accesos directos a otras secciones como el registro emocional, las rutas y las evaluaciones.

### 2.2. Evaluación Emocional

- **`/assessment/intro`:** Página de introducción que explica el propósito y el formato de la evaluación inicial.
- **`/assessment`:** Página del cuestionario de evaluación, donde el usuario responde a las preguntas.
- **`/assessment/results-intro`:** Una pantalla de transición que se muestra después de completar la evaluación, antes de ver los resultados.
- **`/assessment/current-results`:** Muestra un análisis detallado de los resultados de la evaluación más reciente.
- **`/my-assessments`:** Página que muestra un historial de todas las evaluaciones que el usuario ha completado.
  - **`/assessment/history-results/[assessmentId]`:** Página de detalle que muestra los resultados de una evaluación histórica específica.

### 2.3. Rutas de Desarrollo

- **`/paths`:** Muestra un listado de todas las rutas de desarrollo personal disponibles (ej. "Gestionar el Estrés", "Poner Límites").
- **`/paths/my-summary`:** Un panel que resume el progreso del usuario en todas las rutas que ha iniciado.
- **`/paths/[pathId]`:** Página de detalle de una ruta específica, donde se muestran todos los módulos y su contenido (psicoeducación, ejercicios, etc.).

### 2.4. Herramientas de Registro y Asistencia

- **`/emotional-log`:** Página que muestra un historial completo de todos los registros emocionales que el usuario ha guardado.
- **`/therapeutic-notebook`:** Un cuaderno digital donde se almacenan y muestran todas las reflexiones y ejercicios escritos por el usuario en las diferentes rutas.
- **`/chatbot`:** Interfaz de chat con el "Mentor Emocional AI" para recibir apoyo y guía.
- **`/knowledge-assistant`:** Interfaz para hacer preguntas sobre una base de conocimiento específica (documentos internos).

### 2.5. Recursos

- **`/resources`:** Muestra las categorías principales de artículos y otros recursos (ej. "Autoestima", "Ansiedad").
- **`/resources/category/[slug]`:** Muestra un listado de todos los artículos pertenecientes a una categoría específica.
- **`/resources/post/[slug]`:** Página de detalle que muestra el contenido completo de un artículo o recurso.

### 2.6. Configuración

- **`/settings`:** Página principal de configuración donde el usuario puede gestionar su información personal, preferencias de la aplicación y tema visual.
- **`/settings/change-password`:** Formulario para que el usuario pueda cambiar su contraseña.
- **`/settings/delete-account`:** Página con el formulario y las advertencias para solicitar la eliminación permanente de la cuenta.
