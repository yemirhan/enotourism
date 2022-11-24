import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { CreateWineModal } from '@/components/wine/CreateWineModal';
import { Button, Container, Group, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react'

export const YourWines = () => {
    const [opened, { toggle, close, open }] = useDisclosure(false);
    return (<>
        <ProtectedLayout>
            <Container>
                <Stack>
                    <Group position='apart'>
                        <Title>
                            Your Wines
                        </Title>
                        <Button onClick={open}>
                            Add New Wine
                        </Button>
                    </Group>
                </Stack>
            </Container>
        </ProtectedLayout>
        <CreateWineModal opened={opened} setClosed={close} />
    </>
    )
}
export default YourWines;