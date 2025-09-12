import { ValueTransformer } from 'typeorm';

// Generic enum transformer for SQLite compatibility
export function createEnumTransformer<T extends Record<string, string | number>>(enumObject: T): ValueTransformer {
  return {
    to: (value: T[keyof T]) => value as string,
    from: (value: string) => value as T[keyof T],
  };
}

// Specific transformers for the enums used in the application
export const socialProviderTransformer = createEnumTransformer({
  KAKAO: 'KAKAO',
  NAVER: 'NAVER',
  APPLE: 'APPLE',
});

export const genderTransformer = createEnumTransformer({
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  NONE: 'NONE',
});

export const userStatusTransformer = createEnumTransformer({
  INCOMPLETE: 'INCOMPLETE',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  WITHDRAWN: 'WITHDRAWN',
});
