import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './interface/middlewares/errorHanlder';
import { authMiddleware } from './interface/middlewares/authMiddleware';
import { Logger } from './shared/utils/logger';
import authRouter from './interface/routes/auth.route';


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get('/',  (req, res) => {
  res.send('Hello, World!');
});

// This mounts all auth routes at /auth prefix
app.use('/auth', authRouter);

app.use(errorHandler);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  Logger.success(`Server is running on port ${PORT}`);
});