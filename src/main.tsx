import React from "react";
import ReactDOM from "react-dom/client";
import App from "src/App";
import GlobalStyles from "@/components/GlobalStyles";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppProvider } from "@/context/app.context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyles>
              <App />
            </GlobalStyles>
          </ThemeProvider>
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
