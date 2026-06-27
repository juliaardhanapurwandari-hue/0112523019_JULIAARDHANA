import { prisma } from '@/lib/prisma';
import EditEmployeeForm from './EditEmployeeForm';
import { notFound } from 'next/navigation';

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  // Ambil data karyawan yang mau di-edit
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      position: true,
      skills: true,
    },
  });

  if (!employee) {
    notFound();
  }

  // Ambil master data
  const departments = await prisma.department.findMany();
  const positions   = await prisma.position.findMany();
  const skills      = await prisma.skill.findMany();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Edit Karyawan</h1>
      
      <EditEmployeeForm 
        employee={employee}
        departments={departments}
        positions={positions}
        skills={skills}
      />
    </main>
  );
}
