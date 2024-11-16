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
import { Gender, Role, Status } from "./user";

export const UserUpdateDTOSchema = z.object({
  avatar: z.string().nullable().optional(),
  firtName: z.string().min(2, ErrFirstNameAtLeast2Chars).optional(),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars).optional(),
  email: z.string().email(ErrEmailInvalid).optional(),
  passwork: z.string().min(6, ErrPassworkAtLeast6Chars).optional(),
  salt: z.string().min(8).optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  birthday: z
    .date({ invalid_type_error: ErrBirthdayInvalid.message })
    .nullable()
    .optional(),
  gender: z.nativeEnum(Gender, ErrGenderInvalid).optional(),
  role: z.nativeEnum(Role, ErrRoleInvalid).optional(),
  status: z.nativeEnum(Status).optional(),
});
export type UserUpdateDTO = z.infer<typeof UserUpdateDTOSchema>;

//Create user
export const UserCondDTOSchema = z.object({
  firtName: z.string().min(2, ErrFirstNameAtLeast2Chars).optional(),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars).optional(),
  email: z.string().email(ErrEmailInvalid).optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  gender: z.nativeEnum(Gender, ErrGenderInvalid).optional(),
  role: z.nativeEnum(Role, ErrRoleInvalid).optional(),
  status: z.nativeEnum(Status).optional(),
});
export type UserCondDTO = z.infer<typeof UserCondDTOSchema>;
