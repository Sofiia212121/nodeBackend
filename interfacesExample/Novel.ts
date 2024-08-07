import AbstractBook from "./AbstractBook";
import NovelInterface from "./NovelInterface";

export default class Novel extends AbstractBook implements NovelInterface {
    private readonly maxPagesForNovel = 100;

    public mainEvent: string;

    constructor(mainEvent: string, title: string, totalPages: number) {
        super(title, totalPages);
        this.validatePagesNumber(totalPages);
        this.mainEvent = mainEvent;
    }

    private validatePagesNumber(totalPages: number) {
        if (totalPages > this.maxPagesForNovel) {
            throw new Error('This novel has too many pages');
        }
    }
}
