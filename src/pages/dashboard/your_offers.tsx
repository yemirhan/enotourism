import React from 'react'
import { Container, Group, Stack, Title } from '@mantine/core'
import Layout from '@/components/layout/Layout'
const Offers = () => {
    return (
        <Layout>
            <Container>
                <Stack>
                    <Group>
                        <Title>
                            Your Offers
                        </Title>
                    </Group>

                </Stack>
            </Container>
        </Layout>
    )
}

export default Offers