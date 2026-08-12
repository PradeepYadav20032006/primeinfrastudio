// Seeds the database with an initial admin user and sample content.
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');

const run = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL;
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'ChangeMe@123',
      role: 'admin',
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        title: 'Residential Construction',
        shortDescription: 'End-to-end home building services with quality craftsmanship.',
        fullDescription:
          'From foundation to finishing, we build homes that stand the test of time, combining structural integrity with contemporary design sensibilities.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
        icon: 'Home',
        features: ['Custom Home Design', 'Structural Engineering', 'Quality Materials', 'On-time Delivery'],
        startingPrice: '₹1,800/sq.ft',
        order: 1,
      },
      {
        title: 'Commercial Construction',
        shortDescription: 'Office spaces, retail units and industrial facilities built to scale.',
        fullDescription:
          'We deliver commercial construction projects that balance functionality, compliance, and modern aesthetics for businesses of every size.',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200',
        icon: 'Building2',
        features: ['Office Buildings', 'Retail Spaces', 'Warehouses', 'Regulatory Compliance'],
        startingPrice: '₹2,200/sq.ft',
        order: 2,
      },
      {
        title: 'Interior Design',
        shortDescription: 'Bespoke interiors that reflect your personality and lifestyle.',
        fullDescription:
          'Our interior design team crafts spaces that are as functional as they are beautiful, using premium materials and thoughtful spatial planning.',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200',
        icon: 'Sofa',
        features: ['Space Planning', '3D Visualization', 'Custom Furniture', 'Lighting Design'],
        startingPrice: '₹950/sq.ft',
        order: 3,
      },
      {
        title: 'Renovation & Remodeling',
        shortDescription: 'Transform existing spaces into modern, functional environments.',
        fullDescription:
          'We breathe new life into old structures through careful planning, modern materials, and minimal disruption to your daily routine.',
        image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200',
        icon: 'Hammer',
        features: ['Kitchen Remodeling', 'Bathroom Upgrades', 'Structural Repairs', 'Facade Renewal'],
        startingPrice: '₹700/sq.ft',
        order: 4,
      },
    ]);
    console.log('Sample services created.');
  }

  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: 'Serene Villa, Baner',
        category: 'Residential',
        location: 'Baner, Pune',
        clientName: 'Mr. R. Deshmukh',
        description: 'A 4500 sq.ft luxury villa featuring minimalist architecture and an open courtyard design.',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'],
        area: '4500 sq.ft',
        duration: '10 months',
        status: 'Completed',
        featured: true,
        tags: ['villa', 'luxury', 'residential'],
      },
      {
        title: 'Horizon Business Park',
        category: 'Commercial',
        location: 'Hinjewadi, Pune',
        clientName: 'Horizon Corp',
        description: 'A modern 6-storey commercial complex with energy-efficient systems and flexible office layouts.',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
        images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'],
        area: '85000 sq.ft',
        duration: '18 months',
        status: 'Completed',
        featured: true,
        tags: ['commercial', 'office'],
      },
      {
        title: 'Minimalist Penthouse Interiors',
        category: 'Interior Design',
        location: 'Koregaon Park, Pune',
        clientName: 'Mrs. A. Kulkarni',
        description: 'A warm, minimalist interior scheme for a 3200 sq.ft penthouse with custom joinery throughout.',
        coverImage: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200',
        images: ['https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200'],
        area: '3200 sq.ft',
        duration: '5 months',
        status: 'Completed',
        featured: true,
        tags: ['interior', 'penthouse'],
      },
    ]);
    console.log('Sample projects created.');
  }

  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany([
      {
        clientName: 'Rohan Deshmukh',
        clientRole: 'Homeowner, Baner',
        rating: 5,
        message: 'PrimeInfraStudio transformed our vision into a stunning reality. Their attention to detail is unmatched.',
        isFeatured: true,
      },
      {
        clientName: 'Anjali Kulkarni',
        clientRole: 'Business Owner, Koregaon Park',
        rating: 5,
        message: 'Professional, punctual, and genuinely talented. Our penthouse interiors exceeded expectations.',
        isFeatured: true,
      },
    ]);
    console.log('Sample testimonials created.');
  }

  console.log('Seeding complete.');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
