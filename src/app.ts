import 'reflect-metadata';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { AppDataSource } from './data-source';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserPassword, loginUser } from './controllers/UserController';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const authorizationMiddleWare = function (req: Request, res: Response, next: NextFunction) {
    const authoHeader: string = req.headers?.authorization || '';

    let token, user;

    if (authoHeader.startsWith('Bearer ')) {
        token = authoHeader.slice(7);
    } else {
        return res.status(401).json({ message: 'Invalid authorization header' });
    }

    try {
        user = jwt.verify(token, process.env.JWT_SECRET || '');
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    console.log(user);

    next();
};

AppDataSource.initialize().then(() => {
    console.log('Connected to the database');

    const usersRouter = express.Router();
    usersRouter.use(authorizationMiddleWare);

    usersRouter.patch('/update-password/:id', updateUserPassword);
    usersRouter.get('/', getAllUsers);
    usersRouter.get('/:id', getUserById);
    usersRouter.patch('/:id', updateUser);
    usersRouter.delete('/:id', deleteUser);
    app.use('/users', usersRouter);
    
    app.post('/login', loginUser);
    app.post('/register', createUser);

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => console.log('Error during Data Source initialization', error));
