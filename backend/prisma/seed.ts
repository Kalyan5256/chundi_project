/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Default Admin User
  const adminEmail = 'admin@ces.org';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'SUPER_ADMIN',
      },
    });
    console.log('Super Admin user created: admin@ces.org / Admin@123');
  } else {
    console.log('Super Admin user already exists');
  }

  // 2. Create States
  const statesList = [
    'Andhra Pradesh',
    'Telangana',
    'Tamil Nadu',
    'Karnataka',
    'Kerala'
  ];

  const statesMap: { [key: string]: string } = {};

  for (const stateName of statesList) {
    const state = await prisma.state.upsert({
      where: { name: stateName },
      update: {},
      create: { name: stateName },
    });
    statesMap[stateName] = state.id;
  }
  console.log('States seeded');

  // 3. Create Sample Districts
  // AP: Visakhapatnam, Vijayawada
  // Telangana: Hyderabad, Warangal
  const apStateId = statesMap['Andhra Pradesh'];
  const tgStateId = statesMap['Telangana'];

  const vizagDistrict = await prisma.district.create({
    data: { name: 'Visakhapatnam', stateId: apStateId }
  });
  const hydDistrict = await prisma.district.create({
    data: { name: 'Hyderabad', stateId: tgStateId }
  });
  console.log('Districts seeded');

  // 4. Create Sample Institutions
  const abcCollege = await prisma.institution.create({
    data: { name: 'ABC Junior College', districtId: vizagDistrict.id }
  });
  const xyzCollege = await prisma.institution.create({
    data: { name: 'XYZ Academy of Excellence', districtId: hydDistrict.id }
  });
  console.log('Institutions seeded');

  // 5. Create Sample Trainers
  const trainer1 = await prisma.trainer.create({
    data: {
      name: 'Dr. John Doe',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
      bio: 'A veteran motivational speaker with 12 years of experience in youth mentoring.',
      missionStatement: 'Dedicated to helping students make right choices at pivotal turning points.',
      locationsCovered: 'Visakhapatnam, Vijayawada, Hyderabad',
      institutionsVisited: 'ABC Junior College, Government Boys High School, GMR Institute',
      totalStudentsTrained: 25000,
    }
  });

  const trainer2 = await prisma.trainer.create({
    data: {
      name: 'Prof. Sarah Jenkins',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      bio: 'Clinical psychologist specializing in teenage behavioural patterns and addiction prevention counseling.',
      missionStatement: 'Empowerment through education and mental clarity.',
      locationsCovered: 'Hyderabad, Warangal, Bangalore',
      institutionsVisited: 'XYZ Academy of Excellence, St. Marys Junior College, Narayana Academy',
      totalStudentsTrained: 18000,
    }
  });
  console.log('Trainers seeded');

  // 6. Create Campaigns & Images
  const campaign1 = await prisma.campaign.create({
    data: {
      year: 2024,
      institutionId: abcCollege.id,
      trainerId: trainer1.id,
      story: 'Conducted a grand drug abuse awareness campaign targeting over 500 second-year intermediate students. Visual presentation and stories of recovery were discussed.',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600' },
          { imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600' }
        ]
      }
    }
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      year: 2023,
      institutionId: xyzCollege.id,
      trainerId: trainer2.id,
      story: 'Interactive workshop on the psychological traps of substance abuse and peer-pressure coping mechanisms.',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600' }
        ]
      }
    }
  });
  console.log('Campaigns seeded');

  // 7. Seed default donation settings
  await prisma.donationSettings.create({
    data: {
      qrCodeUrl: 'https://placehold.co/300x300?text=CES+NGO+UPI+QR',
      upiId: 'ces@upi',
      bankName: 'State Bank of India',
      accountNumber: '38192837482',
      ifscCode: 'SBIN0004561',
      accountHolder: 'Chundi Educational Society',
      missionStatement: 'Your donation helps us expand our campaign coverage to rural government institutions absolutely free of cost.',
    }
  });
  console.log('Donation Settings seeded');

  // 8. Seed default Awards
  await prisma.award.create({
    data: {
      title: 'Youth Excellence Award 2024',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=300',
      category: 'NGO Recognition',
      year: 2024,
      description: 'Awarded by the State Welfare Department for outstanding contribution to student mental health and drug awareness.',
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
