import type { AppProps /*, AppContext */ } from "next/app";
import Head from "next/head";
import "@fontsource/open-sans";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "react-toastify/dist/ReactToastify.css";
import "@assets/main.css";
import { UIProvider } from "@contexts/ui.context";
import { SettingsProvider } from "@contexts/settings.context";
import ErrorMessage from "@components/ui/error-message";
import PageLoader from "@components/ui/page-loader/page-loader";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { useRef } from "react";
import { useSettingsQuery } from "@data/settings/use-settings.query";
import { ReactQueryDevtools } from "react-query/devtools";

const Noop: React.FC = ({ children }) => <>{children}</>;

const AppSettings: React.FC = (props) => {
  const { data, isLoading: loading, error } = useSettingsQuery();
  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error.message} />;
  return <SettingsProvider initialValue={data?.options} {...props} />;
};

export default function CustomApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<any>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  const Layout = (Component as any).Layout || Noop;

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <AppSettings>
          <UIProvider>
            <Layout>
              <Head>
                <title>PickBazar Admin</title>
                <meta
                  name="description"
                  content="PickBazar E-Commerce Description"
                />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1 maximum-scale=1"
                />
              </Head>
              <Component {...pageProps} />
              <ToastContainer autoClose={2000} />
            </Layout>
          </UIProvider>
        </AppSettings>
        <ReactQueryDevtools />
      </Hydrate>
    </QueryClientProvider>
  );
}
