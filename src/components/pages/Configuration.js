import { React, useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { BaseYup } from "../modules/localeJP";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";

import CustomizedSnackbars from "../atoms/CustomizedSnackbars";
import ConfirmDialog from "../atoms/ConfirmDialog";
import GenericTemplate from "../molecules/GenericTemplate";
import TagsPapers from "../molecules/TagsPapers";
import TagPaper from "../molecules/TagPaper";

import {
  err,
  messageUpateMyTags,
  confirmUpdate,
  confirmBack,
} from "../modules/messages";
import { currentVersionCheck, findDiff } from "../modules/myapi";
import {
  useGetMyTags,
  usePostMyTags,
  useDeleteMyTags,
} from "../queryhooks/index";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(3),
    },
  },
  container: {
    display: "grid",
    width: "600",
  },
  button: {
    margin: theme.spacing(0.5),
    textTransform: "none",
  },
  chip: {
    margin: theme.spacing(0.3),
  },
  error: {
    color: "rgb(255,0,0)",
  },
}));

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//タグ情報を配列型にする
const makeChips = (data) => {
  if (!data) return [];
  const chips = data.map((e) => e.id);
  return chips;
};

//検索欄のエラー表示の削除
const handleChange = (id) => {
  document.getElementById(id).innerHTML = "";
};

//MyTag設定ページ
const Configuration = () => {
  const classes = useStyles();
  const history = useHistory();

  //MyTag取得
  const { isError, data } = useGetMyTags();

  //MyTag更新用フック
  const deleteMyTagsMutation = useDeleteMyTags();
  const postMyTagsMutation = usePostMyTags();

  //MyTagの状態管理
  const [myTagsData, setMyTagsData] = useState([]);

  //MyTag選択の状態管理
  const [chipData, setChipData] = useState([]);

  //検索欄内容の状態管理
  const [tagName, setTagName] = useState("");
  const searchInputRef = useRef("");

  //確認ダイアログメッセージののメッセージの状態管理
  const [confDlg, setConfDlg] = useState("");

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

  //MyTag情報の設定
  useEffect(() => {
    if (!data) return;
    setMyTagsData([...data]);
    setChipData([...makeChips(data)]);
  }, [data]);

  //Tag検索ボタン押下時の処理
  const handleSearch = async () => {
    const keywords = searchInputRef.current.value;
    if (keywords.trim() === "") {
      setTagName("");
      return;
    }
    const id = "searchInput";
    //バリデーションの処理　エラーの場合は処理を終了する
    let valid = true;
    await BaseYup.string()
      .max(50)
      .label("Tag名")
      .validate(keywords)
      .catch((res) => {
        valid = false;
        const dom = document.getElementById(id);
        dom.textContent = res.errors;
      });
    if (!valid) return;
    setTagName(keywords);
  };

  //Tagの選択を解除した場合の処理
  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  //MyTag情報更新処理
  const executeUpdate = () => {
    const myTags = makeChips(myTagsData);
    //差分を算出し、登録・削除を行う
    const diff = findDiff(myTags, chipData);
    for (let id of diff.adds) {
      const ad = {
        id: id,
      };
      postMyTagsMutation.mutate(ad);
    }
    for (let id of diff.subs) {
      deleteMyTagsMutation.mutate(id);
    }
    //処理が終了したら、フィードバックを表示　※成功しなくても表示されてしまう
    setSnackbar({
      open: true,
      severity: "success",
      message: messageUpateMyTags,
    });
  };

  //MyTag更新ボタン押下時の処理
  const handleUpdate = async () => {
    //更新元のデータが最新ではない場合、継続の確認ダイアログを表示
    const maxRecordDate =
      data.length > 0
        ? data.reduce((acc, value) =>
            acc.recordDate > value.recordDate
              ? acc.recordDate
              : value.recordDate
          )
        : "nothing";
    await currentVersionCheck("myTags", maxRecordDate, data.length).then(
      (res) => {
        if (res === "changed") {
          setConfDlg("update");
        } else if (res === "ok") {
          executeUpdate();
        } else {
          setSnackbar({ open: true, severity: "error", message: err });
        }
      }
    );
  };

  //戻る処理
  const executeBack = () => {
    history.goBack();
  };

  //戻るボタン押下時の処理
  const handleBack = () => {
    const myTags = makeChips(myTagsData);
    const diff = findDiff(myTags, chipData);
    //更新処理が行われていない変更がある場合、確認ダイアログを表示
    if (diff.adds.length === 0 && diff.subs.length === 0) {
      history.goBack();
      return;
    }
    setConfDlg("back");
  };

  //エラー発生時、ホーム画面に遷移する処理
  const handleHomeBack = useCallback(async () => {
    await _sleep(2000);
    history.push("/");
  }, [history]);

  //エラー発生時
  useEffect(() => {
    if (!isError) return;
    setSnackbar({ open: true, severity: "error", message: err });
    handleHomeBack();
  }, [isError, handleHomeBack]);

  return (
    <GenericTemplate title="MyTag設定">
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleClose}
        severity={snackbar.severity}
        message={snackbar.message}
      />
      <ConfirmDialog
        msg={confirmUpdate}
        isOpen={confDlg === "update"}
        doYes={executeUpdate}
        doNo={() => {
          setConfDlg("");
        }}
      />
      <ConfirmDialog
        msg={confirmBack}
        isOpen={confDlg === "back"}
        doYes={executeBack}
        doNo={() => {
          setConfDlg("");
        }}
      />
      <br />
      <section>
        <Paper component="div" className={classes.root}>
          {chipData?.map((tag) => {
            return (
              <span key={tag} className={classes.chip}>
                <Chip
                  component="span"
                  variant="outlined"
                  color="primary"
                  label={tag}
                  onDelete={handleDelete(tag)}
                  className={classes.chip}
                />
              </span>
            );
          })}
        </Paper>
        <br />
        <Button
          className={classes.button}
          type="button"
          size="large"
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          startIcon={<CheckCircleOutlineRoundedIcon />}
        >
          MyTag更新
        </Button>
      </section>
      <hr />
      <br />
      <div className="container">
        <section>
          <TextField
            style={{ width: 200 }}
            inputRef={(el) => (searchInputRef.current = el)}
            onChange={() => handleChange("searchInput")}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            className={classes.button}
            type="button"
            variant="contained"
            color="primary"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Tag検索
          </Button>
          <p id="searchInput" className="error"></p>

          {tagName ? (
            <TagPaper
              tagName={tagName}
              chipData={chipData}
              setChipData={setChipData}
            />
          ) : (
            <TagsPapers chipData={chipData} setChipData={setChipData} />
          )}
        </section>
      </div>
      <br />
      <Button
        type="button"
        onClick={handleBack}
        variant="contained"
        color="primary"
      >
        戻る
      </Button>
    </GenericTemplate>
  );
};

export default Configuration;
