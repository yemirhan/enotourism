import Layout from '@/components/layout/Layout'
import { Container, Group, Stack, Title } from '@mantine/core'
import React from 'react'

const Bookings = () => {
    return (
        <Layout>
            <Container>
                <Stack>
                    <Group>
                        <Title>
                            Bookings
                        </Title>
                    </Group>
                </Stack>
            </Container>
        </Layout>
    )
}

export default Bookings