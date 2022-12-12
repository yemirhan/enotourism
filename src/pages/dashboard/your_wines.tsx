import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { trpc } from '@/utils/trpc';

import { Button, Container, Group, Stack, Table, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react'

export const YourWines = () => {
    const [opened, { toggle, close, open }] = useDisclosure(false);
    const { data } = trpc.wines.getWines.useQuery();
    return (<>
        <ProtectedLayout>
            <Container>
                <Stack>
                    <Group position='apart'>
                        <Title>
                            Your Wines
                        </Title>
                    </Group>
                    <Table>
                        <thead>
                            <tr>
                                <th>Wine Name</th>
                                <th>Wine Description</th>
                                <th>Wine color</th>
                                <th>Wine taste</th>
                                <th>Wine texture</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data || []).map(wine => {
                                return <tr key={wine.id}>
                                    <td>{wine.name}</td>
                                    <td>{wine.brief_description}</td>
                                    <td>{wine.color}</td>
                                    <td>{wine.taste}</td>
                                    <td>{wine.texture}</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>
                </Stack>
            </Container>
        </ProtectedLayout>
    </>
    )
}
export default YourWines;