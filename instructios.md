Quiero que desarrolles una web app estática, mobile first, pensada para usar desde el celular durante mi viaje a Nueva York.

La app debe poder subirse y servirse desde GitHub Pages, sin backend. Usar HTML, CSS y JavaScript puro. No usar frameworks complejos. El código debe estar separado en estos archivos:

- index.html
- styles.css
- app.js

La app debe verse como una app real, no como una página básica. Priorizar diseño visual moderno, prolijo, urbano y travel planner premium. Tiene que estar optimizada para mobile.

Contexto del viaje:
- Viajo a Manhattan el 30/10/2026.
- Vuelvo el 06/11/2026.
- Me hospedo en The Gregorian New York City.
- Voy a estar en Nueva York durante Halloween.
- Quiero recorrer la ciudad de forma libre, sin itinerario rígido.
- Desde JFK al hotel me voy a mover en transporte público/subte.
- Voy a usar OMNY para pagar el transporte.

Objetivo:
Crear una mini app personal de viaje para tener todo organizado desde el celular: cuenta regresiva, lugares pendientes, clima, gastos, transporte, links útiles y notas.

La app debe tener navegación inferior fija tipo app mobile con estas secciones:

- Inicio
- Lugares
- Gastos
- Clima
- Notas

REQUISITOS GENERALES

- Mobile first.
- Diseño responsive.
- Funcionar correctamente desde GitHub Pages.
- No usar backend.
- Usar localStorage para guardar datos.
- Usar JavaScript puro.
- No usar API keys privadas.
- El código debe estar limpio, comentado y fácil de editar.
- Crear una experiencia visual cuidada: cards, botones grandes, bordes redondeados, buena separación, tipografía moderna e íconos simples.
- Estética NYC: urbana, elegante, luces de ciudad y un toque Halloween sutil, sin sobrecargar.

SECCIÓN 1: INICIO / DASHBOARD

Debe mostrar:

- Título del viaje: “NYC Trip 2026”
- Fechas: “30 Oct - 06 Nov”
- Alojamiento: “The Gregorian New York City”
- Card destacada de “Halloween en NYC”
- Contador de días faltantes
- Resumen rápido:
  - Días restantes
  - Días totales del viaje
  - Total gastado
  - Lugares pendientes
  - Lugares visitados

El dashboard debe verse lindo desde el celular y dar una visión rápida del viaje.

SECCIÓN 2: CONTADOR REGRESIVO

Crear un contador dinámico hasta el 30/10/2026.

Debe mostrar:

- Días
- Horas
- Minutos

Reglas:
- Si todavía no empezó el viaje, mostrar cuánto falta.
- Si ya empezó el viaje, mostrar: “Ya estás en NYC”.
- Si ya terminó, mostrar: “Viaje finalizado”.

SECCIÓN 3: LUGARES PARA VISITAR

Crear una sección tipo checklist editable.

Lugares iniciales obligatorios:

- Downtown / Financial District
- New Jersey
- Central Park
- Times Square
- Rockefeller Center
- Edge
- Brooklyn

Funcionalidades:

- Cada lugar debe tener checkbox para marcar como visitado.
- Guardar el estado en localStorage.
- Permitir agregar nuevos lugares.
- Permitir eliminar lugares agregados.
- Permitir asignar categoría opcional.

Categorías sugeridas:

- Manhattan
- Brooklyn
- New Jersey
- Mirador
- Parque
- Halloween
- Otro

Mostrar progreso visual, por ejemplo:

“3 de 7 lugares visitados”

Agregar una barra de progreso simple.

SECCIÓN 4: GASTOS

Crear una sección para registrar gastos del viaje.

Campos del formulario:

- Fecha
- Concepto
- Categoría
- Monto
- Moneda: USD / ARS
- Método de pago: efectivo, tarjeta, débito, otro

Categorías sugeridas:

- Comida
- Transporte
- Compras
- Entradas / atracciones
- Hotel
- Vuelos
- Otros

Funcionalidades:

- Agregar gasto.
- Listar gastos.
- Eliminar gasto.
- Guardar gastos en localStorage.
- Mostrar total gastado en USD.
- Mostrar total gastado en ARS.
- Mostrar total por categoría.
- Mostrar los gastos como cards fáciles de leer desde mobile.
- Mostrar un resumen superior con los totales.

No hace falta conversión automática entre monedas. Solo sumar por moneda.

SECCIÓN 5: CLIMA

Crear una sección de clima para Nueva York.

La app debe funcionar desde GitHub Pages sin backend.

Usar JavaScript con fetch() desde el navegador para consultar una API pública de clima que permita CORS y no requiera API key privada.

