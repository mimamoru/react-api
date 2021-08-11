import { React, memo, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import IconButton from "@material-ui/core/IconButton";
import QueueRoundedIcon from "@material-ui/icons/QueueRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 265,
    display: "inline-block",
    margin: theme.spacing(0.5),
  },
  accordion: {
    display: "inline-block",
    position: "relative",
    verticalAlign: "middle",
    width: 260,
    height: 70,
  },
  details: {
    position: "absolute",
    display: "inline-block",
    width: 260,
    top: 55,
    zIndex: 100,
    backgroundColor: "white",
  },
  heading: {
    width: 150,
    textAlign: "center",
    verticalAlign: "middle",
    position: "relative",
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  button: {
    zIndex: 1,
    pointerEvents: "visible",
    width: 15,
    height: 30,
  },
}));

//MyTag設定画面のタグ情報表示用パネル
const SimpleAccordion = memo(({ tagName, explain, includes, setChipData }) => {
  const classes = useStyles();

  //すでにMyTagに登録済みのTagの色を変更
  useEffect(() => {
    const color = includes ? "rgb(176, 224, 230)" : "white";
    document.getElementById(`${tagName}_btn`).style.backgroundColor = color;
  }, [includes, tagName]);

  //お気に入り追加・削除の画面制御
  const handleSwitch = () => {
    if (includes) {
      setChipData((chips) => chips.filter((chip) => chip !== tagName));
    } else {
      setChipData((chips) => [...chips, tagName]);
    }
  };

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreRoundedIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{tagName}</Typography>
          <IconButton
            id={`${tagName}_btn`}
            className={classes.button}
            onClick={() => handleSwitch(`${tagName}_btn`)}
            type="submit"
            color="primary"
            component="span"
          >
            <QueueRoundedIcon />
          </IconButton>
          {/* <Button
            id={`${tagName}_btn`}
            className={classes.button}
            type="submit"
            size="small"
            variant="outlined"
            color="primary"
          >
           
          </Button> */}
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Typography>{explain}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
});

export default SimpleAccordion;
