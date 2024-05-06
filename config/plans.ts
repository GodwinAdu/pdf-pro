export const PLANS = [
    {
      name: 'Free',
      slug: 'free',
      quota: 3,
      pagesPerPdf:5,
      price: {
        amount: 0,
        priceIds: {
          test: '',
          production: '',
        },
      },
    },
    {
      name: 'Pro',
      slug: 'pro',
      quota: 20,
      pagesPerPdf: 20,
      price: {
        amount: 100,
        priceIds: {
          test: 'price_1NuEwTA19umTXGu8MeS3hN8L',
          production: '',
        },
      },
    },
    {
      name: 'Forever',
      slug: 'forever',
      quota: 50,
      pagesPerPdf: 100,
      price: {
        amount: 0,
        priceIds: {
          test: 'price_1NuEwTA19umTXGu8MeS3hN8L',
          production: '',
        },
      },
    },
  ]
  