<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="赛事ID：" prop="matchId">
          <el-input v-model="queryParams.matchId" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="队名：" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="赛事类别" prop="sportsId">
          <el-select
            v-model="queryParams.sportId"
            class="!w-[240px]"
            placeholder="赛事类别"
            filterable
            clearable
          >
            <el-option
              v-for="item in sportIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开赛时间" prop="dateTime">
          <div class="block">
            <el-date-picker
              v-model="queryParams.dateTime"
              type="datetimerange"
              :editable="false"
              class="!w-[320px]"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="截止时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="getTableData()">搜索</el-button>
          <el-button icon="refresh" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row
        row-key="id"
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren',
        }"
      >
        <el-table-column label="赛事ID" align="left" width="150" prop="matchId" />
        <el-table-column label="开赛时间" align="left" width="150" prop="startEventDate" />
        <el-table-column label="赛事类别" align="left" width="150" prop="sportName" />
        <el-table-column label="主队名" align="left" width="200" prop="home" />
        <el-table-column label="客队名" align="left" width="200" prop="away" />
        <el-table-column label="普通清流地址" align="left" width="200" prop="sd">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span
                v-if="scope.row.sd.flv !== ''"
                clss="urlText"
                style="margin-left: 10px; color: blue; cursor: pointer"
                @click="copyUrl(scope, 0)"
              >
                FLV
              </span>
              <span
                v-if="scope.row.sd.mu38 !== ''"
                clss="urlText"
                style="margin-left: 10px; color: blue; cursor: pointer"
                @click="copyUrl(scope, 1)"
              >
                M3U8
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="中文高清地址" align="left" width="200" prop="hdZh">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span
                v-if="scope.row.hdZh.flv !== ''"
                clss="urlText"
                style="margin-left: 10px; color: blue; cursor: pointer"
                @click="copyUrl(scope, 2)"
              >
                FLV
              </span>
              <span
                v-if="scope.row.hdZh.mu38 !== ''"
                clss="urlText"
                style="margin-left: 10px; color: blue; cursor: pointer"
                @click="copyUrl(scope, 3)"
              >
                M3U8
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="英文高清地址" align="left" width="200" prop="hdEn">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span
                v-if="scope.row.hdEn.flv !== ''"
                clss="urlText"
                style="margin-left: 10px; color: blue; cursor: pointer"
                @click="copyUrl(scope, 4)"
              >
                FLV
              </span>
              <span
                v-if="scope.row.hdEn.mu38 !== ''"
                clss="urlText"
                style="margin-left: 10px; color: blue; cursor: pointer"
                @click="copyUrl(scope, 5)"
              >
                M3U8
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="totalItem && totalItem > 0"
        v-model:total="totalItem"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { type AxiosResponse } from "axios"; // 导入axios的相关类型
import useClipboard from "vue-clipboard3"; // 复制页面上的文本API，使用第三方库，避免了兼容性问题

import {
  LeisuVideoForm,
  TableRowDataType,
  GetSportsNameListParamsType,
  SportsNameListItemType,
  scopeType,
} from "@/views/videosource/leisuVideoSourceType"; // 批量导入类型
import LeisuVideoAPI from "@/api/videoSourceManagement/leisuVideo"; // 批量导入接口
import { getDateTime } from "@/utils/commonMethods";

// 定义该组件
defineOptions({
  name: "LeisuVideo",
  inheritAttrs: false,
});

// 解构出第三方库的复制文本的方法
const { toClipboard } = useClipboard();

// 转圈圈
const loading = ref(false);
// 控制复制URL成功后的弹窗
// const showSuccess = ref(false);
// 记录有多少条数据返回
const totalItem = ref<number | null>(null);
// 保存table数据
const tableData = ref<TableRowDataType[]>();

// 获取赛事类别下拉列表的参数对象
const sportIdListParams = reactive<GetSportsNameListParamsType>({
  pageNum: 1,
  pageSize: 10,
  dictCode: "match_type",
});

// 赛事类别下拉列表的数据初始化
const sportIdList = ref<SportsNameListItemType[]>();

// 定义日期时间下拉框数据--同时也设置它的默认起止日期时间：从此时此刻到24小时之后的这个时间段
const dateTime = ref<[string, string]>([getDateTime(0), getDateTime(1)]);

// 表格查表参数(筛选条件)对象--初始化
const queryParams = reactive<LeisuVideoForm>({
  pageNum: 1,
  pageSize: 10,
  matchId: undefined,
  name: "",
  sportId: undefined,
  dateTime: dateTime.value,
});

/**
 * 调接口前，参数处理
 * @param params
 */
function handleParams(params: LeisuVideoForm): LeisuVideoForm {
  Object.keys(params).forEach((key) => {
    if (key === "dateTime") {
      // 后端不要这个属性
      Reflect.deleteProperty(params, key);
    }
    if (typeof params[key] === "object" && params[key] !== null) {
      handleParams(params[key]); // 递归处理嵌套对象
    } else if (params[key] === null || params[key] === undefined || params[key] === "") {
      // 如果属性值为null/undefined/空字符串，则删除
      Reflect.deleteProperty(params, key);
    }
  });
  return params;
}

