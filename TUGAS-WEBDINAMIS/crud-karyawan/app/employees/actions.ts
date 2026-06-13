'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function createEmployee(formData: FormData) {
  const name       = formData.get('name') as string;
  const email      = formData.get('email') as string;
  const gender     = formData.get('gender') as string;
  const status     = formData.get('status') as string;
  const positionId = parseInt(formData.get('positionId') as string);
  const skillIds   = formData.getAll('skills') as string[];
  const photo      = formData.get('photo') as File;

  // Validasi Email (Tugas Mandiri #3)
  const existingEmployee = await prisma.employee.findUnique({ where: { email } });
  if (existingEmployee) {
    throw new Error('Email sudah terdaftar!');
  }

  let photoPath: string | null = null;
  if (photo && photo.size > 0) {
    const bytes    = await photo.arrayBuffer();
    const buffer   = Buffer.from(bytes);
    const filename = `${Date.now()}-${photo.name.replace(/\s/g, '_')}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);
    photoPath = `/uploads/${filename}`;
  }

  await prisma.employee.create({
    data: {
      name,
      email,
      gender,
      status,
      positionId,
      photoPath,
      skills: {
        connect: skillIds.map((id) => ({ id: parseInt(id) })),
      },
    },
  });

  revalidatePath('/employees');
}

// ACTION: Update Karyawan (Tugas Mandiri #1)
export async function updateEmployee(id: number, formData: FormData) {
  const name       = formData.get('name') as string;
  const email      = formData.get('email') as string;
  const gender     = formData.get('gender') as string;
  const status     = formData.get('status') as string;
  const positionId = parseInt(formData.get('positionId') as string);
  const skillIds   = formData.getAll('skills') as string[];
  const photo      = formData.get('photo') as File;

  // Cek apakah email dipakai oleh user lain
  const existingEmail = await prisma.employee.findUnique({ where: { email } });
  if (existingEmail && existingEmail.id !== id) {
    throw new Error('Email sudah terdaftar untuk karyawan lain!');
  }

  let photoPath: string | undefined = undefined;
  if (photo && photo.size > 0) {
    const bytes    = await photo.arrayBuffer();
    const buffer   = Buffer.from(bytes);
    const filename = `${Date.now()}-${photo.name.replace(/\s/g, '_')}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);
    photoPath = `/uploads/${filename}`;
  }

  await prisma.employee.update({
    where: { id },
    data: {
      name,
      email,
      gender,
      status,
      positionId,
      ...(photoPath && { photoPath }), // Hanya update foto jika ada file baru
      skills: {
        set: [], // Hapus relasi lama
        connect: skillIds.map((sid) => ({ id: parseInt(sid) })), // Tambah relasi baru
      },
    },
  });

  revalidatePath('/employees');
}

export async function deleteEmployee(id: number) {
  await prisma.employee.delete({ where: { id } });
  revalidatePath('/employees');
}
