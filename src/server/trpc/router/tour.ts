import { z } from 'zod';
import { router, publicProcedure } from './../trpc';


export const tourRouter = router({
  getTours: publicProcedure.query(async ({ ctx }) => {
    const tours = await ctx.prisma.tour.findMany({
      include: {
        Winery: {
          include: {
            address: {
              include: {
                country: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          }
        }
      }
    });
    return tours;
  }),
  searchTours: publicProcedure.input(z.object({
    name: z.string(),
    countryId: z.array(z.string()),
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.tour.findMany({
      where: {
        AND: [
          {
            name: {
              contains: input.name,
            }
          },
          input.countryId.length > 0 ? {
            Winery: {
              some: {
                address: {
                  countryId: {
                    in: input.countryId
                  }
                }
              }
            }
          } : {}
        ]
      },
      include: {
        Winery: {
          include: {
            address: {
              include: {
                country: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          }
        }
      }
    });
  }),
  getTourById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const tour = await ctx.prisma.tour.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          number_of_people: true,
          startsAt: true,
          endsAt: true,
          Winery: {
            select: {
              name: true,
              id: true,
              owner: {
                select: {
                  name: true,
                  email: true,
                  id: true,
                }
              },
              address: {
                select: {
                  country: {
                    select: {
                      name: true,
                      image: true,
                    }
                  },
                }
              },
              description: true,
              _count: {
                select: {
                  Wine: true,
                }
              }
            }
          },
          tour_guide: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true,
              phone_number: true,
              photo: true,
              about: true,
              gender: true,
              Tour: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  number_of_people: true,

                  Winery: {
                    select: {
                      id: true,
                      owner: {
                        select: {
                          id: true,
                          name: true,
                        }
                      },
                      description: true,
                      name: true,
                      Wine: {
                        select: {
                          id: true,
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          offer: {
            select: {
              id: true,
              adult_price: true,
              kid_price: true,
              max_number_of_people: true,
              offer_types: true,
              price: true,
              duration: true,
              OfferTimeSlot: {
                select: {
                  startDate: true,
                  endDate: true,
                }
              }
            }
          }
        }
      });
      return tour;
    }),
})