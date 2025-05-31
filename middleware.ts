import { NextResponse, NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  // Middleware simplu pentru a asigura că avem acces la variabilele de mediu
  return NextResponse.next();
} 