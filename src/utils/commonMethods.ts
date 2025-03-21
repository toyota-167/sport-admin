import useClipboard from "vue-clipboard3"; // 复制页面上的文本API，使用第三方库，避免了兼容性问题

// 定义某行的数据类型
interface scopeType {
  $index: number;
  cellIndex: number;
  column: number;
  expanded: boolean;
  row: any;
  store: object;
  _self: object;
}

// 解构出第三方库的复制文本的方法
const { toClipboard } = useClipboard();

/**
 * 点击复制指定单元格内容
 * @param scope 某行数据
 * @param key 某一行中第几个url
 */
export const copyUrl = async (scope: scopeType, key: number) => {
  let copyUrlText = "";
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
 * 获取当前年月日时分字符串
 * @param addDay  取值范围是0到正无穷的整数，意思是往后多少天
 */
export const getDateTime = (addDay: number) => {
  let formattedDateTime = "";
  // 获取当前时间
  const currentDate = new Date();
  // 提取年月日时分
  const year = currentDate.getFullYear(); // 年（四位数，如 2023）
  const month = currentDate.getMonth() + 1; // 月（0-11，需要 +1 修正为 1-12）
  const day = currentDate.getDate() + addDay; // 日（1-31）
  const hours = currentDate.getHours(); // 时（0-23）
  const minutes = currentDate.getMinutes(); // 分（0-59）

  // 格式化为字符串（例如：2023-10-05 14:30）
  formattedDateTime =
    `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ` +
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  return formattedDateTime;
};
