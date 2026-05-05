export const prerender = false;
import sql from '../carga.js';

export async function POST({ request }) {
  try {
    const { nombre_categoria, words, usuarioNombre } = await request.json();

    if (!nombre_categoria || !usuarioNombre) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });
    }

    const usuarios = await sql`SELECT "ID" FROM "Usuarios" WHERE "Nombre" = ${usuarioNombre}`;
    
    if (usuarios.length === 0) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    const id_usuario = usuarios[0].ID;

    await sql`
      INSERT INTO categorias_usuario (id_usuario, nombre_categoria, words)
      VALUES (${id_usuario}, ${nombre_categoria}, ${JSON.stringify(words)})
    `;

    return new Response(JSON.stringify({ success: true }), { status: 201 });

  } catch (error) {
    console.error("Error en categorias:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}