import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }

    // Cari user di database
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    // User tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Cek status user (jangan login jika deleted)
    if (user.deleted_at) {
      return NextResponse.json(
        { error: 'Akun telah dihapus' },
        { status: 401 }
      );
    }

    // Validasi password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Return user data (tanpa password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
        message: 'Login berhasil',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}