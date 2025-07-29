
// src/data/knowledgeBase.ts

// This file acts as a simple knowledge base for the RAG assistant.
// In a production system, this data would come from a database, file uploads, or a vector store.

// INSTRUCTIONS:
// To add your own knowledge, replace the content of the `documents` array with your own text.
// Each string in the array represents a separate document or a chunk of a document.

export const documents = [
  `
  **Manual de Procedimiento de Emergencia - Código Rojo**

  **1. Activación del Código Rojo:**
  El Código Rojo se activa en caso de incendio confirmado, amenaza de bomba o desastre natural inminente. La activación la realiza el Jefe de Seguridad o su suplente designado a través del sistema de alarma central.

  **2. Evacuación:**
  - Al sonar la alarma, todo el personal debe evacuar el edificio de manera inmediata y ordenada.
  - Utilice las rutas de evacuación señalizadas. NO utilice los ascensores.
  - El personal de brigada (identificado con chaleco naranja) guiará a los empleados hacia los puntos de encuentro designados.

  **3. Puntos de Encuentro:**
  - Punto de Encuentro Primario: Estacionamiento Norte.
  - Punto de Encuentro Secundario (si el primario no es seguro): Parque Central, a 200 metros del edificio.

  **4. Responsabilidades del Personal:**
  - Ayude a las personas con movilidad reducida.
  - No regrese al edificio por ningún motivo hasta que se anuncie el fin de la emergencia.
  - Reporte su llegada al punto de encuentro con el líder de su departamento.

  **5. Contacto de Emergencia:**
  - Jefe de Seguridad: Juan Pérez, Ext. 5001
  - Servicios Médicos de Emergencia: 911 (o el número local correspondiente)
  `,
  `
  **Política de Solicitud de Vacaciones**

  **1. Proceso de Solicitud:**
  - Todas las solicitudes de vacaciones deben realizarse a través del portal de Recursos Humanos con un mínimo de 30 días de antelación para periodos de 5 o más días laborables.
  - Para periodos de 1 a 4 días, la antelación mínima es de 7 días laborables.

  **2. Aprobación:**
  - Las solicitudes son aprobadas por el supervisor directo del empleado.
  - La aprobación está sujeta a las necesidades operativas del departamento y a la no coincidencia con otros miembros clave del equipo.
  - El empleado recibirá una notificación por correo electrónico una vez que la solicitud sea aprobada o denegada.

  **3. Días Festivos y Periodos de Bloqueo:**
  - No se aprobarán solicitudes de vacaciones durante el último trimestre del año fiscal (octubre-diciembre) debido al cierre anual, salvo excepciones autorizadas por la Dirección.
  - Los días festivos oficiales no necesitan ser solicitados y no se descuentan del saldo de vacaciones.

  **4. Saldo de Vacaciones:**
  - El saldo de días de vacaciones disponibles se puede consultar en cualquier momento en el portal de Recursos Humanos.
  `,
];
