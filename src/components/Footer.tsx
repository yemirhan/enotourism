import { createStyles, Container, Group, Anchor, Text, UnstyledButton } from '@mantine/core';
import { IconGlassFull } from '@tabler/icons';
import Link from 'next/link';


const useStyles = createStyles((theme) => ({
    footer: {
        
        borderTop: `1px solid ${theme.colors.gray[2]
            }`,
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    links: {
        [theme.fn.smallerThan('xs')]: {
            marginTop: theme.spacing.md,
        },
    },
    logo: {
        color: theme.colors.wine
    },
}));

interface FooterSimpleProps {
    links: { link: string; label: string }[];
}

export function Footer({ links }: FooterSimpleProps) {
    const { classes } = useStyles();
    const items = links.map((link) => (
        <Anchor
            component={Link}
            color="dimmed"
            key={link.label}
            href={link.link}
            size="sm"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className={classes.footer}>
            <Container className={classes.inner}>
                <UnstyledButton component={Link} href="/">
                    <Group>
                        <IconGlassFull className={classes.logo} size={24} />
                        <Text className={classes.logo} weight={"bold"}>Enotourism</Text>
                    </Group>
                </UnstyledButton>
                <Group className={classes.links}>{items}</Group>
            </Container>
        </div>
    );
}