import { GuideCard } from "@/components/guides/GuideCard"
import Layout from "@/components/layout/Layout"
import { trpc } from "@/utils/trpc"
import { Container, SimpleGrid, Stack, Title } from "@mantine/core"


const data = {
    "image": "https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    "category": "Local wine guide",
    "title": "I am a wine professional on loan to tourism. I mix the skills of a certified sommelier and Wset3 with the outdoor guide to create original walking tours in the wine areas.",
    "footer": "733 people liked this",
    "author": {
        "name": "Elsa Gardenowl",
        "description": "Somewhere",
        "image": "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
    }
}

const Guides = () => {
    const { data: guides } = trpc.guides.getGuides.useQuery()
    return (
        <Layout>
            <Container size={"xl"}>
                <Stack>
                    <Title>
                        Guides
                    </Title>
                    <SimpleGrid cols={4}>
                        {guides?.map((guide) => {
                            return <GuideCard key={guide.id}
                                id={guide.id}
                                about={guide.about}
                                email={guide.email}
                                name={guide.name || ""}
                                user_type={guide.user_type}
                                address={guide.address}
                                photo={guide.photo || ""}
                                surname={guide.surname || ""}
                            />
                        })}
                    </SimpleGrid>
                </Stack>
            </Container>
        </Layout>
    )
}
export default Guides