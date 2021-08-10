import { React, useState, useEffect, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import {
  useGetReport,
  useDeleteMyStockQ,
  usePostMyStockQ,
} from "../queryhooks/index";
import { err, warningChange } from "../modules/messages";
import SwitchLabel from "../atoms/SwitchLabel";
import CustomizedSnackbars from "../atoms/CustomizedSnackbars";
import CircularIndeterminate from "../atoms/CircularIndeterminate";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    width: 850,
    marginLeft: 100,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//Qiitaの詳細表示ページ
const DetailQ = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const ls = location.state;

  //遷移パラメータを取得
  const id = ls?.id;
  const favorite = ls?.favorite;

  //指定idの記事を取得
  const { isLoading, isError, error, data } = useGetReport(id);

  //お気に入り情報更新用フック
  const deleteMyStockMutation = useDeleteMyStockQ();
  const postMyStockMutation = usePostMyStockQ();

  //お気に入り情報の状態管理
  const [stock, setStock] = useState(favorite);

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

  //html形式の本文を挿入
  useEffect(() => {
    if (!data) return;
    const elm1 = document.getElementById("mainText");
    elm1.innerHTML = data.body;
  }, [data]);

  //戻る処理
  const handleBack = useCallback(async () => {
    await _sleep(2000);
    history.push("/");
  }, [history]);

  //指定ページが存在しない場合は警告とする
  //ページが削除されている可能性を加味し、画面表示時にお気に入りの解除をする想定
  useEffect(() => {
    if (!isError) return;
    const message = error?.response.status === 404 ? warningChange : err;
    setSnackbar({
      open: true,
      severity: message === err ? "error" : "warning",
      message: message,
    });
    if (message === err) handleBack();
  }, [isError, error?.response.status, handleBack]);

  //戻るボタン押下時にお気に入り情報を更新する
  const handleUpdate = () => {
    //トグルボタンのON・OFFが変更された場合は更新処理を行う
    if (favorite !== stock) {
      if (stock) {
        const newStock = {
          id: id,
          title: data.title,
          tags: data.tags.map((e) => e.name),
        };
        postMyStockMutation.mutate(newStock);
      } else {
        deleteMyStockMutation.mutate(id);
      }
    }
    if (!ls) {
      history.goBack();
      return;
    }
    //パラメータを指定し、画面遷移する
    history.push(ls.backPath, {
      tabValue: 1,
      pageT: ls.pageT,
      pageQ: ls.pageQ,
      select: ls.select,
    });
  };

  return (
    <div>
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleClose}
        severity={snackbar.severity}
        message={snackbar.message}
      />
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2">
            Qiita
          </Typography>
          <SwitchLabel stock={stock} setStock={setStock} />
          <Typography variant="h5" component="h2">
            {data && data.title}
          </Typography>
        </CardContent>
      </Card>

      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography
            className={classes.pos}
            color="textSecondary"
            component="div"
          >
            <div id="mainText">{isLoading && <CircularIndeterminate />}</div>
          </Typography>
        </CardContent>
      </Card>
      <Typography
        className={classes.root}
        style={{ textAlign: "right", display: "inline-block" }}
        color="textSecondary"
      >
        <a href={data && data.url} target="_blank" rel="noreferrer">
          Website
        </a>
      </Typography>
      <Typography className={classes.root} color="textSecondary" gutterBottom>
        <Button
          type="button"
          onClick={handleUpdate}
          variant="contained"
          color="primary"
        >
          戻る
        </Button>
      </Typography>
    </div>
  );
};

export default DetailQ;
