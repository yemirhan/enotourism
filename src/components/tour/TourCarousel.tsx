import { useMediaQuery } from '@mantine/hooks';
import { createStyles, Paper, Text, Title, Button, useMantineTheme } from '@mantine/core';
import { Carousel } from '@mantine/carousel';

const useStyles = createStyles((theme) => ({
  card: {
    height: 440,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: 32,
    marginTop: theme.spacing.xs,
  },

  category: {
    color: theme.white,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}));

interface CardProps {
  image: string;

}

function Card({ image }: CardProps) {
  const { classes } = useStyles();

  return (
    <Paper
      shadow="md"
      radius="md"
      sx={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >

    </Paper>
  );
}



export function TourCarousel({ data = [] }: { data?: string[] }) {

  const theme = useMantineTheme();
  const slides = data.map((item) => (
    <Carousel.Slide size={"100%"} key={item}>
      <Card image={item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      sx={{
        width: "100%"
      }}
      mx="auto"
      withIndicators
      withControls
      height={440}
      slideGap="md"
      align="start"
    >
      {slides}
    </Carousel>
  );
}