Preferentemente usar Open-Meteo.

Coordenadas de Manhattan/Nueva York:

- latitude: 40.7128
- longitude: -74.0060
- timezone: America/New_York

Fechas del viaje:

- Inicio: 2026-10-30
- Fin: 2026-11-06

Importante:
Como el forecast real solo está disponible pocos días antes, la app no debe inventar datos.

Reglas:
- Si las fechas del viaje todavía están fuera del rango disponible de forecast, mostrar este mensaje:
  “El clima exacto todavía no está disponible. Se actualizará automáticamente cuando falten pocos días para el viaje.”
- Si las fechas ya están dentro del rango disponible, mostrar el clima por día:
  - Fecha
  - Temperatura mínima
  - Temperatura máxima
  - Probabilidad de lluvia
  - Precipitación
  - Descripción o icono simple del clima

La sección debe estar preparada para funcionar hoy aunque todavía no haya datos reales del viaje.

Ejemplo de endpoint base:

https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code&timezone=America/New_York&forecast_days=16

Implementar manejo de errores:
- Si falla la API, mostrar un mensaje amigable.
- No romper la app.
- Mostrar loading mientras carga.

SECCIÓN 6: TRANSPORTE

Crear una sección útil dentro del inicio o como card destacada.

Debe incluir:

- “Desde JFK al hotel”
- Medio principal: transporte público / subte.
- Pago con OMNY.
- Recordatorio: puedo pagar apoyando tarjeta contactless, celular o smartwatch compatible.
- Link o botón a Google Maps con destino al hotel.
- Link o botón a Google Maps para ruta JFK → The Gregorian New York City.
- Link a OMNY/MTA.

Importante:
No hardcodear una ruta como si fuera definitiva. Mostrar una nota:

“Revisar la ruta actualizada al llegar, porque los recorridos pueden cambiar según horario, mantenimiento o demoras.”

SECCIÓN 7: LINKS RÁPIDOS

Crear una sección de accesos rápidos con botones:

- Google Maps hotel
- Google Maps JFK → The Gregorian
- MTA / OMNY
- Times Square
- Central Park
- Brooklyn
- Edge
- Rockefeller Center

Los links deben abrir en una nueva pestaña.

SECCIÓN 8: NOTAS DEL VIAJE

Crear una sección simple de notas personales.

Funcionalidades:

- Textarea editable.
- Guardado automático en localStorage.
- Sirve para anotar ideas, direcciones, compras, recomendaciones, pendientes, etc.
- Mostrar un pequeño mensaje tipo “Notas guardadas” cuando se actualicen.

PERSISTENCIA

Usar localStorage para guardar:

- Lugares visitados.
- Lugares agregados.
- Gastos.
- Notas.

Si el usuario recarga la página, no debe perder los datos.

CONFIGURACIÓN EDITABLE

En app.js, dejar al principio un objeto de configuración fácil de modificar, por ejemplo:

const tripConfig = {
  title: "NYC Trip 2026",
  startDate: "2026-10-30",
  endDate: "2026-11-06",
  hotelName: "The Gregorian New York City",
  city: "New York",
  latitude: 40.7128,
  longitude: -74.0060
};

Usar ese objeto para que sea fácil cambiar fechas, hotel o destino en el futuro.

DISEÑO VISUAL

Quiero un estilo mobile app premium.

Sugerencia estética:

- Fondo oscuro elegante o claro con contraste moderno.
- Cards con blur o sombras suaves.
- Detalles en colores tipo NYC night:
  - negro/azul oscuro
  - blanco
  - amarillo taxi
  - naranja Halloween sutil
  - rosa/lila sutil si queda bien
- Botones grandes.
- Navegación inferior fija.
- Íconos simples con emojis o símbolos, pero sin abusar.
- Buena legibilidad.
- Nada muy infantil.

ACCESIBILIDAD Y USABILIDAD

- Inputs fáciles de tocar en celular.
- Botones grandes.
- Buen contraste.
- Estados vacíos claros.
- Mensajes de error amigables.
- No debe depender de librerías externas obligatorias.
- Puede usar Google Fonts si lo considerás necesario, pero que no rompa si no carga.

ENTREGABLE FINAL

Necesito que me entregues:

1. Código completo de index.html.
2. Código completo de styles.css.
3. Código completo de app.js.
4. Instrucciones simples para subirlo a GitHub Pages.
5. Explicación breve de cómo editar:
   - fechas del viaje
   - hotel
   - lugares iniciales
   - links rápidos
6. Explicación breve de cómo funciona el clima y por qué puede no mostrar datos hasta que falten pocos días.

No me des solo fragmentos. Dame los archivos completos listos para copiar y pegar.