import prisma from './src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function seed() {
    const jsonPath = path.join(__dirname, '../frontend-customer/src/utils/webViewContent.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Clear existing content
    await prisma.cMSPageContent.deleteMany();

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

    console.log('Database seeded with CMS content!');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
