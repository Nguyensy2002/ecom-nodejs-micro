import { z } from "zod";
import {
  ErrBirthdayInvalid,
  ErrEmailInvalid,
  ErrFirstNameAtLeast2Chars,
  ErrGenderInvalid,
  ErrLastNameAtLeast2Chars,
  ErrPassworkAtLeast6Chars,
  ErrRoleInvalid,
} from "./error";

export enum Gender {
  MALE = "male",
  FEMALEE = "female",
  UNKNOWN = "unknown",
}
export enum Role {
  USER = "user",
  ADMIN = "admin",
}
export enum Status {
  ACTIVE = "active",
  PENDING = "pending",
  INACTIVE = "inactive",
  BANNED = "banned",
  DELETED = "deleted",
}

//validate
export const userSchema = z.object({
  id: z.string().uuid(),
  avatar: z.string().nullable().optional(),
  firtName: z.string().min(2, ErrFirstNameAtLeast2Chars),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars),
  email: z.string().email(ErrEmailInvalid),
  password: z.string().min(6, ErrPassworkAtLeast6Chars),
  salt: z.string().min(8),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  birthday: z
    .date({ invalid_type_error: ErrBirthdayInvalid.message })
    .nullable()
    .optional(),
  gender: z.nativeEnum(Gender, ErrGenderInvalid),
  role: z.nativeEnum(Role, ErrRoleInvalid),
  status: z.nativeEnum(Status).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof userSchema>;
//register
export const UserRegistrationDTOSchema = userSchema.pick({
  firtName: true,
  lastName: true,
  email: true,
  password: true,
});
export type UserRegistrationDTO = z.infer<typeof UserRegistrationDTOSchema>;
//login
export const UserLoginDTOSchema = userSchema.pick({
  email: true,
  password: true,
});
export type UserLoginDTO = z.infer<typeof UserLoginDTOSchema>;
