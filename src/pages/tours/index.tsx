import Layout from "@/components/layout/Layout"
import { SearchBar } from "@/components/tours/SearchBar"
import { TourCard } from "@/components/tours/TourCard"
import { Container, SimpleGrid, Stack, Text, Title } from "@mantine/core"




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
                    <SearchBar />
                    <SimpleGrid cols={3}>
                        <TourCard {...data} />
                        <TourCard {...data} />
                        <TourCard {...data} />
                        <TourCard {...data} />

                    </SimpleGrid>
                </Stack>
            </Container>
        </Layout>
    )
}
export default Tours