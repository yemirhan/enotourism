import { FeaturesGrid } from '@/components/FeaturesGrid'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroBanner } from '@/components/HeroBanner'
import { Navigation } from '@/components/Navigation'

import { AppShell } from '@mantine/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
const details = {
  "links": [
    {
      "link": "/tours",
      "label": "Tours"
    },
    {
      "link": "/guides",
      "label": "Guides"
    },
    {
      "link": "/wineries",
      "label": "Wineries"
    },
    {
      "link": "#2",
      "label": "Locations",
      "links": [
        {
          "link": "/countries",
          "label": "Countries"
        },
        {
          "link": "/regions",
          "label": "Regions"
        }
      ]
    }
  ]
}
const footerProps = {
  "links": [
    {
      "link": "/contact",
      "label": "Contact"
    },
    {
      "link": "/privacy",
      "label": "Privacy"
    }
  ]
}
export const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  return (<>
    <Head>
      <title>Enotourism</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/glass-full.svg" />
    </Head>
    <AppShell
      header={<Header links={details.links} />}
      padding="xs"
      navbar={router.pathname.includes("dashboard") ? <Navigation /> : undefined}
      footer={<Footer links={footerProps.links} />}
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.gray[0] },
      })}
    >
      {children}
    </AppShell>
  </>
  )
}

export default Layout