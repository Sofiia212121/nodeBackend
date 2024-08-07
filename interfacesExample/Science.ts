import AbstractBook from "./AbstractBook";

export default class Science extends AbstractBook {
    public keyWords: string[];

    constructor(keyWords: string[], title: string, totalPages: number) {
        super (title, totalPages);
        this.keyWords = keyWords;
    }
}
