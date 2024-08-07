import UserPayload from "./UserPayload";

class UserData extends UserPayload {
    id: number;

    constructor(id: number, firstName: string, lastName: string, email: string, phone: string, password: string) {
        super(firstName, lastName, email, phone, password);
        this.id = id;
    }
}

export default UserData;
