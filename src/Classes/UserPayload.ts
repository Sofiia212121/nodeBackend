class UserPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;

    constructor(firstName: string, lastName: string, email: string, phone: string, password: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }
}

export default UserPayload;
