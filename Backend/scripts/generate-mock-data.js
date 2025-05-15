const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
    const users = [];
    // 1. Generate 1000 users (or as many as you want)
    for (let i = 0; i < 1000; i++) {
        users.push(await prisma.user.create({
            data: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                birthDate: faker.date.birthdate({ min: 1950, max: 2005, mode: 'year' }),
                username: faker.internet.userName() + faker.string.alphanumeric(5),
                password: faker.internet.password()
            }
        }));
    }

    // 2. Generate 100,000+ cars, each assigned to a random user
    for (let i = 0; i < 100000; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        await prisma.car.create({
            data: {
                carBrand: faker.vehicle.manufacturer(),
                carModel: faker.vehicle.model(),
                year: faker.number.int({ min: 1990, max: 2025 }),
                insuranceValidity: faker.date.future({ years: 2 }),
                roadTaxValidity: faker.date.future({ years: 2 }),
                technicalInspectionValidity: faker.date.future({ years: 3 }),
                userId: user.id
            }
        });
        if (i % 1000 === 0) console.log(`Inserted ${i} cars`);
    }
}

main()
    .then(() => {
        console.log('Mock data inserted!');
        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
