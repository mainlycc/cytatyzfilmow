import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      );
    }

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Użytkownik z tym emailem lub nazwą już istnieje' },
        { status: 400 }
      );
    }

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(password, 10);

    // Utwórz użytkownika
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json(
      { 
        message: 'Użytkownik został utworzony pomyślnie',
        user
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    );
  }
} 