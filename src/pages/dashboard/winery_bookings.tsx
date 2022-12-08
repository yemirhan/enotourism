import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc'
import { Container, Group, Stack, Table, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'

import React from 'react'

const WineryBookings = () => {
    // const { data: bookings, refetch } = trpc.reservations.getReservationsOfTourGuide.useQuery()
    // const { mutate: updateStatus } = trpc.status.updateStatus.useMutation({
    //     onSuccess: () => {
    //         showNotification({
    //             title: "Status Updated",
    //             message: "Status Updated Successfully",
    //         })
    //         refetch()
    //     }
    // })
    // const router = useRouter()
    // const rows = !(bookings instanceof TRPCError) ? (bookings || []).map((element) => (
    //     <tr key={element.id}>
    //         <td>{element.offer.Tour?.[0]?.name}</td>
    //         <td>{element.from_time}</td>
    //         <td>{dayjs(element.date).format("DD/MM/YYYY")}</td>
    //         <td>
    //             <Flex direction={"row"} gap="sm" align={"center"} justify="center">
    //                 <Avatar src={element.user.photo} size="sm" />
    //                 <Text>
    //                     {element.user.name}
    //                 </Text>
    //             </Flex>
    //         </td>
    //         <td><Badge >
    //             {element.status.status}</Badge></td>
    //         <td>
    //             <Flex direction={"row"} gap="sm">


    //                 <Button
    //                     onClick={() => {
    //                         updateStatus({
    //                             id: element.status.id,
    //                             status: "ACCEPTED"
    //                         })
    //                     }}
    //                 >
    //                     Accept
    //                 </Button>
    //                 <Button
    //                     onClick={() => {
    //                         updateStatus({
    //                             id: element.status.id,
    //                             status: "REJECTED"
    //                         })
    //                     }}
    //                 >
    //                     Reject
    //                 </Button>
    //             </Flex>
    //         </td>
    //     </tr>
    // )) : null;
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
                            </tr>
                        </thead>
                        
                    </Table>
                </Stack>
            </Container>
        </Layout>
    )
}

export default WineryBookings