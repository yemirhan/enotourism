import { trpc } from '@/utils/trpc'
import { Avatar, Badge, Group, Paper, Stack, Text } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'


export const ProfileCard = () => {
    const session = useSession()
    const { data: profileData } = trpc.profile.getProfile.useQuery()
    return (
        <Paper shadow="sm" withBorder p={"lg"}>
            <Group spacing={"md"} position='apart'>
                <Group spacing={"md"}>


                    <Avatar src={profileData?.photo} size="xl" />
                    <Stack spacing={"xs"}>
                        <Text size={"lg"} weight="bold">
                            {profileData?.name}
                        </Text>
                        <Text>
                            {profileData?.email}
                        </Text>

                    </Stack>
                </Group>
                <Badge>
                    {profileData?.user_type}
                </Badge>
            </Group>
        </Paper>
    )
}
