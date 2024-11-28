import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function createUser(username: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  return prisma.user.create({
    data: {
      username,
      email,
      hashedPassword,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export async function createQuiz(
  authorId: string,
  question: string,
  options: string[],
  correctAnswer: string,
  movie: string
) {
  return prisma.quiz.create({
    data: {
      question,
      options,
      correctAnswer,
      movie,
      authorId,
    },
  })
}

export async function createMeme(
  authorId: string,
  imageUrl: string,
  text: string | null,
  hashtags: string[]
) {
  return prisma.meme.create({
    data: {
      imageUrl,
      text,
      hashtags,
      authorId,
    },
  })
}

export async function updateUserProfile(
  userId: string,
  data: {
    bio?: string
    profilePicture?: string
    email?: string
  }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
  })
}

export async function addFavoriteMovie(userId: string, title: string) {
  return prisma.favoriteMovie.create({
    data: {
      userId,
      title,
    },
  })
}

export async function createDiscussion(
  authorId: string,
  title: string,
  content: string
) {
  return prisma.discussion.create({
    data: {
      title,
      content,
      authorId,
    },
  })
}