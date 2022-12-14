import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc'
import { Avatar, Badge, Button, Container, Flex, Group, Stack, Table, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React from 'react'
import type { GetServerSideProps } from 'next';
import { getServerAuthSession } from '@/server/common/get-server-auth-session';
import { IconExternalLink } from '@tabler/icons'

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
const Bookings = () => {
    const { data: bookings, refetch } = trpc.reservations.getReservationsOfTourGuide.useQuery()
    const { mutate: updateStatus } = trpc.status.updateStatus.useMutation({
        onSuccess: () => {
            showNotification({
                title: "Status Updated",
                message: "Status Updated Successfully",
            })
            refetch()
        }
    })
    const router = useRouter()
    const rows = !(bookings instanceof TRPCError) ? (bookings || []).map((bookings) => (
        <tr key={bookings.id}>
            <td>{bookings.tour?.name}</td>
            <td>{dayjs(bookings.tour?.startTime).format("HH:mm")}</td>
            <td>{dayjs(bookings.tour?.startDate).format("DD/MM/YYYY")}</td>
            <td>
                <Badge >
                    {bookings.status.status}
                </Badge>
            </td>
            <td>
                <Flex direction={"row"} gap="sm" align={"center"} justify="center">
                    <Avatar src={bookings.user.photo} size="sm" />
                    <Text>
                        {bookings.user.name}
                    </Text>
                </Flex>
            </td>

            <td>
                <Flex direction={"row"} gap="sm">


                    <Button
                        size='xs'
                        onClick={() => {
                            updateStatus({
                                id: bookings.status.id,
                                status: "ACCEPTED"
                            })
                        }}
                    >
                        Accept
                    </Button>
                    <Button
                        size='xs'
                        onClick={() => {
                            updateStatus({
                                id: bookings.status.id,
                                status: "REJECTED"
                            })
                        }}
                    >
                        Reject
                    </Button>
                </Flex>
            </td>
            <td>
                <Button
                    onClick={() => {
                        router.push(`/tours/${bookings.tour?.id}`)
                    }}
                >
                    <IconExternalLink size={16} />
                </Button>
            </td>
        </tr>
    )) : null;
    return (
        <Layout>
            <Container>
                <Stack>
                    <Group>
                        <Title>
                            Bookings
                        </Title>
                    </Group>
                    <Table>
                        <thead>
                            <tr>
                                <th>Tour Name</th>
                                <th>Starts At</th>
                                <th>Start Date</th>
                                <th>Status</th>
                                <th>Reservated By</th>
                                <th>Update Status</th>
                                <th>View Tour</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
                </Stack>
            </Container>
        </Layout>
    )
}

export default Bookings