/**
 * 重置按钮
 * @param null
 */
function reset() {
  const newObj = {
    pageNum: 1,
    pageSize: 10,
    matchId: null,
    name: "",
    sportId: "",
    dateTime: dateTime.value,
    totalItem: null,
  };
  Object.assign(queryParams, newObj);
}

/**
 * 获取赛事类别下拉列表数据
 * @param params
 */
function getSportIdList(sportIdListParams: GetSportsNameListParamsType) {
  LeisuVideoAPI.getSportIdList(sportIdListParams)
    .then((res: AxiosResponse<SportsNameListItemType>) => {
      const { list } = res;
      sportIdList.value = list;
    })
    .catch((error: Error) => {
      console.log(error);
    })
    .finally();
}

/**
 * 调接口，获取TABLE数据
 * @param null
 */
function getTableData(): number | null {
  const pageNum = queryParams.pageNum;
  const pageSize = queryParams.pageSize;
  const matchId = queryParams.matchId;
  const name = queryParams.name;
  const sportId = queryParams.sportId && Number(queryParams.sportId); // 后端那边要number类型的参数，但是他给我传回来的时候是字符串，所有这里要做一下处理
  const eventDateStart = (queryParams.dateTime && queryParams.dateTime[0]) || "";
  const eventDateEnd = (queryParams.dateTime && queryParams.dateTime[1]) || "";
  const obj = {
    ...queryParams,
    pageSize,
    pageNum,
    matchId,
    name,
    sportId,
    eventDateStart,
    eventDateEnd,
  };
  let params = handleParams(obj);
  LeisuVideoAPI.getTableData(params)
    .then((res: AxiosResponse<TableRowDataType>) => {
      const { list, total } = res;
      tableData.value = list;
      total && (totalItem.value = total);
    })
    .catch((error: Error) => {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
  return totalItem.value;
}

const copyUrl = async (scope: scopeType, key: number) => {
  let copyUrlText: string;
  async function whichUrl(scope: scopeType) {
    try {
      let arr = [
        scope.row.sd.flv,
        scope.row.sd.mu38,
        scope.row.hdZh.flv,
        scope.row.hdZh.mu38,
        scope.row.hdEn.flv,
        scope.row.hdEn.mu38,
      ];
      copyUrlText = arr[key];
      await toClipboard(copyUrlText);
      ElMessage.success("复制成功");
      // 复制成功
    } catch (error: unknown) {
      ElMessage.error("复制失败");
      console.log(error);
    }
  }
  switch (key) {
    case 0:
      whichUrl(scope);
      break;
    case 1:
      whichUrl(scope);
      break;
    case 2:
      whichUrl(scope);
      break;
    case 3:
      whichUrl(scope);
      break;
    case 4:
      whichUrl(scope);
      break;
    case 5:
      whichUrl(scope);
      break;
    default:
      alert("没有可复制的内容");
  }
};

/**
 * 分页查询
 * @param null
 */
const handleQuery = () => {
  loading.value = true;
  const total: number | null = getTableData();
  totalItem.value = total;
};

onMounted(() => {
  getSportIdList(sportIdListParams); // 挂载页面时获取赛事类别下拉列表的数据
  getTableData(); // 挂载页面时获取TABLE的数据
});
</script>

<style lang="scss" scoped>
// @use "@/styles/variables" as *; 在vite.config.ts文件里边已经全局注入了，这里不需要再引入了
.app-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .filterCondition-parent {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #fff;
    .filterCondition-left {
      display: flex;
      justify-content: flex-start;
      margin: 0 1%;
      .flexItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 2%;
        font-size: 16px;
        span {
          white-space: nowrap;
        }
        .el-select {
          min-width: 120px;
        }
      }
    }
    .filterCondition-middle {
      display: flex;
      justify-content: space-between;
      margin: 0 0;
      .flexItem {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        span {
          display: flex;
          align-items: center;
          white-space: nowrap;
        }
        .el-select {
          min-width: 80%;
        }
      }
      :deep(.el-input__wrapper) {
        width: 300px !important;
      }
    }
    .filterCondition-right {
      display: flex;
      justify-content: space-between;
      margin: 0 1%;
      .flexItem {
        display: flex;
        justify-content: space-between;
        margin: 0 5px;
        font-size: 16px;
        button {
          min-width: 65px;
          padding: 10% 15%;
          font-size: 16px;
          cursor: pointer;
          border-radius: 15%;
        }
      }
      :nth-child(1) button {
        color: #fff;
      }
    }
  }

  :deep(.el-table__row) {
    .el-table_1_column_6,
    .el-table_1_column_7,
    .el-table_1_column_8 {
      @extend %base-style;
    }
  }

  .success-message {
    position: absolute;
    top: 40%;
    left: 60%;
    z-index: 9999;
    width: 10%;
    text-align: center;
    background: green;
  }
}
</style>
