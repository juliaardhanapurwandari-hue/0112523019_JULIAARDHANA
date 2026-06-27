import { Request, Response } from "express";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET /api/mahasiswa - Mengambil semua data mahasiswa
export const getAllMahasiswa = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM mahasiswa ORDER BY id DESC"
    );

    res.json({
      message: "Data mahasiswa berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Error getAllMahasiswa:", error);
    res.status(500).json({
      message: "Gagal mengambil data mahasiswa",
    });
  }
};

// POST /api/mahasiswa - Menambah data mahasiswa
export const createMahasiswa = async (req: Request, res: Response) => {
  try {
    const { nim, nama, prodi, angkatan } = req.body;

    if (!nim || !nama || !prodi || !angkatan) {
      res.status(400).json({
        message: "Semua field (nim, nama, prodi, angkatan) harus diisi",
      });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES (?, ?, ?, ?)",
      [nim, nama, prodi, angkatan]
    );

    const [newData] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM mahasiswa WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Data mahasiswa berhasil ditambahkan",
      data: newData[0],
    });
  } catch (error) {
    console.error("Error createMahasiswa:", error);
    res.status(500).json({
      message: "Gagal menambahkan data mahasiswa",
    });
  }
};

// PUT /api/mahasiswa/:id - Mengubah data mahasiswa
export const updateMahasiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nim, nama, prodi, angkatan } = req.body;

    if (!nim || !nama || !prodi || !angkatan) {
      res.status(400).json({
        message: "Semua field (nim, nama, prodi, angkatan) harus diisi",
      });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE mahasiswa SET nim = ?, nama = ?, prodi = ?, angkatan = ? WHERE id = ?",
      [nim, nama, prodi, angkatan, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: "Data mahasiswa tidak ditemukan",
      });
      return;
    }

    res.json({
      message: "Data mahasiswa berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updateMahasiswa:", error);
    res.status(500).json({
      message: "Gagal memperbarui data mahasiswa",
    });
  }
};

// DELETE /api/mahasiswa/:id - Menghapus data mahasiswa
export const deleteMahasiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM mahasiswa WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: "Data mahasiswa tidak ditemukan",
      });
      return;
    }

    res.json({
      message: "Data mahasiswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleteMahasiswa:", error);
    res.status(500).json({
      message: "Gagal menghapus data mahasiswa",
    });
  }
};
