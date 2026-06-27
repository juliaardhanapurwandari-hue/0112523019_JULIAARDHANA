'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get('q') || '';
  const currentStatus = searchParams.get('status') || '';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    const status = formData.get('status') as string;

    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);

    router.push(`/employees?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow flex gap-4 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Cari Nama</label>
        <input type="text" name="q" defaultValue={currentQ} placeholder="Cari karyawan..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter Status</label>
        <select name="status" defaultValue={currentStatus} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="probation">Masa Percobaan</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>
      <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors">
        Terapkan
      </button>
      {(currentQ || currentStatus) && (
        <button type="button" onClick={() => router.push('/employees')} className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors">
          Reset
        </button>
      )}
    </form>
  );
}
