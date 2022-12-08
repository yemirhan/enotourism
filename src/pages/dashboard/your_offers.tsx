import React from 'react'
import { Container, Group, Stack, Table, Title } from '@mantine/core'
import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc'
const Offers = () => {
    const { data: wineries } = trpc.userWinery.getWineriesOfUser.useQuery()

    return (
        <Layout>
            <Container>
                <Stack>
                    <Group>
                        <Title>
                            Your Offers
                        </Title>
                    </Group>
                    {
                        (wineries || []).map(winery => {
                            return <Stack key={winery.id}>
                                <Title order={3}>
                                    {winery.name}
                                </Title>
                                <WineryTable wineryId={winery.id} />
                            </Stack>
                        })
                    }
                </Stack>
            </Container>
        </Layout>
    )
}

export default Offers

const WineryTable = ({ wineryId }: { wineryId: string }) => {
    const { data: offers } = trpc.offer.getWineryOffers.useQuery({ wineryId })
    return <Table>
        <thead>
            <tr>
                <th>Offer Name</th>
                <th>Offer Description</th>
                <th>Offer Price</th>
                <th>Offer Duration</th>
            </tr>
        </thead>
        <tbody>
            {
                (offers || []).map(offer => {
                    return <tr key={offer.id}>
                        <td>{offer.name}</td>
                        <td>{offer.description}</td>
                        <td>{offer.price}</td>
                        <td>{offer.duration}</td>
                    </tr>
                })
            }
        </tbody>

    </Table>
}