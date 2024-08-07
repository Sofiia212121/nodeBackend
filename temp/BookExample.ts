import AbstractBook from "../interfacesExample/AbstractBook";
import BookInterface from "../interfacesExample/BookInterface";
import Novel from "../interfacesExample/Novel";
import Science from "../interfacesExample/Science";

const animalFarm = new Novel('animal', 'animalFarm', 99);
const animalFarm2 = new Novel('animal2', 'animalFarm2', 5);

const scienceBook = new Science(['aaa', 'bbb', 'ccc'], 'qqq', 110);
const scienceBook2 = new Science(['aaa2', 'bbb2', 'ccc2'], 'qqq2', 222);

const arrayBooks: AbstractBook[] = [animalFarm, animalFarm2, scienceBook, scienceBook2];
const arrayBooks2: BookInterface[] = [animalFarm, animalFarm2, scienceBook, scienceBook2];

arrayBooks.map((book) => {
    book.openPage(3);
    console.log(book.remainingPages());
})

arrayBooks2.map((book) => {
    console.log(book.openPage(3));
})