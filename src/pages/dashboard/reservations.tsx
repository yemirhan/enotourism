import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc'
import { Badge, Button, Container, Group, Stack, Table, Title } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons'
import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React from 'react'
import type { GetServerSideProps } from 'next';
import { getServerAuthSession } from '@/server/common/get-server-auth-session';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession({
        req: context.req,
        res: context.res,
    });

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return { props: {} };
};
const Reservations = () => {
    const { data: reservations, isLoading, isError } = trpc.reservations.getReservationsOfUser.useQuery()
    console.log(reservations);
    const router = useRouter()
    const rows = !(reservations instanceof TRPCError) ? (reservations || []).map((reservation) => (
        <tr key={reservation.id}>
            <td>{reservation.tour?.name}</td>
            <td>{`${dayjs(reservation.tour?.startDate).format("DD/MM/YY")} - ${dayjs(reservation.tour?.endDate).format("DD/MM/YY")}`}</td>
            <td>{dayjs(reservation.tour?.startTime).format("HH:mm")}</td>
            <td><Badge >
                {reservation.status.status}</Badge></td>
            <td><Button
                size='xs'
                onClick={() => {
                    router.push("/guides/" + reservation.tourGuideId)
                }}
            >
                <IconExternalLink size={20} />
            </Button></td>
            <td><Button
                size='xs'
                onClick={() => {
                    router.push("/tours/" + reservation.tourId)
                }}
            >
                <IconExternalLink size={20} />
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
                                <th>Start-End Date</th>
                                <th>Starts At</th>
                                <th>Status</th>
                                <th>Guide Page</th>
                                <th>Tour Page</th>
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