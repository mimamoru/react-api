import axios from "axios";
const apiPath1 = "/api/v1";
const apiPath2 = "/api/v2";
const myTagsPath = "http://localhost:3001/mytags";
const myStockTPath = "http://localhost:3001/mystockT";
const myStockQPath = "http://localhost:3001/mystockQ";

const token1 = "5fa6a260ae7b12113eecefa37ac32a972bedc288";
const token2 = "e24cb72ab96bb0f5f108a610650321e9ded13989";

//axios.defaults.withCredentials = true;

//タグ一覧を取得(teratail API)
export const getTagsData = async (page = 1) => {
  const { data } = await axios.get(`${apiPath1}/tags?limit=20&page=${page}`, {
    headers: {
      Authorization: `Bearer ${token1}`,
    },
  });
  return data;
};

//指定タグを取得(teratail API)
export const getTagData = async (tag_name) => {
  const { data } = await axios.get(`${apiPath1}/tags/${tag_name}`, {
    headers: {
      Authorization: `Bearer ${token1}`,
    },
  });
  return data;
};

//指定タグの質問を取得(teratail API)
export const getQuestionsByTag = async (tag_name, page = 1) => {
  const { data } = await axios.get(
    `${apiPath1}/tags/${tag_name}/questions?limit=10&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token1}`,
      },
    }
  );
  return data;
};

//指定idの質問詳細とその回答を取得(teratail API)
export const getQuestionById = async (question_id) => {
  const { data } = await axios.get(`${apiPath1}/questions/${question_id}`, {
    headers: {
      Authorization: `Bearer ${token1}`,
    },
  });
  return data;
};

//指定タグの記事を取得(Qiita API)
//総数がレスポンスヘッダに格納されているらしいが、取得方法が分からない
export const getReportsByTag = async (tag_name, page = 1) => {
  // let totalCount;
  const { data } = await axios.get(
    `${apiPath2}/tags/${tag_name}/items?page=${page}&per_page=10`,
    {
      headers: {
        Authorization: `Bearer ${token2}`,
      },
    }
  );
  //   .then(response => {
  //     totalCount = response.headers['Total-Count'];
  // });
  return data;
};

//指定idの記事を取得(Qiita API)
export const getReportById = async (itemId) => {
  const { data } = await axios.get(`${apiPath2}/items/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token2}`,
    },
  });
  return data;
};

//url取得
export const getUrl = (type) => {
  switch (type) {
    case "myTags":
      return myTagsPath;
    case "myStoskT":
      return myStockTPath;
    case "myStoskQ":
      return myStockQPath;
    default:
      return "";
  }
};

//ローカルサーバーから値を取得する
export const getData = async (type, id = "") => {
  const url = getUrl(type);
  const path = id === "" ? url : `${url}/${id}`;
  const { data } = await axios.get(path);
  return data;
};

//ローカルサーバーからページ指定で値を取得する
export const getPageData = async (type, page = 1) => {
  const url = getUrl(type);
  const path = `${url}?_page=${page}&_limit=10`;
  const { data } = await axios.get(path);
  return data;
};

//ローカルサーバーに値を登録する
export const postData = async (type = "", data = {}) => {
  const path = getUrl(type);
  data.recordDate = getCurrentDate();
  await axios.post(path, data);
};

//ローカルサーバーの値を削除する
export const deleteData = async (type = "", id = "") => {
  const path = getUrl(type);
  await axios.delete(`${path}/${id}`);
};

//整合性チェック
export const currentVersionCheck = async (type, recordDate, length) => {
  let result;
  await getData(type).then((res) => {
    result = res;
  });
  if (!result) return "";
  if (result.length === 0 && length === 0) {
    return "ok";
  } else if (result.length !== length) {
    return "changed";
  }
  const maxRecordDate = result.reduce((acc, value) =>
    acc.recordDate > value.recordDate ? acc.recordDate : value.recordDate
  );
  if (maxRecordDate > recordDate) return "changed";
  return "ok";
};

//差分
export const findDiff = (olds, nexts) => ({
  adds: nexts.filter((e) => !olds.includes(e)),
  subs: olds.filter((e) => !nexts.includes(e)),
});

//現在日時取得
let now = new Date();
export const getCurrentDate = () => {
  const Year = now.getFullYear();
  const Month = now.getMonth() + 1;
  const Date = now.getDate();
  const Hour = now.getHours();
  const Min = now.getMinutes();
  const Sec = now.getSeconds();
  return Year + "-" + Month + "-" + Date + " " + Hour + ":" + Min + ":" + Sec;
};
