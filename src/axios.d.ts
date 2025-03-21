/**
 * 该文件是全局定义axios的相关类型
 */

declare module "axios" {
  // 调接口时返回的数据类型
  interface AxiosResponse<T = any> {
    list?: T[];
    total?: number;
    [key: string]: any;
  }
  interface InternalAxiosRequestConfig<T = any> {
    [key: string]: any;
  }
  interface AxiosInstance {
    [key: string]: any;
  }

  interface AxiosRequestConfig {
    [key: string]: any;
  }
  interface AxiosError {
    [key: string]: any;
  }

  export function create(arg0: {
    baseURL: string;
    timeout: number;
    headers: { "Content-Type": string };
    paramsSerializer: (params: GeneralType) => string;
  }) {
    throw new Error("Function not implemented.");
  }
}
