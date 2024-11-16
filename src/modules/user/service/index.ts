import { v7 } from "uuid";
import { IRepository } from "../../../share/interface";
import { PagingDTO } from "../../../share/models/paging";
import { IUserUseCase, TokenPayload } from "../interface";
import {
  UserCondDTO,
  UserCondDTOSchema,
  UserUpdateDTO,
  UserUpdateDTOSchema,
} from "../model/dto";
import {
  Gender,
  Role,
  Status,
  User,
  UserLoginDTO,
  UserLoginDTOSchema,
  UserRegistrationDTO,
  UserRegistrationDTOSchema,
} from "../model/user";
import { ErrDataNotFound } from "../../../share/models/base-errors";
import {
  ErrEmailExisted,
  ErrInvalidEmailAndPassword,
  ErrInvalidToken,
  ErrUserInactived,
} from "../model/error";
import bcrypt from "bcrypt";
import { jwtProvider } from "../../../share/component/jwt";
import { AppError } from "../../../share/utils/app-error";

export class UserService implements IUserUseCase {
  constructor(
    private readonly repository: IRepository<User, UserCondDTO, UserUpdateDTO>
  ) {}
  //lấy ra thông tin user
  async profile(userId: string): Promise<User> {
    const user = await this.repository.get(userId);
    if (!user) {
      throw ErrDataNotFound;
    }
    return user;
  }
  //verify token
  async verifyToken(token: string): Promise<TokenPayload> {
    const payload = await jwtProvider.verifyToken(token);
    if (!payload) {
      throw ErrInvalidToken;
    }
    const user = await this.repository.get(payload.sub);
    if (!user) {
      throw ErrDataNotFound;
    }
    if (
      user.status === Status.DELETED ||
      user.status === Status.INACTIVE ||
      user.status === Status.BANNED
    ) {
      throw ErrUserInactived;
    }
    return { sub: user.id, role: user.role };
  }
  //thêm mới người dùng
  async createAnewUser(data: UserRegistrationDTO): Promise<string> {
    return await this.register(data);
  }
  //lấy ra thông tin chi tiết người dùng
  async getDetailtUser(id: string): Promise<User | null> {
    const data = await this.repository.get(id);
    if (!data || data.status === Status.DELETED) {
      throw ErrDataNotFound;
    }
    return data;
  }
  async listUser(cond: UserCondDTO, paging: PagingDTO): Promise<Array<User>> {
    const parsedCound = UserCondDTOSchema.parse(cond);
    const result = await this.repository.list(parsedCound, paging);
    return result;
  }
  async updateUser(id: string, data: UserUpdateDTO): Promise<boolean> {
    const dto = UserUpdateDTOSchema.parse(data);
    const rusult = await this.repository.get(id);
    if (!rusult || rusult.status === Status.DELETED) {
      throw ErrDataNotFound;
    }
    await this.repository.update(id, dto);
    return true;
  }
  async deleteUser(id: string): Promise<boolean> {
    const data = await this.repository.get(id);
    if (!data || data.status === Status.DELETED) {
      throw ErrDataNotFound;
    }
    await this.repository.delete(id, false);
    return true;
  }
  async login(data: UserLoginDTO): Promise<string> {
    const dto = UserLoginDTOSchema.parse(data);
    // 1.check email tồn tại hay chưa
    const user = await this.repository.findByCond({ email: dto.email });
    if (!user) {
      throw AppError.from(ErrInvalidEmailAndPassword, 400).withLog(
        "Email not found"
      );
    }
    // 2.check password: compare lại password trong db xem có hợp lệ hay không
    const isMatch = await bcrypt.compare(
      `${dto.password}.${user.salt}`,
      user.password
    );
    if (!isMatch) {
      throw AppError.from(ErrInvalidEmailAndPassword, 400).withLog(
        "Password is incorrect"
      );
    }
    //check trạng thái email
    if (user.status === Status.DELETED || user.status === Status.INACTIVE) {
      throw AppError.from(ErrUserInactived, 400);
    }
    //3. return token
    const token = jwtProvider.genarateToken({
      sub: user.id,
      role: user.role,
    });
    return token;
  }
  async register(data: UserRegistrationDTO): Promise<string> {
    const dto = UserRegistrationDTOSchema.parse(data);
    //1. check email đã tồn tại hay chưa
    const checkEmail = await this.repository.findByCond({ email: dto.email });
    if (checkEmail) {
      throw ErrEmailExisted;
    }
    //2. gen salt and hash password
    // const salt = generateRandomString(16);
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(`${dto.password}.${salt}`, 10);
    //3. create user
    const newId = v7();
    const newUser: User = {
      ...dto,
      password: hashPassword,
      id: newId,
      status: Status.ACTIVE,
      gender: Gender.UNKNOWN,
      salt: salt,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.repository.insert(newUser);
    return newId;
  }
}
