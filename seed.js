require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./src/models/Doctor.model');

const doctors = [
  {
    name: 'Asst. Prof. Dr. Md. Zahidul Islam',
    qualification: 'MBBS, BCS (Health), MD (Pediatrics)',
    specialty: 'Pediatrics',
    badge: 'Child Specialist',
    image: 'https://i.pravatar.cc/150?img=11',
    experience: '19',
    hospital: 'MOHFW(DHAKA), Shaheed Suhrawardy Medical College',
    location: 'Dhaka',
    fee: 450,
    originalFee: 700,
    rating: 5,
    reviews: 1739,
    visits: 6168,
    isOnline: true,
    availability: ['09:00 AM - 12:00 PM', '04:00 PM - 07:00 PM'],
    description: 'Experienced pediatrician specializing in child health care and preventive medicine.'
  },
  {
    name: 'Dr. Mithun Sarker',
    qualification: 'MBBS, BCS (Health), DCH (Pediatrics)',
    specialty: 'Pediatrics',
    badge: 'Child Specialist',
    image: 'https://i.pravatar.cc/150?img=12',
    experience: '12',
    hospital: 'Shaheed Suhrawardy Medical College Hospital',
    location: 'Dhaka',
    fee: 400,
    originalFee: null,
    rating: 5,
    reviews: 3038,
    visits: 10344,
    isOnline: true,
    availability: ['10:00 AM - 01:00 PM', '05:00 PM - 08:00 PM'],
    description: 'Dedicated child specialist with over 12 years of clinical experience.'
  },
  {
    name: 'Dr. Joysree Karmaker',
    qualification: 'MBBS, FCPS (Pediatrics)',
    specialty: 'Pediatrics',
    badge: 'Child Specialist',
    image: 'https://i.pravatar.cc/150?img=32',
    experience: '9',
    hospital: 'Anwer Khan Modern Medical College Hospital',
    location: 'Dhaka',
    fee: 550,
    originalFee: null,
    rating: 5,
    reviews: 3452,
    visits: 11256,
    isOnline: true,
    availability: ['09:00 AM - 12:00 PM', '03:00 PM - 06:00 PM'],
    description: 'Highly rated pediatrician known for patient-centered child care.'
  },
  {
    name: "Dr. Anisul Haque",
    qualification: 'MBBS, MD (Cardiology)',
    specialty: "Cardiology",
    badge: 'Heart Specialist',
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    experience: "15",
    hospital: "Square Hospital",
    location: "Panthapath, Dhaka",
    fee: 1500,
    originalFee: 2000,
    rating: 4.8,
    reviews: 452,
    visits: 2100,
    isOnline: true,
    availability: ["10:00 AM - 01:00 PM", "06:00 PM - 09:00 PM"],
    description: "Expert in treating heart diseases and performing complex cardiovascular surgeries."
  },
  {
    name: "Dr. Farzana Rahman",
    qualification: 'MBBS, FCPS (Neurology)',
    specialty: "Neurology",
    badge: 'Neuro Specialist',
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    experience: "10",
    hospital: "Evercare Hospital",
    location: "Bashundhara R/A, Dhaka",
    fee: 1200,
    originalFee: 1500,
    rating: 4.6,
    reviews: 320,
    visits: 1800,
    isOnline: true,
    availability: ["09:00 AM - 01:00 PM", "05:00 PM - 08:00 PM"],
    description: "Specialized in treating neurological disorders, including migraines and epilepsy."
  },
  {
    name: "Dr. MD. Hasan Mahmud",
    qualification: 'MBBS, DDV, MD',
    specialty: "Dermatology",
    badge: 'Skin Specialist',
    image: "https://randomuser.me/api/portraits/men/86.jpg",
    experience: "8",
    hospital: "Labaid Specialized Hospital",
    location: "Dhanmondi, Dhaka",
    fee: 1000,
    originalFee: 1200,
    rating: 4.5,
    reviews: 670,
    visits: 3400,
    isOnline: true,
    availability: ["11:00 AM - 03:00 PM", "08:00 PM - 10:00 PM"],
    description: "Highly experienced in skincare, acne treatment, and laser therapy."
  },
  {
    name: "Dr. Tariqul Islam",
    qualification: 'MBBS, MS (Ortho)',
    specialty: "Orthopedic",
    badge: 'Bone & Joint Specialist',
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    experience: "20",
    hospital: "BIRDEM General Hospital",
    location: "Shahbagh, Dhaka",
    fee: 800,
    originalFee: 1000,
    rating: 4.3,
    reviews: 590,
    visits: 2900,
    isOnline: false,
    availability: ["04:00 PM - 09:00 PM"],
    description: "Expert in bone and joint surgery, sports injuries, and rehabilitation."
  },
  {
    name: "Dr. Nuzhat Fatima",
    qualification: 'MBBS, FCPS (Obs & Gynae)',
    specialty: "Gynae & Obs",
    badge: 'Women Health Specialist',
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    experience: "14",
    hospital: "Ibn Sina Hospital",
    location: "Dhanmondi, Dhaka",
    fee: 1000,
    originalFee: 1200,
    rating: 4.7,
    reviews: 810,
    visits: 4100,
    isOnline: true,
    availability: ["10:00 AM - 04:00 PM"],
    description: "Specialist in women's reproductive health and maternal care."
  },
  {
    name: "Dr. Rafiqul Alam",
    qualification: 'MBBS, MD (Gastroenterology)',
    specialty: "Gastroenterology",
    badge: 'Liver & Gastro Specialist',
    image: "https://randomuser.me/api/portraits/men/29.jpg",
    experience: "18",
    hospital: "Dhaka Medical College Hospital",
    location: "Bakshibazar, Dhaka",
    fee: 500,
    originalFee: 700,
    rating: 4.2,
    reviews: 410,
    visits: 1950,
    isOnline: true,
    availability: ["12:00 PM - 06:00 PM"],
    description: "Expert in digestive system disorders and endoscopic procedures."
  },
  {
    name: "Dr. Salma Begum",
    qualification: 'MBBS, DO (Eye)',
    specialty: "Ophthalmology",
    badge: 'Eye Specialist',
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    experience: "9",
    hospital: "Islamia Eye Hospital",
    location: "Farmgate, Dhaka",
    fee: 700,
    originalFee: null,
    rating: 4.4,
    reviews: 250,
    visits: 1200,
    isOnline: false,
    availability: ["09:00 AM - 02:00 PM"],
    description: "Specialized in eye care, vision correction, and cataract surgeries."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing doctors to prevent duplicates
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    await Doctor.insertMany(doctors);
    console.log('Seeding complete');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
