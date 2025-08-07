// scripts/seedDummyProperties.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1) Fetch your existing Owner user
  const owner = await prisma.user.findUnique({
    where: { email: 'roka@gmail.com' },
  });
  if (!owner) {
    console.error('❌ No user found with email "roka@gmail.com". Seed aborted.');
    process.exit(1);
  }
  console.log(`Using existing owner: ${owner.name} (${owner.id})`);

  // 2) Define 10 dummy properties
  const dummyProps = [
    {
      title:       'Sunny Midtown Apartment',
      description: 'Bright 2-bedroom apartment in the heart of the city, close to shops and parks.',
      location:    '123 Elm St, Metropolis (40.7128,-74.0060)',
      price:       2500,
      amenities:   ['WiFi', 'Air Conditioning', 'Washer/Dryer'],
      type:        'apartment',
    },
    {
      title:       'Cozy Suburban House',
      description: '3-bedroom family home with backyard, near schools and transit.',
      location:    '456 Oak Ave, Pleasantville (40.7306,-73.9352)',
      price:       3200,
      amenities:   ['Garage', 'Fireplace', 'Garden'],
      type:        'house',
    },
    {
      title:       'Modern Loft Studio',
      description: 'Open-plan studio loft with industrial finishes and river views.',
      location:    '789 River Rd, Downtown (40.7060,-74.0090)',
      price:       1800,
      amenities:   ['Elevator', 'Gym Access', 'Rooftop Deck'],
      type:        'apartment',
    },
    {
      title:       'Beachfront Bungalow',
      description: 'One-bed beach bungalow with private terrace, steps from the sand.',
      location:    '101 Ocean Blvd, Seaside (36.6002,-121.8947)',
      price:       4000,
      amenities:   ['Ocean View', 'BBQ Grill', 'Sun Deck'],
      type:        'house',
    },
    {
      title:       'Mountain Cabin Retreat',
      description: 'Rustic cabin in the woods, perfect for weekend getaways.',
      location:    '202 Pine Ln, Hilltown (39.7392,-104.9903)',
      price:       2200,
      amenities:   ['Wood Stove', 'Hiking Trails', 'Hot Tub'],
      type:        'house',
    },
    {
      title:       'Downtown Penthouse',
      description: 'Luxury penthouse with skyline views, marble baths, and concierge.',
      location:    '303 High St, Metropolis (40.7580,-73.9855)',
      price:       7500,
      amenities:   ['Concierge', 'Doorman', 'Private Elevator'],
      type:        'apartment',
    },
    {
      title:       'Historic Brownstone',
      description: 'Charming brownstone with original woodwork and modern kitchen.',
      location:    '404 Heritage Way, Oldtown (40.7282,-73.7949)',
      price:       4500,
      amenities:   ['Hardwood Floors', 'Dishwasher', 'Central Heat'],
      type:        'house',
    },
    {
      title:       'Riverside Tiny Home',
      description: 'Minimalist tiny home overlooking the river, eco-friendly.',
      location:    '505 Streamside Dr, Greensville (34.0522,-118.2437)',
      price:       1500,
      amenities:   ['Solar Power', 'Composting Toilet', 'Kayaks'],
      type:        'house',
    },
    {
      title:       'Suburban Townhouse',
      description: '2-story townhouse in a quiet cul-de-sac with community pool.',
      location:    '606 Maple Ct, Suburbia (33.7490,-84.3880)',
      price:       2800,
      amenities:   ['Pool Access', 'Community Gym', 'Patio'],
      type:        'apartment',
    },
    {
      title:       'Downtown Studio Loft',
      description: 'Compact studio with sleek design, near nightlife and cafes.',
      location:    '707 City Pkwy, Metropolis (41.8781,-87.6298)',
      price:       2000,
      amenities:   ['WiFi', 'Smart TV', 'Washer/Dryer'],
      type:        'apartment',
    }
  ];

  // 3) Insert them all
  for (const prop of dummyProps) {
    await prisma.property.create({
      data: {
        ...prop,
        userId: owner.id
      }
    });
    console.log(`✔ Created: ${prop.title}`);
  }

  console.log('\n🎉 All dummy properties have been seeded.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
