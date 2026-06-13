import { prisma } from '@/lib/prisma';
import EmployeeForm from './EmployeeForm';
import { deleteEmployee } from './actions';
import Image from 'next/image';
import Link from 'next/link';
import SearchFilter from './SearchFilter';

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  const departments = await prisma.department.findMany();
  const positions   = await prisma.position.findMany();
  const skills      = await prisma.skill.findMany();

  // Pagination & Filter (Tugas Mandiri #2 & #4)
  const page = parseInt(searchParams.page || '1');
  const take = 5;
  const skip = (page - 1) * take;
  const q = searchParams.q || '';
  const status = searchParams.status || '';

  const whereClause: any = {};
  if (q) whereClause.name = { contains: q };
  if (status) whereClause.status = status;

  const employees = await prisma.employee.findMany({
    where: whereClause,
    include: {
      skills: true,
      position: {
        include: {
          department: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });

  const totalEmployees = await prisma.employee.count({ where: whereClause });
  const totalPages = Math.ceil(totalEmployees / take);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Manajemen Karyawan</h1>

      <EmployeeForm departments={departments} positions={positions} skills={skills} />

      <SearchFilter />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Data Karyawan (Total: {totalEmployees})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Foto</th>
                <th className="px-4 py-3 text-left">Nama & Email</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Jabatan & Dept.</th>
                <th className="px-4 py-3 text-left">Skill</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Belum ada data.
                  </td>
                </tr>
              )}
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {emp.photoPath ? (
                      <Image src={emp.photoPath} alt={emp.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    <p className="text-gray-400 text-xs">{emp.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">
                    {emp.gender === 'male' ? '👨 Laki-laki' : '👩 Perempuan'}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-700">{emp.position.name}</p>
                    <p className="text-gray-400 text-xs">{emp.position.department.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {emp.skills.length === 0 && <span className="text-gray-400 text-xs">-</span>}
                      {emp.skills.map((s) => (
                        <span key={s.id} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{s.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      emp.status === 'active' ? 'bg-green-100 text-green-700' :
                      emp.status === 'probation' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {emp.status === 'active' ? 'Aktif' : emp.status === 'probation' ? 'Masa Percobaan' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/employees/${emp.id}/edit`} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                        Edit
                      </Link>
                      <form action={async () => { 'use server'; await deleteEmployee(emp.id); }}>
                        <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium">Hapus</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-600">Halaman {page} dari {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/employees?page=${page - 1}&q=${q}&status=${status}`} className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">
                  Sebelumnya
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/employees?page=${page + 1}&q=${q}&status=${status}`} className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">
                  Berikutnya
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
