import ModelJSON from "./ModelJSON";

type UserJSON = ModelJSON & {
    firstName: string,
    lastName: string,
    email: string,
    phone: string
}

export default UserJSON;