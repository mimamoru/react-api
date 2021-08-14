import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import DetailT from "./components/pages/DetailT";
import DetailQ from "./components/pages/DetailQ";
import Configuration from "./components/pages/Configuration";
import Search from "./components/pages/Search";
import Stock from "./components/pages/Stock";
import Home from "./components/pages/Home";

// アクセストークンを利用する場合は、staleTimeを指定するとよい
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/search" component={Search} exact />
          <Route path="/stock" component={Stock} exact />
          <Route path="/detailt" component={DetailT} exact />
          <Route path="/detailq" component={DetailQ} exact />
          <Route path="/configuration" component={Configuration} exact />
        </Switch>
      </BrowserRouter>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  );
}

export default App;
