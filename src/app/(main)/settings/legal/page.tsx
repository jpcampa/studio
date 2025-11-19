
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LegalNoticePage() {
  const legalContent = `
    <section class="lopd-texto prose dark:prose-invert max-w-none text-sm text-foreground/90">
      <h2 class="text-xl font-semibold text-primary">Protección de Datos Personales – Información Básica</h2>

      <p>
        De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), le informamos de que los datos que se tratan en esta aplicación están destinados exclusivamente al análisis y gestión del perfil emocional, con el fin de ofrecer servicios de bienestar, evaluación y mejora organizacional.
      </p>

      <h3 class="text-lg font-semibold text-primary mt-4">Responsable del Tratamiento</h3>
      <p>
        <strong>Futuver Consulting, S.L.</strong> (NIF B33827320)<br>
        Domicilio: C/ Jimena Fernández de la Vega, 55 – Edificio Futuver, 33203 Gijón – Asturias<br>
        Correo electrónico: <a href="mailto:lopd@futuver.com" class="text-accent hover:underline">lopd@futuver.com</a>
      </p>

      <h3 class="text-lg font-semibold text-primary mt-4">Finalidad del tratamiento</h3>
      <p>
        Gestionar y analizar los datos emocionales introducidos o generados en la aplicación para la creación de informes, estadísticas, perfiles agregados y recomendaciones orientadas al bienestar.
      </p>

      <h3 class="text-lg font-semibold text-primary mt-4">Base legal</h3>
      <p>
        El tratamiento se basa en:
      </p>
      <ul class="list-disc list-inside space-y-1">
        <li>El consentimiento explícito del usuario.</li>
        <li>El interés legítimo en el análisis agregado de bienestar organizacional, cuando resulte aplicable.</li>
      </ul>

      <h3 class="text-lg font-semibold text-primary mt-4">Datos tratados</h3>
      <p>
        Se procesa información relativa al perfil emocional, tales como indicadores de ánimo, motivación, estrés, energía u otras dimensiones similares.
      </p>
      <p>
        Los datos que permitirían identificar directamente a una persona se almacenan separadamente y encriptados mediante técnicas de seudonimización, de modo que no es posible vincular un perfil emocional a una persona física sin el uso de claves adicionales bajo control exclusivo del responsable del tratamiento.
      </p>

      <h3 class="text-lg font-semibold text-primary mt-4">Destinatarios</h3>
      <p>
        No se cederán datos a terceros salvo obligación legal o requerimiento de autoridad competente. Los datos se presentan únicamente en forma agregada o anonimizada para fines estadísticos o de análisis corporativo.
      </p>

      <h3 class="text-lg font-semibold text-primary mt-4">Conservación</h3>
      <p>
        Los datos se conservarán mientras permanezca activo el servicio o exista consentimiento del usuario. La información agregada o anonimizada podrá conservarse indefinidamente, al no permitir la identificación de personas físicas.
      </p>

      <h3 class="text-lg font-semibold text-primary mt-4">Derechos del usuario</h3>
      <p>
        El usuario puede ejercer sus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición mediante petición escrita a 
        <a href="mailto:lopd@futuver.com" class="text-accent hover:underline">lopd@futuver.com</a>, acompañando un documento acreditativo de identidad.
      </p>
      <p>
        Asimismo, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos si considera que sus derechos no han sido debidamente atendidos.
      </p>

      <h3 class="text-lg font-semibold text-primary mt-4">Medidas de seguridad</h3>
      <p>
        Los datos se almacenan y procesan mediante mecanismos de cifrado, seudonimización, control de accesos, registro de actividad y otras medidas técnicas y organizativas adecuadas para garantizar su integridad, confidencialidad y disponibilidad.
      </p>
    </section>
  `;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
            Aviso Legal y Política de Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent 
          dangerouslySetInnerHTML={{ __html: legalContent }} 
        />
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/settings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Configuración
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
