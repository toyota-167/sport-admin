/**
 * 集中定义变量类型--雷速视频源页面
 */

// 万能类型
export interface GeneralType {
  [key: string]: any;
}

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

/** 查询table时的传参对象 */
export interface LeisuVideoForm {
  /** 当前页 */
  pageNum: number;
  /** 每页大小 */
  pageSize: number;
  /** 赛事id */
  matchId?: number | null;
  /** 赛事类型 */
  sportId?: number | string;
  /** 队名 */
  name?: string;
  /** 字典编码 */
  dictCode?: string;
  /** 赛事开始时间 */
  eventDateStart?: string;
  /** 赛事结束时间 */
  eventDateEnd?: string;
  /** 开赛时间 */
  dateTime?: Array<string>;
  // [key: string]: number | string | boolean | symbol | Array<string | boolean | number> | object | undefined | null | never | void | {} | unknown; // 涵盖所有可能的值类型
  [key: string]: any; // 涵盖所有可能的值类型
}

export interface scopeType {
  $index: number;
  cellIndex: number;
  column: number;
  expanded: boolean;
  row: any;
  store: object;
  _self: object;
}

export interface SportsNameListItemType {
  dictCode: string;
  id: string;
  label: string;
  sort: number;
  status: number;
  value: string;
}

export interface Options {
  /** Fixes IE by appending element to body. Defaults to true. */
  appendToBody: boolean;
}
