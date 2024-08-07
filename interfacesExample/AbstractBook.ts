import BookInterface from "./BookInterface";

export default abstract class AbstractBook implements BookInterface {
    public title: string;
    public totalPages: number;
    private currentPage: number = 1;
    protected contentPages: string[] = [];

    constructor(title: string, totalPages: number) {
        this.title = title;
        this.totalPages = totalPages;
    }

    public openPage(page: number): string {
        this.currentPage = page;
        return this.contentPages[page - 1];
    }

    public remainingPages(): number {
        return this.totalPages - this.currentPage;
    }
}
