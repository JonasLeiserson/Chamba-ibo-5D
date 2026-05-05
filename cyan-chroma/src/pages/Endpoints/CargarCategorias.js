export const prerender = false;
import sql from '../carga.js';

export async function GET({ url }) {
  try {
    const usuarioNombre = url.searchParams.get('usuario');

    if (!usuarioNombre) {
      return new Response(JSON.stringify({ error: "Usuario no proporcionado" }), { status: 400 });
    }

    const usuarios = await sql`SELECT "ID" FROM "Usuarios" WHERE "Nombre" = ${usuarioNombre}`;
    
    if (usuarios.length === 0) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    const id_usuario = usuarios[0].ID;

    const categorias = await sql`
      SELECT id, nombre_categoria, words 
      FROM categorias_usuario 
      WHERE id_usuario = ${id_usuario}
    `;

    return new Response(JSON.stringify(categorias), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error al cargar categorías:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}