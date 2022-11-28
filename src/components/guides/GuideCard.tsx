import { ICountryList } from '@/validation/address';
import { UserType } from '@/validation/auth';
import { createStyles, Card, Image, ActionIcon, Group, Text, Avatar, Badge, Button } from '@mantine/core';
import { CountryList } from '@prisma/client';
import { IconHeart, IconBookmark, IconShare } from '@tabler/icons';
import Link from 'next/link';


const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    footer: {
        padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`,
        marginTop: theme.spacing.md,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
    },
}));

interface ArticleCardFooterProps {
    id: string,
    about: string | null,
    email: string,
    name: string,
    user_type: UserType,
    surname: string,
    photo: string,
    address: {
        address: string;
        country: CountryList | null;
        city: string;
        street: string;
    } | null
}

export function GuideCard({
    id,
    about,
    email,
    name,
    user_type,
    surname,
    photo,
    address,

}: ArticleCardFooterProps) {
    const { classes, theme } = useStyles();

    return (
        <Card withBorder p="lg" radius="md" className={classes.card}>
            <Card.Section mb="sm">
                <Image src={photo} alt={name} height={180} />
            </Card.Section>
            <Group mt="lg" mb={"lg"}>
                <div>
                    <Text weight={500}>{name}</Text>
                    <Text size="xs" color="dimmed">
                        {address?.country || ""}
                    </Text>
                </div>
            </Group>

            <Badge>{user_type}</Badge>

            <Text weight={700} className={classes.title} mt="xs" lineClamp={3}>
                {about}
            </Text>



            <Card.Section className={classes.footer}>
                <Group position="apart">

                    <Button href={"/guides/" + id} component={Link} fullWidth>
                        Get Info About Guide

                    </Button>
                </Group>
            </Card.Section>
        </Card>
    );
}