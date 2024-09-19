import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserPassword } from './controllers/UserController';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

AppDataSource.initialize().then(() => {
    console.log('Connected to the database');

    app.patch('/users/update-password/:id', updateUserPassword);
    app.get('/users', getAllUsers);
    app.get('/users/:id', getUserById);
    app.post('/users', createUser);
    app.patch('/users/:id', updateUser);
    app.delete('/users/:id', deleteUser);

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => console.log('Error during Data Source initialization', error));
