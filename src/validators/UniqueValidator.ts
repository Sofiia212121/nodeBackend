import {
    ValidationOptions,
    registerDecorator,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { AppDataSource } from '../data-source';
import { Not } from 'typeorm';

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        const [entityClass, field] = args.constraints; // Извлекаем класс сущности и поле для проверки
        const repository = AppDataSource.getRepository(entityClass); // Получаем репозиторий для сущности

        // Извлекаем id текущего объекта, если он есть
        const currentId = (args.object as any).id;

        // Поиск записи в базе данных по полю и значению, исключая текущий объект по id
        const record = await repository.findOne({
            where: {
                [field]: value,
                ...(currentId ? { id: Not(currentId) } : {}), // Исключаем текущую запись, если передан id
            },
        });

        return !record; // Возвращаем true, если запись не найдена (значит, уникальна)
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be unique.`;
    }
}

// Декоратор для использования в классах
export function IsUnique(
    entity: Function, // Класс сущности
    field: string,    // Поле для проверки
    validationOptions?: ValidationOptions // Дополнительные опции валидации
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entity, field],
            validator: IsUniqueConstraint,
        });
    };
}
