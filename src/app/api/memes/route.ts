import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  

export async function POST(request: Request) {
  try {
    const { authorId, imageUrl, text, hashtags } = await request.json();

    if (!authorId || !imageUrl) {
      return NextResponse.json(
        { error: 'Obrazek i autor są wymagani' },
        { status: 400 }
      );
    }

    // Sprawdź czy autor istnieje
    const author = await prisma.user.findUnique({
      where: { id: authorId }
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Nie znaleziono autora' },
        { status: 404 }
      );
    }

    // Utwórz mema
    const meme = await prisma.meme.create({
      data: {
        imageUrl,
        text,
        hashtags: hashtags || [],
        authorId,
      },
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true
          }
        }
      }
    });
    
    return NextResponse.json({ meme }, { status: 201 });
  } catch (error) {
    console.error('Błąd tworzenia mema:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas tworzenia mema' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const hashtag = searchParams.get('hashtag');

    const skip = (page - 1) * limit;

    const where = hashtag ? {
      hashtags: {
        has: hashtag
      }
    } : {};

    const [memes, total] = await Promise.all([
      prisma.meme.findMany({
        where,
        include: {
          author: {
            select: {
              username: true,
              profilePicture: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip
      }),
      prisma.meme.count({ where })
    ]);
    
    return NextResponse.json({
      memes,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    console.error('Błąd pobierania memów:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania memów' },
      { status: 500 }
    );
  }
} 