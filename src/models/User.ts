import UserPayload from '../Types/UserPayload'
import UserRequest from '../Requests/UserRequest'
import UserData from '../Types/UserData'

export default class User {
    private _id: number;
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _phone: string;
    private _password: string;

    constructor(id: number,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        password: string
    ) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._phone = phone;
        this._password = password;
    }

    public get id(): number {
        return this._id;
    }

    public get firstName(): string {
        return this._firstName;
    }

    public set firstName(firstName: string) {
        this._firstName = firstName;
    }

    public get lastName(): string {
        return this._lastName;
    }

    public set lastName(lastName: string) {
        this._lastName = lastName;
    }

    public get email(): string {
        return this._email;
    }

    public set email(email: string) {
        this._email = email;
    }

    public get phone(): string {
        return this._phone;
    }

    public set phone(phone: string) {
        this._phone = phone;
    }

    public get password(): string {
        return this._password;
    }

    public set password(password: string) {
        this._password = password;
    }

    public toJSON() {
        return {
            id: this.id,
            firstName: this._firstName,
            lastName: this._lastName,
            email: this._email,
            phone: this._phone
        }
    }

    public static createFromRequest(id: number, requestData: UserRequest): User {
        const userData: UserPayload = requestData.toJSON();
        
        return new User (
            id,
            userData.first_name,
            userData.last_name,
            userData.email,
            userData.phone,
            userData.password
        );
    }

    public static createFromRawData(data: UserData): User {
        return new User (
            data.id,
            data.first_name,
            data.last_name,
            data.email,
            data.phone,
            data.password
        );
    }

    public static createFromRawDataArray(userDataItems: UserData[]) {
        return userDataItems.map(userData => this.createFromRawData(userData));
    }
}
