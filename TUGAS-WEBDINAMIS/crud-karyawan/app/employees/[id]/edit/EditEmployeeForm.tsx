'use client';

import { useState } from 'react';
import { updateEmployee } from '../../actions';
import { useRouter } from 'next/navigation';

type Department = { id: number; name: string };
type Position   = { id: number; name: string; departmentId: number };
type Skill      = { id: number; name: string };
type Employee   = any; // Simplified for this example

type Props = {
  employee: Employee;
  departments: Department[];
  positions:   Position[];
  skills:      Skill[];
};

export default function EditEmployeeForm({ employee, departments, positions, skills }: Props) {
  const router = useRouter();
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    employee.position.departmentId.toString()
  );
  
  // Track selected skills
  const initialSkillIds = employee.skills.map((s: any) => s.id.toString());

  const filteredPositions = positions.filter(
    (p) => p.departmentId === parseInt(selectedDeptId)
  );

  const updateAction = updateEmployee.bind(null, employee.id);

  return (
    <form action={async (formData) => {
      await updateAction(formData);
      router.push('/employees'); // Redirect after success
    }} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Edit Karyawan</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <input type="text" name="name" required defaultValue={employee.name} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" required defaultValue={employee.email} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="gender" value="male" required defaultChecked={employee.gender === 'male'} />
            <span className="text-sm">Laki-laki</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="gender" value="female" defaultChecked={employee.gender === 'female'} />
            <span className="text-sm">Perempuan</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status Karyawan</label>
        <select name="status" required defaultValue={employee.status} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Pilih Status --</option>
          <option value="active">Aktif</option>
          <option value="probation">Masa Percobaan</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
          <select name="departmentId" value={selectedDeptId} onChange={(e) => setSelectedDeptId(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
          <select name="positionId" required defaultValue={employee.positionId} disabled={!selectedDeptId} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
            {filteredPositions.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill) => (
            <label key={skill.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="skills" value={skill.id} defaultChecked={initialSkillIds.includes(skill.id.toString())} className="w-4 h-4 text-blue-600" />
              <span className="text-sm">{skill.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil Baru (Opsional)</label>
        <input type="file" name="photo" accept="image/*" className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {employee.photoPath && <p className="text-xs text-gray-500 mt-2">Biarkan kosong jika tidak ingin mengubah foto.</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={() => router.push('/employees')} className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
          Batal
        </button>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Update Karyawan
        </button>
      </div>
    </form>
  );
}
