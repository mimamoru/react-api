import * as yup from "yup";

const localeJP = {
  string: {
    max: "${path}:${max}文字以下で指定してください",
  },
};

yup.setLocale(localeJP);

export const BaseYup = yup;
