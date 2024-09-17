import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'first_name' })
    firstName!: string;

    @Column({ name: 'last_name' })
    lastName!: string;

    @Column({ name: 'email', unique: true })
    email!: string;

    @Column({ name: 'phone', unique: true })
    phone!: string;

    @Exclude()
    @Column({ name: 'password' })
    password!: string;
}
