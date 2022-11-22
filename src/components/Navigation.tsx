import { Navbar, Group, Code, ScrollArea, createStyles } from '@mantine/core';
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
    IconUser,
    IconBarrel,
    IconBottle
} from '@tabler/icons';
import { LinksGroup } from './LinksGroup';





const mockdata = [
    {
        label: 'Profile',
        icon: IconUser,
        initiallyOpened: true,
        links: [
            { label: 'Your Profile', link: '/dashboard/profile' },
            { label: 'Update Profile', link: '/dashboard/update_profile' },
        ],
    },
    {
        label: 'Winery',
        icon: IconBarrel,
        links: [
            { label: 'Your Wineries', link: '/dashboard/your_wineries' },
            { label: 'Create a new Winery', link: '/dashboard/create_winery' },
        ],
    },
    {
        label: 'Tours',
        icon: IconBottle,
        links: [
            { label: 'Your Tours', link: '/dashboard/tours' },
            { label: 'Create Tour', link: '/dashboard/create_tour' },
        ],
    },
    { label: 'Analytics', icon: IconPresentationAnalytics },
    { label: 'Contracts', icon: IconFileAnalytics },
    { label: 'Settings', icon: IconAdjustments },

];

const useStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0,
    },

    header: {
        padding: theme.spacing.md,
        paddingTop: 0,
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
    },

    links: {
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
    },

    linksInner: {

        paddingBottom: theme.spacing.xl,
    },

    footer: {
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
    },
}));

export function Navigation() {
    const { classes } = useStyles();
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <Navbar height={"full"} width={{ sm: 300 }} p="md" className={classes.navbar}>


            <Navbar.Section grow className={classes.links} component={ScrollArea}>
                <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>


        </Navbar>
    );
}