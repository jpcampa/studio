
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Esta ruta de API ya no es necesaria porque las preguntas están incrustadas directamente
// en los componentes para garantizar la máxima fiabilidad.
// Se mantiene el archivo por si se decide reactivar en el futuro, pero no se llamará.

export async function GET(request: Request) {
  try {
    // Construye la ruta al archivo JSON. process.cwd() apunta al directorio raíz del proyecto.
    const jsonDirectory = path.join(process.cwd(), 'src', 'components', 'resources');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'assesment-questions.json'), 'utf8');
    const data = JSON.parse(fileContents);
    
    // Devuelve los datos JSON con un status 200 OK
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading assessment questions file:", error);
    // Devuelve un error 500 si algo sale mal
    return NextResponse.json({ error: 'Failed to load assessment questions' }, { status: 500 });
  }
}

    