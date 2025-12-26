import express from 'express';
import pool from '../db';
import { RowDataPacket } from 'mysql2/promise';

const router = express.Router();

// POST /api/reservations - Create a new reservation
router.post('/', async (req, res) => {
  const {
    place_id,
    user_id,
    reservation_date,
    reservation_time,
    number_of_people,
    guest_name,
    guest_phone,
    requests,
  } = req.body;

  if (
    !place_id ||
    !user_id ||
    !reservation_date ||
    !reservation_time ||
    !number_of_people ||
    !guest_name ||
    !guest_phone
  ) {
    return res.status(400).json({ message: 'Missing required reservation fields' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO reservation (
        place_id, user_id, reservation_date, reservation_time,
        number_of_people, guest_name, guest_phone, requests, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        place_id,
        user_id,
        reservation_date,
        reservation_time,
        number_of_people,
        guest_name,
        guest_phone,
        requests,
      ]
    );

    res.status(201).json({
      message: 'Reservation created successfully',
      reservationId: (result as any).insertId,
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// GET /api/reservations/shop/:shopId - Get reservations for a specific shop
router.get('/shop/:shopId', async (req, res) => {
  const { shopId } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT r.*, u.nickname as guest_nickname, u.email as guest_email
       FROM reservation r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.place_id = ?
       ORDER BY r.reservation_date DESC, r.reservation_time DESC`,
      [shopId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching reservations for shop:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
