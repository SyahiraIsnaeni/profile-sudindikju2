import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const total = await prisma.user.count({
      where: { deleted_at: null },
    });

    const users = await prisma.user.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
      orderBy: { created_at: 'desc' },
      take: pageSize,
      skip: offset,
    });

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}