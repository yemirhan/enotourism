import { Tabs, Text, Title } from '@mantine/core'
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons';
import { FAQ } from './FAQ';


export const TourTabs = () => {
    return (
        <Tabs variant="pills" defaultValue="gallery">
            <Tabs.List>
                <Tabs.Tab value="gallery" icon={<IconPhoto size={14} />}>About Experience</Tabs.Tab>
                <Tabs.Tab value="messages" icon={<IconMessageCircle size={14} />}>Experience Highlights</Tabs.Tab>
                <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>Location</Tabs.Tab>
                <Tabs.Tab value="faq" icon={<IconSettings size={14} />}>FAQ</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="gallery" pt="xs">
                <Title>
                    Amazing experience
                </Title>
                <Text>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet sequi beatae non deserunt quo deleniti! Ullam temporibus culpa, dolorem est illo nobis. Consectetur veritatis, deleniti quam dolorem repudiandae doloremque in?
                </Text>
            </Tabs.Panel>

            <Tabs.Panel value="messages" pt="xs">
                Messages tab content
            </Tabs.Panel>

            <Tabs.Panel value="settings" pt="xs">
                
            </Tabs.Panel>
            <Tabs.Panel value="faq" pt="xs">
                <FAQ />
            </Tabs.Panel>
        </Tabs>
    )
}
