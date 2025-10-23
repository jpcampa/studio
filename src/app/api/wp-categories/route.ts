// src/app/api/wp-categories/route.ts
import { NextResponse } from 'next/server';

const API_BASE_URL = "https://workwellfut.com/wp-json/wp/v2";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories?per_page=100&_fields=id,name,slug,count`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }
    const categories: any[] = await res.json();
    const filteredCategories = categories.filter(cat => cat.slug !== 'sin-categoria' && cat.count > 0);
    return NextResponse.json(filteredCategories);
  } catch (error: any) {
    console.error("Error in /api/wp-categories:", error);
    return NextResponse.json({ error: "Error al consultar las categorías de WordPress", details: error.message }, { status: 502 });
  }
}
