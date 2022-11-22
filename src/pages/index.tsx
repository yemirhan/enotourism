import { FeaturesGrid } from '@/components/FeaturesGrid'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroBanner } from '@/components/HeroBanner'
import Layout from '@/components/layout/Layout'
import { Navigation } from '@/components/Navigation'

import { AppShell } from '@mantine/core'
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
        },
        {
          "link": "/subregions",
          "label": "Sub Regions"
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
const Homepage = () => {
  const router = useRouter()

  return (<Layout>
    <HeroBanner />
    <FeaturesGrid title={"Integrate effortlessly with any technology stack"} description={"Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when hunger drives it to try biting a Steel-type Pokémon."} />
  </Layout>
  )
}
export default Homepage;