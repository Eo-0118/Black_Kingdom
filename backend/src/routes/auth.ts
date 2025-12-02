import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db';

const router = express.Router();

// Signup Endpoint
router.post('/signup', async (req, res) => {
  const { email, password, date_of_birth, phone_number, sido, sigungu, dong, gender, nickname } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();

    try {
      const [result] = await connection.query(
        'INSERT INTO USER (email, password, date_of_birth, phone_number, sido, sigungu, dong, gender, nickname) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, date_of_birth, phone_number, sido, sigungu, dong, gender, nickname]
      );
      res.status(201).json({ message: 'User created successfully', userId: (result as any).insertId });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists.' });
    }
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.query('SELECT * FROM USER WHERE email = ?', [email]);
    
    const users = rows as any[];
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    const user = users[0];
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const { password: _, ...userData } = user;
    res.status(200).json({ message: 'Login successful', user: userData });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
