import axios from "axios";
import {
  ITokenIntrospect,
  TokenIntrospectResult,
} from "../../modules/user/interface";

//file gọi api lấy ra token để verify trả về thông tin người dùng trong token
export class TokenIntrospectRPCClient implements ITokenIntrospect {
  constructor(private readonly url: string) {}
  async introspect(token: string): Promise<TokenIntrospectResult> {
    try {
      const { data } = await axios.post(`${this.url}`, { token });
      const { sub, role } = data.data;
      return {
        payload: { sub, role },
        isOk: true,
      };
    } catch (error) {
      return {
        payload: null,
        error: error as Error,
        isOk: false,
      };
    }
  }
}
