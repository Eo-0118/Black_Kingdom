import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import reservationsRouter from './routes/reservations'; // Import new reservations router

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from BlackKingdom Backend!');
});

// Use auth routes
app.use('/api/auth', authRouter);
// Use reservations routes
app.use('/api/reservations', reservationsRouter); // Add new reservations router

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
