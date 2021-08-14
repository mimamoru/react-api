import { React, useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import StarsRoundedIcon from "@material-ui/icons/StarsRounded";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { orange } from "@material-ui/core/colors";

import {
  useGetQuestion,
  useDeleteMyStockT,
  usePostMyStockT,
} from "../queryhooks/index";
import { err, accessErr, warningChange } from "../modules/messages";
import CircularIndeterminate from "../atoms/CircularIndeterminate";
import SwitchLabel from "../atoms/SwitchLabel";
import CustomizedSnackbars from "../atoms/CustomizedSnackbars";

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
  button: {
    textTransform: "none",
  },
});

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//teratailの詳細表示ページ
const DetailT = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const ls = location.state;

  //遷移パラメータを取得
  const questionId = ls?.id;
  const favorite = ls?.favorite;

  //指定idの質問を取得
  const { isLoading, isError, error, data } = useGetQuestion(questionId);

  //お気に入り情報更新用フック
  const deleteMyStockMutation = useDeleteMyStockT();
  const postMyStockMutation = usePostMyStockT();

  //お気に入り情報の状態管理
  const stockSwitchRef = useRef(null);

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
    elm1.innerHTML = data.question?.body;
    const answers = data.question.replies;
    if (!answers) return;
    for (let i = 0; i < answers.length; i++) {
      const elm2 = document.getElementById(`mainAnswer${i}`);
      elm2.innerHTML = answers[i].body;
    }
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
    const status = error?.response.status;
    const message =
      status === 400 || status === 404
        ? warningChange
        : status === 403
        ? accessErr
        : err;
    setSnackbar({
      open: true,
      severity: message === warningChange ? "warning" : "error",
      message: message,
    });
    if (message !== warningChange) handleBack();
  }, [isError, error?.response.status, handleBack]);

  //戻るボタン押下時にお気に入り情報を更新する
  const handleUpdate = () => {
    //トグルボタンのON・OFFが変更された場合は更新処理を行う
    const stock = stockSwitchRef.current.checked;
    if (favorite !== stock) {
      if (stock) {
        const newStock = {
          id: questionId,
          title: data.question.title,
          tags: data.question.tags,
        };
        postMyStockMutation.mutate(newStock);
      } else {
        deleteMyStockMutation.mutate(questionId);
      }
    }
    if (!ls) {
      history.goBack();
      return;
    }
    //パラメータを指定し、画面遷移する
    history.push(ls.backPath, {
      tabValue: 0,
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
            teratail
            <SwitchLabel favorite={favorite} ref={stockSwitchRef} />
          </Typography>

          <Typography variant="h5" component="h2">
            {data && data.question.title}
          </Typography>
        </CardContent>
      </Card>

      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography
            component="div"
            className={classes.pos}
            color="textSecondary"
          >
            <div id="mainText">{isLoading && <CircularIndeterminate />}</div>
          </Typography>
        </CardContent>
      </Card>

      {data &&
        data.question.replies &&
        data.question.replies?.map((e, idx) => (
          <Card
            key={`${data.question.id}_${idx}`}
            className={classes.root}
            variant="outlined"
          >
            {data && e.is_best_answer && (
              <StarsRoundedIcon style={{ color: orange[500], fontSize: 50 }} />
            )}
            <CardContent>
              <Typography
                className={classes.pos}
                color="textSecondary"
                component="div"
              >
                <div id={`mainAnswer${idx}`}></div>
              </Typography>
            </CardContent>
          </Card>
        ))}
      <br />
      <Typography className={classes.root} color="textSecondary">
        <Button
          type="button"
          onClick={handleUpdate}
          variant="contained"
          color="primary"
        >
          戻る
        </Button>
        <Button
          className={classes.button}
          href={`https://teratail.com/questions/${questionId}`}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          color="primary"
          style={{ marginLeft: 680 }}
        >
          WebSite
        </Button>
      </Typography>
      <br />
    </div>
  );
};

export default DetailT;
