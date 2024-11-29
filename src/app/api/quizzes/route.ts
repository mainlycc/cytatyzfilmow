import { NextResponse } from 'next/server';
import { createQuiz } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Otrzymane dane:', body);

    const { authorId, question, options, correctAnswer, movie } = body;

    if (!authorId || !question || !options || !correctAnswer || !movie) {
      console.log('Brakujące pola:', { authorId, question, options, correctAnswer, movie });
      return NextResponse.json(
        { error: 'Brakujące dane' },
        { status: 400 }
      );
    }

    console.log('Próba utworzenia quizu...');
    const quiz = await createQuiz(authorId, question, options, correctAnswer, movie);
    console.log('Utworzony quiz:', quiz);
    
    return NextResponse.json({ quiz }, { status: 201 });
  } catch (error) {
    console.error('Szczegóły błędu:', error);
    return NextResponse.json(
      { error: 'Błąd podczas tworzenia quizu' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        author: {
          select: {
            username: true
          }
        },
        attempts: {
          select: {
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ quizzes });
  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd podczas pobierania quizów' },
      { status: 500 }
    );
  }
} 