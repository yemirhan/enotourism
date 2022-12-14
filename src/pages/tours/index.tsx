import Layout from "@/components/layout/Layout"
import { SearchBar } from "@/components/tours/SearchBar"
import { TourCard } from "@/components/tours/TourCard"
import { trpc } from "@/utils/trpc"
import { Container, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useState } from "react"




const data = {
    "image": "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    "title": "Verudela Beach",
    "country": "Croatia",
    "description": "Completely renovated for the season 2020, Arena Verudela Bech Apartments are fully equipped and modernly furnished 4-star self-service apartments located on the Adriatic coastline by one of the most beautiful beaches in Pula.",
    "badges": [
        {
            "emoji": "☀️",
            "label": "Sunny weather"
        },
        {
            "emoji": "🦓",
            "label": "Onsite zoo"
        },
        {
            "emoji": "🌊",
            "label": "Sea"
        },
        {
            "emoji": "🌲",
            "label": "Nature"
        },
        {
            "emoji": "🤽",
            "label": "Water sports"
        }
    ]
}
const Tours = () => {

    const [search, setSearch] = useState("")
    const [countryIds, setCountryIds] = useState<string[]>([])
    const { data: tours } = trpc.tour.searchTours.useQuery({
        name: search,
        countryId: countryIds
    })
    return (
        <Layout>
            <Container size={"xl"}>
                <Stack spacing={"md"}>
                    <Title>
                        Discover unique wine tasting & tours
                    </Title>
                    <Text>
                        Just getting started on your wine journey, or jumping back in?
                        Taste through a selection of a great local wines.
                    </Text>
                    <SearchBar search={search} setSearch={setSearch} countryIds={countryIds} setCountryIds={setCountryIds} />
                    <SimpleGrid cols={3}>
                        {(tours || []).map(tour => {
                            return <TourCard id={tour.id} key={tour.id} image={tour.photos?.[0]?.url || null} title={tour.name} description={tour.description} country={tour.Winery?.[0]?.address?.country.name || ""} badges={[]} />
                        })}

                    </SimpleGrid>
                </Stack>
            </Container>
        </Layout>
    )
}
export default Tours