import { React, useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DetailButton from "../atoms/DetailButton";
import ImportContactsRoundedIcon from "@material-ui/icons/ImportContactsRounded";
import QuestionAnswerRoundedIcon from "@material-ui/icons/QuestionAnswerRounded";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";

import ReactSelect from "react-select";

import {
  useGetAllMyStockT,
  useGetAllMyStockQ,
  useGetMyTags,
} from "../queryhooks/index";
import { warningNodata, warningMyTag } from "../modules/messages";
import CustomizedSnackbars from "../atoms/CustomizedSnackbars";
import CircularIndeterminate from "../atoms/CircularIndeterminate";
import TabPanel from "../atoms/TabPanel";

const useStyles = makeStyles((theme) => ({
  absolute: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
  },
  text: {
    textTransform: "none",
  },
  select: {
    zIndex: 100,
  },
}));

const limit = 10;

//讀懃ｴ｢邨先棡縺ｨ縲√♀豌励↓蜈･繧贋ｸ隕ｧ繧定｡ｨ遉ｺ縺吶ｋ繝��繝悶Ν
const CustomizedTable = ({
  columnsT,
  columnsQ,
  valuesT,
  valuesQ,
  allPagesT,
  allPagesQ,
  pageT,
  pageQ,
  setPageT,
  setPageQ,
  paramTabValue,
  paramSelect,
  isStock,
}) => {
  const classes = useStyles();

  //縺頑ｰ励↓蜈･繧頑ュ蝣ｱ繧貞叙蠕励☆繧�
  const { data: mystockT } = useGetAllMyStockT();
  const { data: mystockQ } = useGetAllMyStockQ();

  //MyTag荳隕ｧ繧貞叙蠕励☆繧�
  const { data: myTags } = useGetMyTags(); //繧ｻ繝ｬ繧ｯ繝医�繝�け繧ｹ鬆�岼縺ｮ迥ｶ諷狗ｮ｡逅�

  const [options, setOptions] = useState([]);
  //繧ｻ繝ｬ繧ｯ繝医�繝�け繧ｹ驕ｸ謚槭�迥ｶ諷狗ｮ｡逅�
  const [select, setSelect] = useState(paramSelect ? [...paramSelect] : []);

  //縺頑ｰ励↓蜈･繧願ｨ倅ｺ喫d縺ｮ迥ｶ諷狗ｮ｡逅�
  const [favoriteT, setFavoriteT] = useState([]);
  const [favoriteQ, setFavoriteQ] = useState([]);

  //繝��繝悶Ν陦後�迥ｶ諷狗ｮ｡逅�
  const [rowsT, setRowsT] = useState(valuesT && valuesT[0] ? [...valuesT] : []);
  const [rowsQ, setRowsQ] = useState(valuesQ && valuesQ[0] ? [...valuesQ] : []);

  //繧ｿ繝悶�迥ｶ諷狗ｮ｡逅�
  const [tabValue, setTabValue] = useState(paramTabValue);

  //繧ｹ繝翫ャ繧ｯ繝舌�縺ｮ迥ｶ諷狗ｮ｡逅�
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  //繧ｹ繝翫ャ繧ｯ繝舌�繧帝哩縺倥ｋ蜃ｦ逅�
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  //繧ｿ繝悶�驕ｸ謚槫､画峩蜃ｦ逅�
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //繧ｻ繝ｬ繧ｯ繝医�繝�け繧ｹ縺ｮ荳ｭ霄ｫ繧定ｨｭ螳�
  useEffect(() => {
    setOptions(
      myTags ? [...myTags.map((e) => ({ value: e.id, label: e.id }))] : []
    );
  }, [myTags]);

  //縺頑ｰ励↓蜈･繧願ｨ倅ｺ喫d繧定ｨｭ螳�
  useEffect(() => {
    setFavoriteT(mystockT ? [...mystockT.map((e) => e.id)] : []);
  }, [mystockT]);

  useEffect(() => {
    setFavoriteQ(mystockQ ? [...mystockQ.map((e) => e.id)] : []);
  }, [mystockQ]);

  //繝��繝悶Ν陦後ｒ險ｭ螳�
  useEffect(() => {
    if (!valuesT) return;
    setRowsT([...valuesT]);
  }, [valuesT]);

  useEffect(() => {
    if (!valuesQ) return;
    setRowsQ([...valuesQ]);
  }, [valuesQ]);

  //Tag縺ｮ邨槭ｊ霎ｼ縺ｿ縺ｫ蠢懊§縺ｦ繝��繝悶Ν陦ｨ遉ｺ繧貞､画峩縺吶ｋ
  //窶ｻ繝壹�繧ｸ縺斐→縺ｮ邨槭ｊ霎ｼ縺ｿ縺励°縺ｧ縺阪↑縺�
  useEffect(() => {
    const film = select.map((e) => e.value.toLowerCase());
    if (film.length === 0) {
      setRowsT(valuesT && valuesT[0] ? [...valuesT] : [false]);
      setRowsQ(valuesQ && valuesQ[0] ? [...valuesQ] : [false]);
    } else {
      const newRowsT =
        !valuesT || !valuesT[0]
          ? [false]
          : valuesT.filter((elm) =>
              elm.tags.split(",").some((e) => film.includes(e.toLowerCase()))
            );
      setRowsT([...newRowsT]);
      const newRowsQ =
        !valuesQ || !valuesQ[0]
          ? [false]
          : valuesQ.filter((elm) =>
              elm.tags.split(",").some((e) => film.includes(e.toLowerCase()))
            );
      setRowsQ([...newRowsQ]);
    }
  }, [select, valuesT, valuesQ]);

  //繝��繧ｿ蜿門ｾ礼憾豕√↓蠢懊§縺ｦ繧ｹ繝翫ャ繧ｯ繝舌�繧定｡ｨ遉ｺ縺吶ｋ
  useEffect(() => {
    if (!myTags) return;
    const message =
      !isStock && myTags.length === 0 ? warningMyTag : warningNodata;
    if (
      (tabValue === 0 &&
        valuesT &&
        valuesT[0] !== false &&
        rowsT.length === 0) ||
      (tabValue === 1 && valuesQ && valuesQ[0] !== false && rowsQ.length === 0)
    ) {
      setSnackbar({ open: true, severity: "warning", message: message });
    }
  }, [tabValue, rowsT, rowsQ, myTags, valuesT, valuesQ, isStock]);

  return (
    <div id="wrapper">
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleClose}
        severity={snackbar.severity}
        message={snackbar.message}
      />
      <Paper className={classes.root}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab
            className={classes.text}
            label="teratail"
            icon={<QuestionAnswerRoundedIcon />}
          />
          <Tab
            className={classes.text}
            label="Qiita"
            icon={<ImportContactsRoundedIcon />}
          />
        </Tabs>
      </Paper>
      <section style={{ width: 600 }}>
        <ReactSelect
          className={classes.select}
          name="searchTags"
          placeholder="MyTag"
          variant="outlined"
          isMulti
          onChange={(event, newValue) => setSelect(event)}
          defaultValue={paramSelect ? [...paramSelect] : []}
          options={options}
        />
      </section>
      <br />
      <TabPanel value={tabValue} index={0}>
        <TableContainer
          style={{ height: 400, width: "auto" }}
          component={Paper}
        >
          {valuesT[0] === false && <CircularIndeterminate component="span" />}
          <Table
            className={classes.table}
            aria-label="simple table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                {columnsT?.map((column) => (
                  <TableCell key={column.headerName}>
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsT?.map(
                (row) =>
                  row && (
                    <TableRow
                      key={row.id}
                      style={{
                        backgroundColor:
                          (isStock || favoriteT.includes(row.id)) &&
                          "rgb(176, 224, 230)",
                      }}
                    >
                      <TableCell>
                        <DetailButton
                          id={row.id}
                          favorite={isStock ? true : favoriteT.includes(row.id)}
                          type="t"
                          variant="contained"
                          color="primary"
                          pageT={pageT ?? 1}
                          pageQ={pageQ ?? 1}
                          select={select}
                          isStock={isStock}
                        >
                          隧ｳ邏ｰ
                        </DetailButton>
                      </TableCell>
                      {columnsT?.map((column, idx) => (
                        <TableCell
                          key={column.field}
                          style={{
                            display: idx === 0 && "none",
                          }}
                        >
                          {row[column.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <div style={{ textAlign: "center", display: "inline-block" }}>
          <Pagination
            count={isStock ? Math.ceil(mystockT?.length / limit) : allPagesT}
            color="primary"
            onChange={(e, page) => setPageT(page)}
            page={pageT ?? 1}
          />
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TableContainer
          style={{ height: 400, width: "auto" }}
          component={Paper}
        >
          {valuesQ[0] === false && <CircularIndeterminate component="span" />}
          <Table
            className={classes.table}
            aria-label="simple table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                {columnsQ?.map((column) => (
                  <TableCell key={column.headerName}>
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rowsQ?.map(
                (row) =>
                  row && (
                    <TableRow
                      key={row.id}
                      style={{
                        backgroundColor:
                          (isStock || favoriteQ.includes(row.id)) &&
                          "rgb(176, 224, 230)",
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <DetailButton
                          id={row.id}
                          favorite={isStock ? true : favoriteQ.includes(row.id)}
                          type="q"
                          variant="contained"
                          color="primary"
                          pageT={pageT ?? 1}
                          pageQ={pageQ ?? 1}
                          select={select}
                          isStock={isStock}
                        >
                          隧ｳ邏ｰ
                        </DetailButton>
                      </TableCell>
                      {columnsQ?.map((column, idx) => (
                        <TableCell
                          key={column.field}
                          style={{
                            display: idx === 0 && "none",
                          }}
                        >
                          {row[column.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <div style={{ textAlign: "center", display: "inline-block" }}>
          <Pagination
            count={isStock ? Math.ceil(mystockQ?.length / limit) : allPagesQ}
            color="primary"
            onChange={(e, page) => setPageQ(page)}
            page={pageQ ?? 1}
          />
        </div>
      </TabPanel>
    </div>
  );
};
export default CustomizedTable;
