import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserRequest } from '../requests/CreateUserRequest';
import { UpdateUserRequest } from '../requests/UpdateUserRequest';
import { validate } from 'class-validator';
import { plainToClass, instanceToPlain } from 'class-transformer';

const userService = new UserService();

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(instanceToPlain(users));
};

export const getUserById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const user = await userService.getUserById(id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(instanceToPlain(user));
};

export const createUser = async (req: Request, res: Response) => {
    const createUserRequest = plainToClass(CreateUserRequest, req.body);
    const errors = await validate(createUserRequest);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const newUser = await userService.createUser(createUserRequest);
    res.json(instanceToPlain(newUser));
};

export const updateUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const updateUserRequest = plainToClass(UpdateUserRequest, { ...req.body, id });

    const errors = await validate(updateUserRequest);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const updatedUser = await userService.updateUser(id, updateUserRequest);

    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(instanceToPlain(updatedUser));
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const success = await userService.deleteUser(id);

    if (!success) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(204).send();
};
