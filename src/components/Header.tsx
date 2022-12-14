import {
    createStyles,
    Menu,
    Center,
    Header as MantineHeader,
    Container,
    Group,
    Button,
    Burger,
    Text,
    Box,
    UnstyledButton,
    Loader,
    Avatar,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBarrel, IconBottle, IconCalendarEvent, IconChevronDown, IconGlassFull, IconHeart, IconLogout, IconMessage, IconPlayerPause, IconSettings, IconStar, IconSwitchHorizontal, IconTrash, IconUser } from '@tabler/icons';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';


const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    inner: {
        height: HEADER_HEIGHT,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.white,
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colors.gray[9],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colors.gray[0],
        },
    },
    linkSelected: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.white,
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
        backgroundColor: theme.colors?.wine?.[6]
    },

    linkLabel: {
        marginRight: 5,
    },
    logo: {
        color: theme.colors.wine
    },
    header: {
        paddingTop: theme.spacing.sm,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
            }`,
        marginBottom: 120,
    },

    mainSection: {
        paddingBottom: theme.spacing.sm,
    },

    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },

        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    tabs: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    tabsList: {
        borderBottom: '0 !important',
    },

    tab: {
        fontWeight: 500,
        height: 38,
        backgroundColor: 'transparent',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        },

        '&[data-active]': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
        },
    },
}));

interface HeaderActionProps {
    links: { link: string; label: string; links?: { link: string; label: string }[] }[];
}

export function Header({ links }: HeaderActionProps) {
    const { classes } = useStyles();
    const session = useSession()
    const [opened, { toggle }] = useDisclosure(false);
    const router = useRouter();
    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item component={Link} href={item.link} key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" exitTransitionDuration={0}>
                    <Menu.Target>
                        <Link
                            href={link.link}
                            className={classes.link}
                        >
                            <Center>
                                <span className={classes.linkLabel}>{link.label}</span>
                                <IconChevronDown size={12} stroke={1.5} />
                            </Center>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link
                key={link.label}
                href={link.link}
                className={router.pathname.includes(link.link) ? classes.linkSelected : classes.link}

            >
                {link.label}
            </Link>
        );
    });

    return (
        <MantineHeader withBorder height={HEADER_HEIGHT} mb={120}>
            <Container className={classes.inner} fluid>
                <UnstyledButton component={Link} href="/">
                    <Group>
                        <IconGlassFull className={classes.logo} size={24} />
                        <Text className={classes.logo} weight={"bold"}>Enotourism</Text>
                    </Group>
                </UnstyledButton>
                {/* <Group>
                    <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
                </Group> */}
                <Group spacing={5} className={classes.links}>
                    {items}
                </Group>
                {
                    session.data?.user ?
                        <RightSideSignedIn />
                        :
                        <RightSideSignedOut />
                }

            </Container>
        </MantineHeader>
    );
}

const RightSideSignedIn = () => {
    const session = useSession()
    const { classes, theme, cx } = useStyles();
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    return (
        (session.status === "loading") ? <Loader size={30} /> : <Menu
            width={260}
            position="bottom-end"
            transition="pop-top-right"
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
        >
            <Menu.Target>
                <UnstyledButton
                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                    <Group spacing={7}>
                        <Avatar src={session.data?.user?.image || ""} alt={"profile_photo"} radius="xl" size={20} />
                        <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                            {session.data?.user?.name || "User"}
                        </Text>
                        <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item component={Link} href="/dashboard/profile" icon={<IconUser size={14} stroke={1.5} />}>
                    Your Profile
                </Menu.Item>
                {session.data?.user?.user_type === "WINERY" ? <>
                    <Menu.Item component={Link} href="/dashboard/your_wineries" icon={<IconBarrel size={14} stroke={1.5} />}>
                        Your Wineries
                    </Menu.Item>
                    <Menu.Item component={Link} href="/dashboard/bookings" icon={<IconCalendarEvent size={14} stroke={1.5} />}>
                        Bookings
                    </Menu.Item>
                </> : null}
                {session.data?.user?.user_type === "GUIDE" ? <>
                    <Menu.Item component={Link} href="/dashboard/tours" icon={<IconBottle size={14} stroke={1.5} />}>
                        Your Tours
                    </Menu.Item>
                    <Menu.Item component={Link} href="/dashboard/bookings" icon={<IconCalendarEvent size={14} stroke={1.5} />}>
                        Bookings
                    </Menu.Item>
                </> : null}


                <Menu.Label>Settings</Menu.Label>
                <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>Account Settings</Menu.Item>

                <Menu.Item onClick={() => {
                    signOut({
                        callbackUrl: "/login"
                    })
                }} icon={<IconLogout size={14} stroke={1.5} />}>Logout</Menu.Item>


            </Menu.Dropdown>
        </Menu>
    )
}

const RightSideSignedOut = () => {
    const session = useSession()

    return (
        session.status === "loading" ? <Loader size={30} /> : <Button size='md' component={Link} href="/login" radius="xl" sx={{ height: 30 }}>
            Log In
        </Button>
    )
}