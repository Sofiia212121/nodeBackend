import ModelJSON from "./ModelJSON";

class UserJSON extends ModelJSON {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    constructor(id: number, firstName: string, lastName: string, email: string, phone: string) {
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
    }
}

export default UserJSON;
