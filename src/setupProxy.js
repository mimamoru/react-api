const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  const headers = {
    "Content-Type": "application/json",
  };
  app.use(
    createProxyMiddleware("/api/v1/", {
      target: "https://teratail.com/",
      changeOrigin: true,
      secure: false,
      headers: headers,
    })
  );
  app.use(
    createProxyMiddleware("/api/v2/", {
      target: "https://qiita.com/",
      changeOrigin: true,
      secure: false,
      headers: headers,
    })
  );
};
