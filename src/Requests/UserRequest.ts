import { Request } from 'express'
import UserPayload from '../Types/UserPayload'

export default class UserRequest {
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _phone: string;
    private _password: string;

    constructor(request: Request) {
        this._firstName = request.body.first_name || '';
        this._lastName = request.body.first_name || '';
        this._email = request.body.first_name || '';
        this._phone = request.body.first_name || '';
        this._password = request.body.first_name || '';
    }

    public toJSON(): UserPayload {
        return {
            first_name: this._firstName,
            last_name: this._lastName,
            email: this._email,
            phone: this._phone,
            password: this._password
        }
    }
}
