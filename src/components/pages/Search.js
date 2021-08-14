import { React, useState, useEffect, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";

import {
  useGetMyTags,
  useGetQuestions,
  useGetReports,
} from "../queryhooks/index";

import CustomizedSnackbars from "../atoms/CustomizedSnackbars";
import CustomizedTable from "../molecules/CustomizedTable";
import GenericTemplate from "../molecules/GenericTemplate";

import { err, accessErr } from "../modules/messages";

const limit = 10;

const searchColumnsT = [
  { field: "id", headerName: "", width: 60 },
  { field: "title", headerName: "Title", width: 240 },
  { field: "tags", headerName: "Tags", width: 140 },
  { field: "count", headerName: "Answer", width: 100 },
  { field: "recordDate", headerName: "Modified", width: 120 },
];
const searchColumnsQ = [
  { field: "id", headerName: "", width: 60 },
  { field: "title", headerName: "Title", width: 240 },
  { field: "tags", headerName: "Tags", width: 140 },
  { field: "count", headerName: "LGTM", width: 100 },
  { field: "recordDate", headerName: "Modified", width: 120 },
];

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//全てのクエリがloading状態ではないことを確認する
const isReady = (obj) => {
  let ready =
    !obj ||
    obj.some(
      (e) => e.status !== "success" && e.error?.response.status !== 404
    ) ||
    obj.some((e) => e.status !== "success" && e.error?.response.status === 403)
      ? false
      : true;
  return ready;
};

//teratail API から取得したデータを整える(形式・重複の排除)
const makeDataT = (obj) => {
  const arr = obj?.filter((e) => e.status === "success");
  if (arr.length <= 1) return arr;
  const list = arr?.reduce((pre, current) => {
    pre.push(...current.data?.questions);
    return pre;
  }, []);
  const data = list.filter(
    (element, index, self) =>
      self.findIndex((e) => e.id === element.id) === index
  );
  return data;
};

//teratail API から取得したデータのページ数を計算する
//データ数が最大のTagのページ数に合わせる
const calcPageT = (obj) => {
  const page = obj.reduce((pre, current) => {
    return Math.max(pre + Math.ceil(current.data.meta.hit_num / limit));
  }, 0);
  return page;
};

//Qiita API から取得したデータを整える(形式・重複の排除)
const makeDataQ = (obj) => {
  const list = obj
    .filter((e) => e.status === "success")
    .reduce((pre, current) => {
      pre.push(...current.data);
      return pre;
    }, []);
  const data = list.filter(
    (element, index, self) =>
      self.findIndex((e) => e.id === element.id) === index
  );
  return data;
};

//テーブル表示用のマッピング(日付表示・項目選出・タグ表示)
const makeMapping = (data, type) => {
  const rows = data.map((e) => ({
    id: "" + e.id,
    title: e.title,
    tags: type === "t" ? e.tags.join(",") : e.tags.map((e) => e.name).join(","),
    count: type === "t" ? e.count_reply : e.likes_count,
    recordDate:
      type === "t" ? e.modified.split(" ")[0] : e.updated_at.split("T")[0],
  }));
  return rows;
};

//検索ページ
const Search = () => {
  const history = useHistory();
  const location = useLocation();
  //遷移パラメータの取得
  const ls = location.state;

  //teratailタブページの状態管理
  const [pageT, setPageT] = useState(ls ? ls.pageT : 1);
  //Qiitaタブページの状態管理
  const [pageQ, setPageQ] = useState(ls ? ls.pageQ : 1);

  //MyTag取得
  const { data: myTags } = useGetMyTags();

  //teratail APIより指定Tag・指定ページのデータを取得
  const QuestionsData = useGetQuestions(myTags, pageT);
  //Qiita APIより指定Tag・指定ページのデータを取得
  const ReportsData = useGetReports(myTags, pageQ);

  //Qiitaタブの全ページ数の状態管理
  const [allPagesQ, setAllPagesQ] = useState(100);
  //teratailタブの全ページ数の状態管理
  const [allPagesT, setAllPagesT] = useState(
    QuestionsData
      ? calcPageT(QuestionsData.filter((e) => e.status === "success"))
      : 1
  );

  //スナックバーの状態管理
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  //スナックバーを閉じる処理
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  //teratailタブの全ページ数の設定
  useEffect(() => {
    if (!QuestionsData) return;
    const newData = QuestionsData.filter((e) => e.status === "success");
    setAllPagesT(calcPageT(newData));
  }, [QuestionsData]);

  //戻る処理
  const handleHomeBack = useCallback(async () => {
    await _sleep(2000);
    history.push("/");
  }, [history]);

  //エラーの場合はホーム画面に遷移する
  useEffect(() => {
    if (
      QuestionsData.every(
        (e) => !e.isError || e.error?.response.status === 404
      ) &&
      ReportsData.every((e) => !e.isError || e.error?.response.status === 404)
    )
      return;
    if (
      QuestionsData.some(
        (e) => !e.isError && e.error?.response.status !== 403
      ) ||
      ReportsData.some((e) => !e.isError && e.error?.response.status !== 403)
    ) {
      setSnackbar({ open: true, severity: "error", message: accessErr });
    } else {
      setSnackbar({ open: true, severity: "error", message: err });
    }
    handleHomeBack();
  }, [QuestionsData, ReportsData, handleHomeBack]);

  return (
    <GenericTemplate title="検索">
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleClose}
        severity={snackbar.severity}
        message={snackbar.message}
      />
      <br />
      <div id="result">
        <CustomizedTable
          columnsT={searchColumnsT}
          columnsQ={searchColumnsQ}
          valuesT={
            isReady(QuestionsData)
              ? [...makeMapping(makeDataT(QuestionsData), "t")]
              : [false]
          }
          valuesQ={
            isReady(ReportsData)
              ? [...makeMapping(makeDataQ(ReportsData), "q")]
              : [false]
          }
          allPagesT={allPagesT}
          allPagesQ={allPagesQ}
          pageT={pageT}
          pageQ={pageQ}
          setPageT={setPageT}
          setPageQ={setPageQ}
          paramTabValue={ls ? ls.tabValue : 0}
          paramSelect={ls ? ls.select : []}
          isStock={false}
        />
      </div>
    </GenericTemplate>
  );
};

export default Search;
