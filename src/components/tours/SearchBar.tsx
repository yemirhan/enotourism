import { Button, Group, MultiSelect, Paper, TextInput } from '@mantine/core'
import { IconActivity, IconMapPin, IconSearch } from '@tabler/icons'
import React from 'react'
const data = [
    "Albania",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Belgium",
    "Bolivia",
    "Bosnia-Herzegovina",
    "Brazil",
    "Bulgaria",
    "Canada",
    "Chile",
    "China",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Greece",
    "Hungary",
    "Israel",
    "Italy",
    "Kazakhstan",
    "Latvia",
    "Lebanon",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Mexico",
    "Moldova",
    "Montenegro",
    "Morocco",
    "Namibia",
    "Netherlands",
    "New Zealand",
    "Northern Macedonia",
    "Peru",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "Spain",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "Ukraine",
    "United Kingdom",
    "Uruguay",
    "USA",
    "Uzbekistan",
    "Vietnam"
]
const data2 = [
    { value: 'visit_tasting', label: 'Visit & Tasting' },
    { value: 'wine_guides', label: 'Wine Guides' },
    { value: 'extra_activities', label: 'Extra Activities' },
    { value: 'accomodation', label: 'Accomodation' },
    { value: 'restaurant', label: 'Restaurant' },
];

export const SearchBar = () => {
    return (
        <Paper withBorder p={"md"} >
            <Group grow spacing={"lg"}>
                <TextInput placeholder='Where do you want to go?' icon={<IconSearch size={18} />} />
                <MultiSelect
                    data={data}
                    icon={<IconMapPin size={18} />}
                    placeholder="Location"
                />
                <MultiSelect
                    data={data2}
                    icon={<IconActivity size={18} />}
                    placeholder="Activities"
                />
                <Button leftIcon={<IconSearch size={18} />}>
                    Search
                </Button>
            </Group>
        </Paper>
    )
}
