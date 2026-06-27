-- Membuat database jika belum ada
CREATE DATABASE IF NOT EXISTS db_mahasiswa;

USE db_mahasiswa;

-- Membuat tabel mahasiswa
CREATE TABLE IF NOT EXISTS mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  prodi VARCHAR(100) NOT NULL,
  angkatan INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data contoh (opsional)
INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES
('2201001', 'Ahmad Fauzi', 'Informatika', 2022),
('2201002', 'Siti Nurhaliza', 'Informatika', 2022),
('2201003', 'Budi Santoso', 'Sistem Informasi', 2022),
('2301001', 'Dewi Lestari', 'Informatika', 2023),
('2301002', 'Eko Prasetyo', 'Sistem Informasi', 2023);
