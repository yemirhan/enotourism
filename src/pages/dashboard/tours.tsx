import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { UserToursList } from '@/components/tours/UserToursList'
import { trpc } from '@/utils/trpc'
import { Container, Stack, Title } from '@mantine/core'

import React from 'react'

const Tours = () => {
    const { data: tours, isLoading } = trpc.userTours.getToursOfTourGuide.useQuery()
    return (
        <ProtectedLayout>
            <Container>
                <Stack spacing={"md"}>
                    <Title>
                        Your Tours
                    </Title>
                </Stack>
                <UserToursList data={(tours || []).map(tour => ({
                    name: tour.name,
                    description: tour.description,
                    number_of_people: tour.number_of_people
                }))} />
            </Container>
        </ProtectedLayout>
    )
}

export default Tours