import 'reflect-metadata';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppDataSource } from './data-source';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserPassword,
    loginUser,
    getUserByToken,
    getCurrentUser
} from './controllers/UserController';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const authorizationMiddleWare = function (req: Request, res: Response, next: NextFunction) {
    try {
        getUserByToken(req);
    } catch (err) {
        const errorMessage = (err as Error).message || 'Unautorized';

        return res.status(401).json({ message: errorMessage });
    }

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
    app.get('/current-user', getCurrentUser);

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => console.log('Error during Data Source initialization', error));
