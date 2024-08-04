export default abstract class AbstractModel {
    public abstract toJSON(): any;

    public static getTable(): string {
        throw new Error("Method must be realized");
    }
}
