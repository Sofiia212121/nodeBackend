import ModelJSON from "../Classes/ModelJSON";

export default abstract class AbstractModel {
    public abstract toJSON(): ModelJSON;

    public static getTable(): string {
        throw new Error("Method must be realized");
    }
}
