import { React, useState, memo } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { messageAddStock, messageRemoveStock } from "../modules/messages";
import CustomizedSnackbars from "./CustomizedSnackbars";

//ストック用トグルボタン
const SwitchLabel = memo(({ stock, setStock }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  //ボタンのON/OFFに応じて画面にフィードバックをする
  const handleChange = () => {
    if (stock) {
      setSnackbar({
        open: true,
        severity: "success",
        message: messageRemoveStock,
      });
    } else {
      setSnackbar({
        open: true,
        severity: "success",
        message: messageAddStock,
      });
    }
    setStock(!stock);
  };

  return (
    <>
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleClose}
        severity={snackbar.severity}
        message={snackbar.message}
      />
      <FormControlLabel
        control={
          <Switch
            checked={stock}
            onChange={handleChange}
            name="stock"
            color="primary"
          />
        }
        label="Stock"
      />
    </>
  );
});

export default SwitchLabel;
