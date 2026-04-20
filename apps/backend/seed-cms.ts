import prisma from './src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function seed() {
    const jsonPath = path.join(__dirname, '../frontend-customer/src/utils/webViewContent.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('Clearing existing data...');
    // Clear existing content in reverse order of dependencies
    await prisma.offerDetail.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.serviceDetail.deleteMany();
    await prisma.service.deleteMany();
    await prisma.cMSPageContent.deleteMany();

    console.log('Seeding Offers...');
    const offers = [
        {
            title: 'Welcome Offer',
            subtitle: 'Get 20% off on your first booking',
            code: 'WELCOME20',
            color: '#FF6B6B',
            details: {
                description: 'Enjoy a flat 20% discount on any service you book for the first time on HomeHero.',
                terms: [
                    'Valid for new users only.',
                    'Maximum discount of ₹200.',
                    'Cannot be combined with other offers.',
                ],
                faqs: [
                    { q: 'How do I use this?', a: 'Apply the code WELCOME20 at the checkout page.' },
                    { q: 'Is there a minimum booking value?', a: 'Yes, a minimum booking of ₹500 is required.' }
                ]
            }
        },
        {
            title: 'Summer Sale',
            subtitle: 'Beat the heat with 15% off on AC services',
            code: 'SUMMER15',
            color: '#4D96FF',
            details: {
                description: 'Get your AC serviced and stay cool this summer with our special discount.',
                terms: [
                    'Valid on all AC repair and servicing categories.',
                    'Valid until May 31st, 2026.',
                ],
                faqs: [
                    { q: 'Can I use it for multiple ACs?', a: 'Yes, the discount applies to the total booking amount.' }
                ]
            }
        },
        {
            title: 'Weekend Special',
            subtitle: 'Flat ₹100 off on Saturday & Sunday',
            code: 'WEEKEND100',
            color: '#6BCB77',
            details: {
                description: 'Book any service over the weekend and get an instant cashback of ₹100.',
                terms: [
                    'Valid only for bookings made and scheduled for Saturday or Sunday.',
                    'Minimum booking value ₹799.',
                ],
                faqs: [
                    { q: 'Is it valid for cleaning services?', a: 'Yes, it is valid across all service categories.' }
                ]
            }
        },
        {
            title: 'Home Deep Cleaning',
            subtitle: 'Get 25% off on Full Home Deep Cleaning',
            code: 'CLEAN25',
            color: '#FFD93D',
            details: {
                description: 'Professional deep cleaning for your entire home at unbeatable prices.',
                terms: [
                    'Valid for 2BHK and larger apartments.',
                    'Includes bathroom and kitchen deep cleaning.',
                ],
                faqs: [
                    { q: 'How long does it take?', a: 'Deep cleaning usually takes 4-6 hours depending on the house size.' }
                ]
            }
        },
        {
            title: 'Referral Bonus',
            subtitle: 'Invite friends and earn ₹50 each',
            code: 'REFER50',
            color: '#92A9BD',
            details: {
                description: 'Share the love! Invite your friends to HomeHero and earn rewards.',
                terms: [
                    'Bonus credited after friend\'s first successful booking.',
                    'Unlimited referrals allowed.',
                ],
                faqs: [
                    { q: 'When do I get the credit?', a: 'The credit is added to your wallet within 24 hours of your friend\'s booking completion.' }
                ]
            }
        }
    ];

    for (const offerData of offers) {
        const { details, ...offerBase } = offerData;
        await prisma.offer.create({
            data: {
                ...offerBase,
                details: {
                    create: {
                        content: details
                    }
                }
            }
        });
    }

    console.log('Seeding Services...');
    const services = [
        {
            name: 'Full Home Deep Cleaning',
            category: 'featured',
            icon: 'Home',
            image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?q=80&w=800&auto=format&fit=crop',
            color: '#E3F2FD',
            price: 2499,
            mrp: 3499,
            rating: 4.8,
            details: {
                description: 'Experience a spotless home with our comprehensive deep cleaning service. Every nook and corner will be professionally cleaned and sanitized.',
                benefits: [
                    'Dust-free and hygienic environment',
                    'Eco-friendly cleaning agents used',
                    'Trained and background-verified professionals',
                    'Removal of tough stains and grime'
                ],
                howItWorks: [
                    'Choose your home size (1BHK, 2BHK, etc.)',
                    'Select a convenient time slot',
                    'Our experts arrive with all necessary equipment',
                    'Thorough cleaning of all rooms, kitchen, and bathrooms'
                ],
                faqs: [
                    { q: 'Do I need to provide cleaning supplies?', a: 'No, our team brings all specialized equipment and cleaning chemicals.' },
                    { q: 'How long will it take?', a: 'Depending on the house size, it takes between 4 to 8 hours.' }
                ]
            }
        },
        {
            name: 'AC Servicing (Split)',
            category: 'featured',
            icon: 'Wind',
            image: 'https://images.unsplash.com/photo-1563200022-df7f4f469142?q=80&w=800&auto=format&fit=crop',
            color: '#F3E5F5',
            price: 599,
            mrp: 899,
            rating: 4.9,
            details: {
                description: 'Keep your AC running efficiently and save on electricity bills with our expert AC servicing.',
                benefits: [
                    'Improved cooling efficiency',
                    'Lower electricity consumption',
                    'Extended appliance lifespan',
                    'Cleaner air circulation'
                ],
                howItWorks: [
                    'Filter and cooling coil cleaning',
                    'Drain tray and pipe cleaning',
                    'Outdoor unit (condenser) jet wash',
                    'Gas pressure check and final testing'
                ],
                faqs: [
                    { q: 'What if spare parts are needed?', a: 'Spare parts are charged extra based on the rate card.' },
                    { q: 'Is gas filling included?', a: 'Gas pressure check is included, but gas charging/refilling is extra if needed.' }
                ]
            }
        },
        {
            name: 'Professional Pest Control',
            category: 'best-seller',
            icon: 'Shield',
            image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop',
            color: '#E8F5E9',
            price: 899,
            mrp: 1299,
            rating: 4.7,
            details: {
                description: 'Get rid of unwanted pests like cockroaches, ants, and termites with our odorless and safe pest control treatments.',
                benefits: [
                    'Odorless and non-toxic chemicals',
                    'Long-lasting protection',
                    'Safe for children and pets',
                    'Expert technicians'
                ],
                howItWorks: [
                    'Inspection of infested areas',
                    'Gel application and spray treatment',
                    'Sealing of entry points (if possible)',
                    'Advice on maintenance'
                ],
                faqs: [
                    { q: 'Is it safe for kids?', a: 'Yes, we use government-approved, odorless, and eco-friendly chemicals.' },
                    { q: 'Do I need to empty my kitchen?', a: 'Generally no, but some specific treatments might require clearing cabinets.' }
                ]
            }
        },
        {
            name: 'Bathroom Deep Cleaning',
            category: 'best-seller',
            icon: 'Droplets',
            image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
            color: '#FFF3E0',
            price: 499,
            mrp: 799,
            rating: 4.6,
            details: {
                description: 'Restore the shine and hygiene of your bathrooms with our intensive deep cleaning service.',
                benefits: [
                    'Removal of hard water stains',
                    'Disinfection of all surfaces',
                    'Shining of chrome fittings',
                    'Odor removal'
                ],
                howItWorks: [
                    'Cleaning of wall tiles and floor',
                    'Scrubbing of washbasin and toilet',
                    'Polishing of taps and showers',
                    'Cleaning of exhaust fan and mirror'
                ],
                faqs: [
                    { q: 'Will it remove old stains?', a: 'We use professional chemicals that remove most tough stains, though very old ones might partially remain.' }
                ]
            }
        },
        {
            name: 'Sofa Spa (4 Seater)',
            category: 'featured',
            icon: 'Layout',
            image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
            color: '#FCE4EC',
            price: 1199,
            mrp: 1599,
            rating: 4.7,
            details: {
                description: 'Give your sofa a new life with our specialized vacuuming and shampooing service.',
                benefits: [
                    'Removes dust, mites, and allergens',
                    'Stain removal (where possible)',
                    'Fresher smell and look',
                    'Fabric protection'
                ],
                howItWorks: [
                    'Dry vacuuming to remove dust',
                    'Shampoo scrubbing for deep cleaning',
                    'Wet vacuuming to extract dirt',
                    'Final grooming'
                ],
                faqs: [
                    { q: 'How long does it take to dry?', a: 'It usually takes 4-6 hours to dry completely under a ceiling fan.' }
                ]
            }
        }
    ];

    for (const serviceData of services) {
        const { details, ...serviceBase } = serviceData;
        await prisma.service.create({
            data: {
                ...serviceBase,
                details: {
                    create: {
                        content: details
                    }
                }
            }
        });
    }

    console.log('Seeding CMS content...');
    // About Page
    const about = data.about;
    const aboutHero = {
        eyebrow: about.eyebrow,
        title: about.title,
        sub: about.sub,
        tags: about.tags,
    };
    await prisma.cMSPageContent.create({
        data: {
            pageName: 'about',
            section: 'hero',
            content: aboutHero,
        },
    });

    await prisma.cMSPageContent.create({
        data: {
            pageName: 'about',
            section: 'sections',
            content: about.sections,
        },
    });

    // Privacy Page
    const privacy = data.privacy;
    const privacyHero = {
        eyebrow: privacy.eyebrow,
        sub: privacy.sub,
        badge: privacy.badge,
    };
    await prisma.cMSPageContent.create({
        data: {
            pageName: 'privacy',
            section: 'hero',
            content: privacyHero,
        },
    });

    await prisma.cMSPageContent.create({
        data: {
            pageName: 'privacy',
            section: 'items',
            content: privacy.items,
        },
    });
    
    // Terms Page
    const terms = data.terms;
    const termsHero = {
        eyebrow: terms.eyebrow,
        sub: terms.sub,
        badge: terms.badge,
    };
    await prisma.cMSPageContent.create({
        data: {
            pageName: 'terms',
            section: 'hero',
            content: termsHero,
        },
    });

    await prisma.cMSPageContent.create({
        data: {
            pageName: 'terms',
            section: 'items',
            content: terms.items,
        },
    });

    // Referral Page
    const referral = data.referral;
    const referralHero = {
        eyebrow: referral.eyebrow,
        title: referral.title,
        sub: referral.sub,
        badge: referral.badge,
    };
    await prisma.cMSPageContent.create({
        data: {
            pageName: 'referral',
            section: 'hero',
            content: referralHero,
        },
    });

    await prisma.cMSPageContent.create({
        data: {
            pageName: 'referral',
            section: 'steps',
            content: referral.steps,
        },
    });

    await prisma.cMSPageContent.create({
        data: {
            pageName: 'referral',
            section: 'terms',
            content: referral.terms,
        },
    });

    console.log('Database seeded with CMS content, Offers, and Services!');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
