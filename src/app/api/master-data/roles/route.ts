import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const total = await prisma.role.count();

    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        status: true,
      },
      orderBy: { name: 'asc' },
      take: pageSize,
      skip: offset,
    });

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: roles,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}