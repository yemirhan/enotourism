import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc'
import { Badge, Button, Container, Group, Stack, Table, Title } from '@mantine/core'
import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React from 'react'

const Reservations = () => {
    const { data: reservations, isLoading, isError } = trpc.reservations.getReservationsOfUser.useQuery()
    console.log(reservations);
    const router = useRouter()
    const rows = !(reservations instanceof TRPCError) ? (reservations || []).map((element) => (
        <tr key={element.id}>
            <td>{element.offer.Tour?.[0]?.name}</td>
            <td>{element.from_time}</td>
            <td>{dayjs(element.date).format("DD/MM/YYYY")}</td>
            <td><Badge >
                {element.status.status}</Badge></td>
            <td><Button
                onClick={() => {
                    router.push("/tours/" + element.offer.Tour[0]?.id)
                }}
            >
                Cancel
            </Button></td>
        </tr>
    )) : null;
    return (
        <Layout>
            <Container>
                <Stack>
                    <Group position='apart'>
                        <Title>
                            Reservations
                        </Title>
                    </Group>
                    <Table>
                        <thead>
                            <tr>
                                <th>Tour Name</th>
                                <th>Starts At</th>
                                <th>Start Date</th>
                                <th>Status</th>
                                <th>Cancel</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
                </Stack>
            </Container>
        </Layout>
    )
}

export default Reservations