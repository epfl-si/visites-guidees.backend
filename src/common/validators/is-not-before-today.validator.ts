import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotBeforeToday(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotBeforeToday',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;

          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);

          return new Date(value) >= today;
        },
        defaultMessage() {
          return `${propertyName} must not be before today`;
        },
      },
    });
  };
}
