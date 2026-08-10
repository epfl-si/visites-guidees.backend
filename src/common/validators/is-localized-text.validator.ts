import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsLocalizedText(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLocalizedText',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown): boolean {
          return (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value) &&
            Object.values(value).every((v) => typeof v === 'string')
          );
        },
        defaultMessage() {
          return `${propertyName} must be an object of { [locale: string]: string }`;
        },
      },
    });
  };
}