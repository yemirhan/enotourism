import Layout from '@/components/layout/Layout'
import { Container, Group, Stack, Title } from '@mantine/core'
import React from 'react'

const Reservations = () => {
    return (
        <Layout>
            <Container>
                <Stack>
                    <Group position='apart'>
                        <Title>
                            Reservations
                        </Title>
                    </Group>
                </Stack>
            </Container>
        </Layout>
    )
}

export default Reservations