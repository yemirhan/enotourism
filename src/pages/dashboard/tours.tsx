import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { UserToursList } from '@/components/tours/UserToursList'
import { trpc } from '@/utils/trpc'
import { Container, Stack, Title } from '@mantine/core'

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
                    number_of_people: tour.max_number_of_people
                }))} />
            </Container>
        </ProtectedLayout>
    )
}

export default Tours