import { createStyles, Card, Image, ActionIcon, Group, Text, Avatar, Badge, Button } from '@mantine/core';
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
    image: string;
    category: string;
    title: string;
    footer: string;
    id: string;
    author: {
        name: string;
        description: string;
        image: string;
    };
}

export function GuideCard({
    image,
    category,
    id,
    title,
    footer,
    author,
}: ArticleCardFooterProps) {
    const { classes, theme } = useStyles();

    return (
        <Card withBorder p="lg" radius="md" className={classes.card}>
            <Card.Section mb="sm">
                <Image src={author.image} alt={title} height={180} />
            </Card.Section>
            <Group mt="lg" mb={"lg"}>
                <div>
                    <Text weight={500}>{author.name}</Text>
                    <Text size="xs" color="dimmed">
                        {author.description}
                    </Text>
                </div>
            </Group>

            <Badge>{category}</Badge>

            <Text weight={700} className={classes.title} mt="xs" lineClamp={3}>
                {title}
            </Text>



            <Card.Section className={classes.footer}>
                <Group position="apart">

                    <Button href={"/guides/" + id} component={Link} fullWidth>
                        Check Out Tours

                    </Button>
                </Group>
            </Card.Section>
        </Card>
    );
}