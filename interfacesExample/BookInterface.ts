export default interface BookInterface {
    title: string;
    totalPages: number;

    openPage(page: number): string;
}
