import { Request, Response } from 'express';
import { CreateUserRequest } from '../requests/CreateUserRequest';
import { UpdateUserRequest } from '../requests/UpdateUserRequest';
import { UpdateUserPasswordRequest } from '../requests/UpdateUserPasswordRequest';
import { validate } from 'class-validator';
import { plainToClass, instanceToPlain } from 'class-transformer';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from "bcrypt";
import { LoginUserRequest } from '../requests/LoginUserRequest';

const userRepository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await userRepository.find();
    res.json(instanceToPlain(users));
};

export const getUserById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const user = await userRepository.findOne({ where: { id } });

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

    const newUser = userRepository.create({ ...createUserRequest });

    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    newUser.password = bcrypt.hashSync(newUser.password, salt);

    await userRepository.save(newUser);

    res.json(instanceToPlain(newUser));
};

export const updateUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const updateUserRequest = plainToClass(UpdateUserRequest, { ...req.body, id });

    const errors = await validate(updateUserRequest);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const updatedUser = await userRepository.findOne({ where: { id } });

    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(updatedUser, updateUserRequest);

    await userRepository.save(updatedUser);

    res.json(instanceToPlain(updatedUser));
};

export const updateUserPassword = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const updateUserPasswordRequest = plainToClass(UpdateUserPasswordRequest, { ...req.body });

    const errors = await validate(updateUserPasswordRequest);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!bcrypt.compareSync(updateUserPasswordRequest.password, user.password)) {
        return res.status(403).json({ message: 'Invalid old password' });
    }

    if (updateUserPasswordRequest.newPassword !== updateUserPasswordRequest.passwordConfirmation) {
        return res.status(400).json({ message: 'Invalid password confirmation' });
    }

    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    user.password = bcrypt.hashSync(updateUserPasswordRequest.newPassword, salt);

    await userRepository.save(user);

    res.json(instanceToPlain(user));
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const success = await userRepository.delete(id);

    if (success.affected === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(204).send();
};

export const loginUser = async (req: Request, res: Response) => {
    const loginUserRequest = plainToClass(LoginUserRequest, req.body);
    const errors = await validate(loginUserRequest);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const user = await userRepository.findOne({ where: { email: loginUserRequest.email } });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!bcrypt.compareSync(loginUserRequest.password, user.password)) {
        return res.status(403).json({ message: 'Invalid password' });
    }

    // generate access token

    return res.json(instanceToPlain(user));
}
