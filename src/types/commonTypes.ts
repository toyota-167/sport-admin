// 集中定义变量类型
export interface UrlType {
  flv: string;
  mu38: string;
}
export interface TableRowDataType {
  id: number;
  home: string;
  away: string;
  matchId: string;
  sportName: string;
  sportId: number;
  startEventDate: string;
  sd: UrlType;
  hdZh: UrlType;
  hdEn: UrlType;
}

// 请求赛事类别下拉列表时的参数类型
export interface GetSportsNameListParamsType {
  pageNum: number;
  pageSize: number;
  dictCode: string;
}

// 万能类型
export interface GeneralType {
  path?: string;
  fileName?: string;
  content?: string;
  [key: string]: any;
}
