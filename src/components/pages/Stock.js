import { React, useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useGetMyStockT, useGetMyStockQ } from "../queryhooks/index";
import CustomizedSnackbars from "../atoms/CustomizedSnackbars";
import CustomizedTable from "../molecules/CustomizedTable";
import GenericTemplate from "../molecules/GenericTemplate";
import { err } from "../modules/messages";

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const stockColumns = [
  { field: "id", headerName: "", width: 60 },
  { field: "title", headerName: "Title", width: 200 },
  { field: "tags", headerName: "Tags", width: 140 },
  { field: "recordDate", headerName: "Registration", width: 150 },
];

//テーブル表示用のマッピング(日付表示・項目選出・タグ表示)
const makeMapping = (data) => {
  const rows = data.map((e) => ({
    id: e.id,
    title: e.title,
    tags: e.tags.join(","),
    recordDate: e.recordDate.split(" ")[0],
  }));
  return rows;
};

//お気に入りページ
const Stock = () => {
  const history = useHistory();
  const location = useLocation();
  //遷移パラメータの取得
  const ls = location.state;

  //teratailタブページの状態管理
  const [pageT, setPageT] = useState(ls ? ls.pageT : 1);
  //Qiitaタブページの状態管理
  const [pageQ, setPageQ] = useState(ls ? ls.pageQ : 1);

  //お気に入りデータを取得
  const { isError: stockTerr, data: stockT } = useGetMyStockT(pageT);
  const { isError: stockQerr, data: stockQ } = useGetMyStockQ(pageQ);

  //お気に入りデータの状態管理
  const [dataT, setDataT] = useState(stockT ? makeMapping(stockT) : [false]);
  const [dataQ, setDataQ] = useState(stockQ ? makeMapping(stockQ) : [false]);

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

  //戻る処理
  const handleHomeBack = useCallback(async () => {
    await _sleep(2000);
    history.push("/");
  }, [history]);

  //エラー発生時はホーム画面に遷移する
  useEffect(() => {
    if (!stockTerr && !stockQerr) return;
    setSnackbar({ open: true, severity: "error", message: err });
    handleHomeBack();
  }, [stockTerr, stockQerr, handleHomeBack]);

  //お気に入りデータの設定
  useEffect(() => {
    if (!stockT) return;
    setDataT([...makeMapping(stockT)]);
  }, [stockT]);

  useEffect(() => {
    if (!stockQ) return;
    setDataQ([...makeMapping(stockQ)]);
  }, [stockQ]);

  return (
    <GenericTemplate title="お気に入り">
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleClose}
        severity={snackbar.severity}
        message={snackbar.message}
      />
      <br />
      <CustomizedTable
        columnsT={stockColumns}
        columnsQ={stockColumns}
        valuesT={dataT}
        valuesQ={dataQ}
        pageT={pageT}
        pageQ={pageQ}
        setPageT={setPageT}
        setPageQ={setPageQ}
        paramTabValue={ls ? ls.tabValue : 0}
        paramSelect={ls ? ls.select : []}
        isStock={true}
      />
    </GenericTemplate>
  );
};

export default Stock;
