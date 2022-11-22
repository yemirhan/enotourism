import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "@/utils/trpc";

import "../styles/globals.css";
import { useState } from "react";
import type { ColorScheme} from "@mantine/core";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { RouterTransition } from "@/components/RouterTransition";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (
    <SessionProvider session={session}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: colorScheme,
            colors: {
              wine: ["#f5e7eb", "#e9c3cc", "#cc8993", "#b75e6c", "#bc3a4f", "#bc1f39", "#ae1837", "#9d0f30", "#900829", "#800020"],
              emerald: ["#e0f3ef", "#b3e2d6", "#83d0bb", "#51bca1", "#2bad8e", "#079e7b", "#04906f", "#008060", "#007052", "#005437"]
            },
            primaryColor: "wine",
            loader: "dots",
            fontFamily: "Quicksand",
          }}
        >
          <NotificationsProvider>
            <RouterTransition />
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
