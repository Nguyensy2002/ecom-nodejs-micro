import { IRepository } from "../../../share/interface";
import { PagingDTO } from "../../../share/models/paging";
import { UserCondDTO, UserUpdateDTO } from "../model/dto";
import { Role, User, UserLoginDTO, UserRegistrationDTO } from "../model/user";

export interface IUserUseCase {
  createAnewUser(data: User): Promise<string>;
  getDetailtUser(id: string): Promise<User | null>;
  listUser(cond: UserCondDTO, paging: PagingDTO): Promise<Array<User>>;
  updateUser(id: string, data: UserUpdateDTO): Promise<boolean>;
  deleteUser(id: string): Promise<boolean>;
  //hàm login và xác thực
  login(data: UserLoginDTO): Promise<string>;
  register(data: UserRegistrationDTO): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
  //lấy ra thông tin user
  profile(userId: string): Promise<User>;
}
//interface auth
export interface TokenPayload {
  sub: string;
  role: Role;
}
//interface để biết ai là người thực hiện request này
export interface Requester extends TokenPayload {}
//interface để hiển thị ra token và để verify token
export interface ITokenProvider {
  genarateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;
}
//Authorization
export type UserToken = {
  accessToken: string;
  refreshToken: string;
};
//
export type TokenIntrospectResult = {
  payload: TokenPayload | null;
  error?: Error;
  isOk: boolean;
};
//interface trả về thông tin trong token
export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>;
}
