import dotenv from 'dotenv';

import User from '../models/User';
import Application from '../models/Application';
import connectDB from '../config/db';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Application.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Create demo user
        const user = await User.create({
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password123',
        });

        console.log('✅ Created demo user: demo@example.com / password123');

        // Create sample applications
        const applications = [
            {
                userId: user._id,
                companyName: 'Google',
                jobTitle: 'Senior Software Engineer',
                jobPortal: 'LinkedIn',
                jobLink: 'https://linkedin.com/jobs/google-swe',
                location: 'Mountain View, CA',
                employmentType: 'Full-time',
                dateApplied: new Date('2026-01-10'),
                status: 'HR Screen',
                source: 'Job board',
                salaryRange: '$150k - $200k',
                recruiterName: 'Jane Smith',
                recruiterEmail: 'jane@google.com',
                followUpDate: new Date('2026-01-20'),
                notes: 'Excited about this opportunity. Team seems great.',
                resumeVersion: 'v2.1',
            },
            {
                userId: user._id,
                companyName: 'Microsoft',
                jobTitle: 'Frontend Developer',
                jobPortal: 'Naukri',
                location: 'Redmond, WA',
                employmentType: 'Full-time',
                dateApplied: new Date('2026-01-12'),
                status: 'Applied',
                source: 'Referral',
                salaryRange: '$130k - $170k',
                notes: 'Referred by John from college.',
                resumeVersion: 'v2.0',
            },
            {
                userId: user._id,
                companyName: 'Amazon',
                jobTitle: 'Full Stack Developer',
                jobPortal: 'Company site',
                location: 'Seattle, WA',
                employmentType: 'Full-time',
                dateApplied: new Date('2026-01-08'),
                status: 'Technical Round',
                source: 'Direct',
                salaryRange: '$140k - $180k',
                recruiterName: 'Bob Johnson',
                recruiterEmail: 'bob@amazon.com',
                recruiterPhone: '+1-555-0123',
                followUpDate: new Date('2026-01-22'),
                notes: 'Technical interview scheduled for next week.',
                resumeVersion: 'v2.1',
            },
            {
                userId: user._id,
                companyName: 'Meta',
                jobTitle: 'React Developer',
                jobPortal: 'LinkedIn',
                location: 'Menlo Park, CA',
                employmentType: 'Full-time',
                dateApplied: new Date('2026-01-15'),
                status: 'Backlog',
                source: 'Job board',
                salaryRange: '$160k - $210k',
                notes: 'Need to prepare for system design.',
                resumeVersion: 'v2.1',
            },
            {
                userId: user._id,
                companyName: 'Netflix',
                jobTitle: 'Senior Frontend Engineer',
                jobPortal: 'Glassdoor',
                location: 'Los Gatos, CA',
                employmentType: 'Full-time',
                dateApplied: new Date('2026-01-05'),
                status: 'Rejected',
                source: 'Job board',
                salaryRange: '$170k - $220k',
                notes: 'Did not move forward after initial screening.',
                resumeVersion: 'v1.9',
            },
            {
                userId: user._id,
                companyName: 'Apple',
                jobTitle: 'iOS Developer',
                jobPortal: 'LinkedIn',
                location: 'Cupertino, CA',
                employmentType: 'Full-time',
                dateApplied: new Date('2026-01-14'),
                status: 'Managerial Round',
                source: 'Recruiter',
                salaryRange: '$155k - $195k',
                recruiterName: 'Sarah Lee',
                recruiterEmail: 'sarah@apple.com',
                recruiterPhone: '+1-555-0456',
                followUpDate: new Date('2026-01-19'),
                notes: 'Manager interview went well. Waiting for feedback.',
                resumeVersion: 'v2.1',
            },
            {
                userId: user._id,
                companyName: 'Stripe',
                jobTitle: 'Full Stack Engineer',
                jobPortal: 'Foundit',
                location: 'San Francisco, CA',
                employmentType: 'Full-time',
                dateApplied: new Date('2026-01-16'),
                status: 'Applied',
                source: 'Job board',
                salaryRange: '$145k - $185k',
                notes: 'Interesting fintech company.',
                resumeVersion: 'v2.1',
            },
            {
                userId: user._id,
                companyName: 'Airbnb',
                jobTitle: 'Software Engineer',
                jobPortal: 'LinkedIn',
                location: 'San Francisco, CA',
                employmentType: 'Full-time',
                dateApplied: new Date('2026-01-11'),
                status: 'On hold',
                source: 'Job board',
                salaryRange: '$140k - $180k',
                notes: 'Hiring freeze announced.',
                resumeVersion: 'v2.0',
            },
            {
                userId: user._id,
                companyName: 'Shopify',
                jobTitle: 'Backend Developer',
                jobPortal: 'Company site',
                location: 'Remote',
                employmentType: 'Remote',
                dateApplied: new Date('2026-01-13'),
                status: 'Applied',
                source: 'Direct',
                salaryRange: '$120k - $160k',
                notes: 'Fully remote position.',
                resumeVersion: 'v2.1',
            },
            {
                userId: user._id,
                companyName: 'Uber',
                jobTitle: 'Software Engineer Intern',
                jobPortal: 'Naukri',
                location: 'San Francisco, CA',
                employmentType: 'Internship',
                dateApplied: new Date('2026-01-09'),
                status: 'Offer',
                source: 'Job board',
                salaryRange: '$8k/month',
                notes: 'Received offer! Need to respond by end of month.',
                resumeVersion: 'v2.0',
            },
        ];

        await Application.insertMany(applications);

        console.log(`✅ Created ${applications.length} sample applications`);
        console.log('\n📊 Summary:');
        console.log('   - User: demo@example.com');
        console.log('   - Password: password123');
        console.log(`   - Applications: ${applications.length}`);
        console.log('\n🎉 Seed completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
