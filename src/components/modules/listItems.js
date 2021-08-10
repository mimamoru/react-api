import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";

const current = {
  color: "black",
  fontWeight: "bold",
};

export const listItems = (
  <div>
    <Link exact="true" to="/search" activestyle={current}>
      <ListItem button>
        <ListItemIcon>
          <SearchOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="検索" />
      </ListItem>
    </Link>
    <Link exact="true" to="/stock" activestyle={current}>
      <ListItem button>
        <ListItemIcon>
          <FolderOpenOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="お気に入り" />
      </ListItem>
    </Link>
    <Link exact="true" to="/configuration" activestyle={current}>
      <ListItem button>
        <ListItemIcon>
          <SettingsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="MyTag設定" />
      </ListItem>
    </Link>
  </div>
);
