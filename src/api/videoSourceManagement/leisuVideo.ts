import request from "@/utils/request"; // 导入axios实例
import {
  LeisuVideoForm,
  GetSportsNameListParamsType,
} from "@/views/videosource/leisuVideoSourceType"; // 批量导入类型

const ROLE_BASE_URL = "/api";

const LeisuVideoAPI = {
  /** 获取视频源数据 */
  getTableData(params: LeisuVideoForm) {
    return request({
      url: `${ROLE_BASE_URL}/video/leisu/getVideoLeisuPage`,
      method: "post",
      data: params,
    });
  },

  /** 获取赛事类别下拉列表数据 */
  getSportIdList(queryParams: GetSportsNameListParamsType) {
    return request({
      url: `${ROLE_BASE_URL}/v1/dict-data/page`,
      method: "get",
      params: queryParams,
    });
  },
};

export default LeisuVideoAPI; // 向外暴露所有接口
