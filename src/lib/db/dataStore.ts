import fs from "fs";
import path from "path";
import {
  UserProfile,
  Institution,
  CandidateProfile,
  Category,
  SeminarOffering,
  AvailabilitySlot,
  SeminarRequirement,
  Booking,
  PaymentRecord,
  NotificationItem,
  ConversationMessage,
  ReviewItem,
  PlatformSettings,
  BookingStatus,
} from "../types";
import { calculateDistanceKm, getCoordinatesForCity } from "../geo";

interface DatabaseState {
  users: (UserProfile & { passwordHash?: string })[];
  institutions: Institution[];
  candidates: CandidateProfile[];
  categories: Category[];
  offerings: SeminarOffering[];
  availabilitySlots: AvailabilitySlot[];
  requirements: SeminarRequirement[];
  bookings: Booking[];
  payments: PaymentRecord[];
  notifications: NotificationItem[];
  messages: ConversationMessage[];
  favorites: { id: string; principalId: string; candidateId: string; createdAt: string }[];
  reviews: ReviewItem[];
  settings: PlatformSettings;
  auditLogs: {
    id: string;
    adminId: string;
    action: string;
    targetType: string;
    targetId: string;
    details?: any;
    createdAt: string;
  }[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "seminar_connect_db.json");

// Default initial dataset
const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "C and C++ Programming",
    slug: "c-cpp-programming",
    description: "Systems programming, memory management, data structures, pointers, and modern C++ standards.",
    iconName: "Terminal",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "cat-2",
    name: "HTML, CSS, JavaScript, and Web Development",
    slug: "web-development",
    description: "Modern responsive web development, React, Next.js, frontend tooling, and full-stack architecture.",
    iconName: "Globe",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "cat-3",
    name: "Python, Java, and App Development",
    slug: "python-java-app-dev",
    description: "Enterprise Java, Python scripting, OOP paradigms, Android/iOS mobile development.",
    iconName: "Code",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "cat-4",
    name: "Artificial Intelligence and Machine Learning",
    slug: "ai-machine-learning",
    description: "Deep learning, LLMs, neural networks, computer vision, and applied ML for real-world solutions.",
    iconName: "Cpu",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "cat-5",
    name: "Data Science and Cybersecurity",
    slug: "data-science-cybersecurity",
    description: "Statistical computing, Big Data, ethical hacking, network defense, and zero-trust security.",
    iconName: "Shield",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: "cat-6",
    name: "Robotics and Internet of Things",
    slug: "robotics-iot",
    description: "Microcontrollers (Arduino, ESP32, Raspberry Pi), sensor integration, autonomous robotics.",
    iconName: "Bot",
    displayOrder: 6,
    isActive: true,
  },
  {
    id: "cat-7",
    name: "Science and Mathematics",
    slug: "science-mathematics",
    description: "Vedic math, olympiad preparation, physics demonstrations, calculus intuition, and STEM pedagogy.",
    iconName: "Atom",
    displayOrder: 7,
    isActive: true,
  },
  {
    id: "cat-8",
    name: "Career Guidance and Interview Preparation",
    slug: "career-guidance",
    description: "Tech interview coding rounds, resume crafting, campus placement readiness, and corporate expectations.",
    iconName: "Compass",
    displayOrder: 8,
    isActive: true,
  },
  {
    id: "cat-9",
    name: "Communication and Personality Development",
    slug: "communication-personality",
    description: "Public speaking, debate mastery, body language, executive presence, and business English.",
    iconName: "MessageSquare",
    displayOrder: 9,
    isActive: true,
  },
  {
    id: "cat-10",
    name: "Entrepreneurship and Financial Literacy",
    slug: "entrepreneurship-finance",
    description: "Student startup ideation, pitching, personal budgeting, taxation basics, and venture funding.",
    iconName: "TrendingUp",
    displayOrder: 10,
    isActive: true,
  },
  {
    id: "cat-11",
    name: "Digital Marketing and Design",
    slug: "digital-marketing-design",
    description: "UI/UX design principles, Figma, SEO optimization, social media storytelling, and content strategy.",
    iconName: "Palette",
    displayOrder: 11,
    isActive: true,
  },
  {
    id: "cat-12",
    name: "Other Custom Topics",
    slug: "custom-topics",
    description: "Specialized academic, research, creative arts, and multidisciplinary educational sessions.",
    iconName: "Sparkles",
    displayOrder: 12,
    isActive: true,
  },
];

const INITIAL_USERS: (UserProfile & { passwordHash?: string })[] = [
  {
    id: "user-admin",
    email: "admin@seminarconnect.com",
    role: "admin",
    fullName: "Central Administrator",
    phone: "+91 98100 12345",
    bio: "Chief Academic Officer & Platform Administrator at SeminarConnect Directorate.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "user-principal-1",
    email: "principal@dps-delhi.edu",
    role: "principal",
    fullName: "Dr. Rajesh Sharma",
    phone: "+91 98111 22334",
    bio: "Principal at Delhi Public School R.K. Puram with 22 years of educational leadership.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "user-principal-2",
    email: "dean@national-college.edu",
    role: "principal",
    fullName: "Dr. Meenakshi Sundaram",
    phone: "+91 98450 44556",
    bio: "Dean of Academic Affairs at National College of Engineering & Technology, Bengaluru.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "user-speaker-1",
    email: "ananya.ai@seminarconnect.com",
    role: "candidate",
    fullName: "Dr. Ananya Roy",
    phone: "+91 98200 33445",
    bio: "Ex-IISc Artificial Intelligence Researcher and Senior Data Scientist. Specialized in Generative AI, PyTorch, and empowering students to build ethical machine learning models.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    createdAt: "2026-01-05T00:00:00Z",
    updatedAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "user-speaker-2",
    email: "vikram.iot@seminarconnect.com",
    role: "candidate",
    fullName: "Vikramaditya Verma",
    phone: "+91 98188 77665",
    bio: "IIT Delhi Mechatronics alumnus, hardware maker, and founder of EdTech STEM Robotics Lab. Hands-on workshop facilitator with 100+ school and college sessions conducted.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    createdAt: "2026-01-08T00:00:00Z",
    updatedAt: "2026-01-08T00:00:00Z",
  },
  {
    id: "user-speaker-3",
    email: "priya.career@seminarconnect.com",
    role: "candidate",
    fullName: "Priya Nair",
    phone: "+91 97690 99887",
    bio: "Former Talent Acquisition Lead at Microsoft & Amazon, certified career counselor, and corporate communications coach. Helping students bridge academia to tier-1 industry careers.",
    avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80",
    createdAt: "2026-01-12T00:00:00Z",
    updatedAt: "2026-01-12T00:00:00Z",
  },
  {
    id: "user-speaker-4",
    email: "siddharth.dev@seminarconnect.com",
    role: "candidate",
    fullName: "Siddharth Sengupta",
    phone: "+91 98220 11223",
    bio: "Staff Software Engineer and open-source contributor. Specializes in modern Next.js, C++, low-latency backend architectures, and high-performance algorithms.",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    createdAt: "2026-01-18T00:00:00Z",
    updatedAt: "2026-01-18T00:00:00Z",
  },
  {
    id: "user-speaker-5",
    email: "rajeshwari.math@seminarconnect.com",
    role: "candidate",
    fullName: "Prof. Rajeshwari Sundaram",
    phone: "+91 94440 55667",
    bio: "Mathematics educator with 15+ years experience mentoring Olympiad scholars. Creator of the 'Speed Math & Intuitive Geometry' pedagogy.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "user-speaker-6",
    email: "aditya.sec@seminarconnect.com",
    role: "candidate",
    fullName: "Aditya Kulkarni",
    phone: "+91 98490 88776",
    bio: "Certified Ethical Hacker (CEH, OSCP) and enterprise red-teamer. Passionate about cyber safety, secure web practices, and threat modeling for colleges.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    createdAt: "2026-01-25T00:00:00Z",
    updatedAt: "2026-01-25T00:00:00Z",
  },
];

const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: "inst-1",
    profileId: "user-principal-1",
    institutionName: "Delhi Public School R.K. Puram",
    institutionType: "School",
    address: "Sector XII, R.K. Puram",
    city: "New Delhi",
    district: "South West Delhi",
    state: "Delhi",
    postalCode: "110022",
    latitude: 28.5678,
    longitude: 77.1725,
    website: "https://dpsrkp.net",
    verificationStatus: "approved",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "inst-2",
    profileId: "user-principal-2",
    institutionName: "National College of Engineering & Technology",
    institutionType: "College",
    address: "Kengeri Satellite Town",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    postalCode: "560060",
    latitude: 12.915,
    longitude: 77.485,
    website: "https://ncet-edu.in",
    verificationStatus: "approved",
    createdAt: "2026-01-15T00:00:00Z",
  },
];

const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: "cand-1",
    profileId: "user-speaker-1",
    professionalTitle: "Lead AI Researcher & ML Architect",
    experienceYears: 9,
    highestQualification: "Ph.D. in Computer Science & Artificial Intelligence (IISc Bengaluru)",
    baseSeminarFee: 12000,
    travelRadiusKm: 250,
    preferredDeliveryFormat: "hybrid",
    address: "HSR Layout, Sector 2",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    postalCode: "560102",
    latitude: 12.9121,
    longitude: 77.6446,
    bioVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    resumeUrl: "/docs/ananya_roy_cv.pdf",
    verificationStatus: "approved",
    verifiedAt: "2026-01-10T00:00:00Z",
    ratingAvg: 4.95,
    reviewsCount: 28,
    isFeatured: true,
    languages: ["English", "Hindi", "Bengali"],
    skills: ["Artificial Intelligence", "Machine Learning", "Python", "Deep Learning", "LLMs", "PyTorch"],
    createdAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "cand-2",
    profileId: "user-speaker-2",
    professionalTitle: "Robotics Engineer & Embedded Systems Expert",
    experienceYears: 7,
    highestQualification: "M.Tech in Mechatronics (IIT Delhi)",
    baseSeminarFee: 9500,
    travelRadiusKm: 150,
    preferredDeliveryFormat: "hybrid",
    address: "Hauz Khas",
    city: "New Delhi",
    district: "South Delhi",
    state: "Delhi",
    postalCode: "110016",
    latitude: 28.5494,
    longitude: 77.2001,
    verificationStatus: "approved",
    verifiedAt: "2026-01-12T00:00:00Z",
    ratingAvg: 4.88,
    reviewsCount: 19,
    isFeatured: true,
    languages: ["English", "Hindi"],
    skills: ["Robotics", "Internet of Things", "Arduino", "ESP32", "C++", "Sensors"],
    createdAt: "2026-01-08T00:00:00Z",
  },
  {
    id: "cand-3",
    profileId: "user-speaker-3",
    professionalTitle: "Executive Career Strategist & Soft Skills Coach",
    experienceYears: 11,
    highestQualification: "MBA in Human Resources (XLRI Jamshedpur)",
    baseSeminarFee: 8000,
    travelRadiusKm: 100,
    preferredDeliveryFormat: "hybrid",
    address: "Bandra West",
    city: "Mumbai",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    postalCode: "400050",
    latitude: 19.0596,
    longitude: 72.8295,
    verificationStatus: "approved",
    verifiedAt: "2026-01-15T00:00:00Z",
    ratingAvg: 4.92,
    reviewsCount: 34,
    isFeatured: true,
    languages: ["English", "Hindi", "Marathi"],
    skills: ["Career Guidance", "Campus Placement", "Communication", "Resume Crafting", "Interview Prep"],
    createdAt: "2026-01-12T00:00:00Z",
  },
  {
    id: "cand-4",
    profileId: "user-speaker-4",
    professionalTitle: "Staff Software Engineer & Web Architect",
    experienceYears: 8,
    highestQualification: "B.Tech in Computer Science & Engineering (COEP Pune)",
    baseSeminarFee: 11000,
    travelRadiusKm: 200,
    preferredDeliveryFormat: "hybrid",
    address: "Kothrud",
    city: "Pune",
    district: "Pune",
    state: "Maharashtra",
    postalCode: "411038",
    latitude: 18.5074,
    longitude: 73.8077,
    verificationStatus: "approved",
    verifiedAt: "2026-01-20T00:00:00Z",
    ratingAvg: 4.85,
    reviewsCount: 14,
    isFeatured: false,
    languages: ["English", "Hindi", "Marathi"],
    skills: ["React", "Next.js", "C and C++ Programming", "TypeScript", "Node.js", "System Design"],
    createdAt: "2026-01-18T00:00:00Z",
  },
  {
    id: "cand-5",
    profileId: "user-speaker-5",
    professionalTitle: "Vedic Mathematics & STEM Pedagogy Specialist",
    experienceYears: 15,
    highestQualification: "M.Sc., M.Phil in Applied Mathematics (Madras University)",
    baseSeminarFee: 6500,
    travelRadiusKm: 100,
    preferredDeliveryFormat: "hybrid",
    address: "Mylapore",
    city: "Chennai",
    district: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600004",
    latitude: 13.0336,
    longitude: 80.2678,
    verificationStatus: "approved",
    verifiedAt: "2026-01-22T00:00:00Z",
    ratingAvg: 4.98,
    reviewsCount: 42,
    isFeatured: true,
    languages: ["English", "Tamil", "Hindi"],
    skills: ["Mathematics", "Vedic Math", "Olympiad Prep", "Speed Calculation", "STEM"],
    createdAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "cand-6",
    profileId: "user-speaker-6",
    professionalTitle: "Lead Cybersecurity Specialist & Ethical Hacker",
    experienceYears: 6,
    highestQualification: "Certified Ethical Hacker (CEH, OSCP)",
    baseSeminarFee: 10500,
    travelRadiusKm: 120,
    preferredDeliveryFormat: "online",
    address: "Madhapur, HITEC City",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    postalCode: "500081",
    latitude: 17.4483,
    longitude: 78.3915,
    verificationStatus: "approved",
    verifiedAt: "2026-01-28T00:00:00Z",
    ratingAvg: 4.82,
    reviewsCount: 11,
    isFeatured: false,
    languages: ["English", "Telugu", "Hindi"],
    skills: ["Cybersecurity", "Ethical Hacking", "Network Defense", "Data Science", "Python"],
    createdAt: "2026-01-25T00:00:00Z",
  },
];

const INITIAL_OFFERINGS: SeminarOffering[] = [
  {
    id: "off-1",
    candidateId: "cand-1",
    title: "Demystifying Artificial Intelligence & Prompt Engineering",
    categoryId: "cat-4",
    description:
      "A fast-paced, interactive seminar that demystifies modern neural networks, large language models (LLMs), and practical generative AI. Students will build hands-on prompts, learn ethical AI concepts, and explore career roadmaps in machine learning.",
    learningOutcomes: [
      "Understand the mechanics of Large Language Models and Generative AI",
      "Master systematic prompt engineering techniques for research & coding",
      "Grasp ethical AI, data privacy considerations, and hallucination mitigation",
      "Map out high-impact careers and university specializations in AI",
    ],
    targetAudience: "High School (Class 9-12) & Undergraduate Engineering Students",
    sessionDurationMinutes: 120,
    maxAudienceSize: 200,
    deliveryFormat: "hybrid",
    basePrice: 12000,
    travelChargePerKm: 15,
    isActive: true,
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "off-2",
    candidateId: "cand-1",
    title: "Applied Machine Learning with Python: Zero to Neural Networks",
    categoryId: "cat-4",
    description:
      "Comprehensive workshop covering data preprocessing, model selection with Scikit-Learn, and introductory neural networks with PyTorch. Designed for computer science departments and tech clubs.",
    learningOutcomes: [
      "Feature engineering and exploratory data analysis using Pandas and NumPy",
      "Supervised vs Unsupervised learning algorithms applied to real datasets",
      "Training your first image classification model in PyTorch",
    ],
    targetAudience: "B.Tech / B.Sc Computer Science & Data Science Students",
    sessionDurationMinutes: 180,
    maxAudienceSize: 100,
    deliveryFormat: "hybrid",
    basePrice: 15000,
    travelChargePerKm: 18,
    isActive: true,
    createdAt: "2026-01-12T00:00:00Z",
  },
  {
    id: "off-3",
    candidateId: "cand-2",
    title: "Hands-on Microcontrollers & IoT Prototyping Workshop",
    categoryId: "cat-6",
    description:
      "Live demonstration with ESP32 and Arduino microcontrollers. Covers sensor telemetry, Wi-Fi connectivity, cloud MQTT dashboards, and building smart automation gadgets.",
    learningOutcomes: [
      "Interfacing GPIO sensors (ultrasonic, temperature, IR) with microcontrollers",
      "Writing embedded C/C++ firmware and debugging serial communication",
      "Streaming sensor metrics to cloud IoT dashboards in real-time",
    ],
    targetAudience: "School STEM Clubs (Classes 8-12) & Polytech Diploma Students",
    sessionDurationMinutes: 150,
    maxAudienceSize: 80,
    deliveryFormat: "offline",
    basePrice: 9500,
    travelChargePerKm: 14,
    isActive: true,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "off-4",
    candidateId: "cand-3",
    title: "Cracking Campus Placements & High-Impact Tech Interviews",
    categoryId: "cat-8",
    description:
      "Actionable corporate roadmap for college seniors. Covers ATS-friendly resume tailoring, behavioral interview mastery (STAR method), negotiation strategies, and how to stand out during campus placement season.",
    learningOutcomes: [
      "Building a resume that passes top recruiter ATS filters with high confidence",
      "Structuring answers for behavioral questions using the STAR framework",
      "Overcoming interview anxiety and demonstrating leadership potential",
    ],
    targetAudience: "Final & Pre-Final Year College Students (All Streams)",
    sessionDurationMinutes: 120,
    maxAudienceSize: 300,
    deliveryFormat: "hybrid",
    basePrice: 8000,
    travelChargePerKm: 12,
    isActive: true,
    createdAt: "2026-01-18T00:00:00Z",
  },
  {
    id: "off-5",
    candidateId: "cand-4",
    title: "Modern Full-Stack Web Development with React & Next.js",
    categoryId: "cat-2",
    description:
      "From standard HTML/CSS to high-performance Server Components, TypeScript types, and scalable database backends. Perfect for aspiring software development students.",
    learningOutcomes: [
      "Modern React mental models, hooks, and App Router architecture",
      "State management, form validation, and server actions",
      "Deploying full-stack web applications to production servers",
    ],
    targetAudience: "Engineering Students, MCA, BCA & Coding Bootcamps",
    sessionDurationMinutes: 120,
    maxAudienceSize: 150,
    deliveryFormat: "hybrid",
    basePrice: 11000,
    travelChargePerKm: 16,
    isActive: true,
    createdAt: "2026-01-22T00:00:00Z",
  },
  {
    id: "off-6",
    candidateId: "cand-5",
    title: "Vedic Math & Rapid Mental Arithmetic for Competitive Exams",
    categoryId: "cat-7",
    description:
      "Transform fear of math into lightning speed. Teaches ancient sutras for 10x faster multiplication, mental square roots, algebraic shortcuts, and olympiad tricks.",
    learningOutcomes: [
      "Multiply multi-digit numbers mentally in 3 seconds using Urdhva Tiryagbhyam",
      "Square root approximations and quick divisibility proofs",
      "Boosting accuracy and speed for NTSE, JEE, and Olympiad math sections",
    ],
    targetAudience: "Middle & High School Students (Classes 6 to 11)",
    sessionDurationMinutes: 90,
    maxAudienceSize: 250,
    deliveryFormat: "hybrid",
    basePrice: 6500,
    travelChargePerKm: 10,
    isActive: true,
    createdAt: "2026-01-25T00:00:00Z",
  },
];

const INITIAL_AVAILABILITY_SLOTS: AvailabilitySlot[] = [
  {
    id: "slot-1",
    candidateId: "cand-1",
    slotDate: "2026-11-10",
    startTime: "10:00",
    endTime: "12:00",
    isBooked: false,
    isRecurring: false,
  },
  {
    id: "slot-2",
    candidateId: "cand-1",
    slotDate: "2026-11-12",
    startTime: "14:00",
    endTime: "16:00",
    isBooked: false,
    isRecurring: false,
  },
  {
    id: "slot-3",
    candidateId: "cand-2",
    slotDate: "2026-11-15",
    startTime: "09:30",
    endTime: "12:00",
    isBooked: false,
    isRecurring: false,
  },
  {
    id: "slot-4",
    candidateId: "cand-3",
    slotDate: "2026-11-18",
    startTime: "11:00",
    endTime: "13:00",
    isBooked: false,
    isRecurring: false,
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bk-1001",
    bookingReference: "SC-2026-7781",
    offeringId: "off-1",
    candidateId: "cand-1",
    candidateName: "Dr. Ananya Roy",
    candidateTitle: "Lead AI Researcher & ML Architect",
    candidateAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    principalId: "user-principal-1",
    principalName: "Dr. Rajesh Sharma",
    institutionName: "Delhi Public School R.K. Puram",
    principalPhone: "+91 98111 22334",
    principalEmail: "principal@dps-delhi.edu",
    seminarTitle: "Demystifying Artificial Intelligence & Prompt Engineering",
    eventDate: "2026-10-15",
    startTime: "10:30",
    endTime: "12:30",
    deliveryFormat: "online",
    venueAddress: "DPS Main Auditorium, Sector XII, R.K. Puram",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110022",
    audienceCount: 180,
    baseFee: 12000,
    travelFee: 0,
    platformCommissionRate: 10,
    platformFee: 1200,
    totalAmount: 13416, // 12000 + 1200 + 216 GST
    candidatePayoutAmount: 12000,
    status: "completed",
    createdAt: "2026-10-01T10:00:00Z",
    updatedAt: "2026-10-15T13:00:00Z",
  },
  {
    id: "bk-1002",
    bookingReference: "SC-2026-8942",
    offeringId: "off-3",
    candidateId: "cand-2",
    candidateName: "Vikramaditya Verma",
    candidateTitle: "Robotics Engineer & Embedded Systems Expert",
    candidateAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    principalId: "user-principal-1",
    principalName: "Dr. Rajesh Sharma",
    institutionName: "Delhi Public School R.K. Puram",
    principalPhone: "+91 98111 22334",
    principalEmail: "principal@dps-delhi.edu",
    seminarTitle: "Hands-on Microcontrollers & IoT Prototyping Workshop",
    eventDate: "2026-11-20",
    startTime: "10:00",
    endTime: "12:30",
    deliveryFormat: "offline",
    venueAddress: "DPS R.K. Puram Science & Robotics Lab",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110022",
    audienceCount: 65,
    baseFee: 9500,
    travelFee: 350,
    platformCommissionRate: 10,
    platformFee: 950,
    totalAmount: 10971,
    candidatePayoutAmount: 9850,
    status: "confirmed",
    createdAt: "2026-10-18T14:30:00Z",
    updatedAt: "2026-10-19T09:00:00Z",
  },
];

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    bookingId: "bk-1001",
    principalId: "user-principal-1",
    principalName: "Dr. Rajesh Sharma",
    institutionName: "Delhi Public School R.K. Puram",
    candidateId: "cand-1",
    offeringId: "off-1",
    rating: 5,
    reviewText:
      "Dr. Ananya Roy conducted a spellbinding session on Generative AI. Over 180 senior students attended and were captivated by the practical demos. The pedagogy and depth were unmatched. Highly recommended for every progressive school!",
    createdAt: "2026-10-16T11:00:00Z",
  },
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-1",
    bookingId: "bk-1001",
    bookingReference: "SC-2026-7781",
    principalId: "user-principal-1",
    principalName: "Dr. Rajesh Sharma",
    institutionName: "Delhi Public School R.K. Puram",
    paymentGateway: "razorpay",
    gatewayOrderId: "order_mock_7781",
    gatewayPaymentId: "pay_mock_7781_success",
    amount: 13416,
    currency: "INR",
    status: "completed",
    receiptUrl: "/invoices/INV-2026-7781.pdf",
    paymentMethod: "UPI / Net Banking",
    createdAt: "2026-10-02T10:15:00Z",
  },
  {
    id: "pay-2",
    bookingId: "bk-1002",
    bookingReference: "SC-2026-8942",
    principalId: "user-principal-1",
    principalName: "Dr. Rajesh Sharma",
    institutionName: "Delhi Public School R.K. Puram",
    paymentGateway: "razorpay",
    gatewayOrderId: "order_mock_8942",
    gatewayPaymentId: "pay_mock_8942_success",
    amount: 10971,
    currency: "INR",
    status: "completed",
    receiptUrl: "/invoices/INV-2026-8942.pdf",
    paymentMethod: "Corporate Net Banking",
    createdAt: "2026-10-19T09:05:00Z",
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "user-principal-1",
    title: "Booking Confirmed",
    message: "Your seminar booking with Vikramaditya Verma for Nov 20 has been confirmed.",
    link: "/bookings/bk-1002",
    type: "booking",
    isRead: false,
    createdAt: "2026-10-19T09:00:00Z",
  },
  {
    id: "notif-2",
    userId: "user-speaker-1",
    title: "New 5-Star Review Received",
    message: "DPS R.K. Puram submitted a 5-star review for Demystifying AI seminar.",
    link: "/dashboard/candidate",
    type: "system",
    isRead: true,
    createdAt: "2026-10-16T11:05:00Z",
  },
];

const INITIAL_REQUIREMENTS: SeminarRequirement[] = [
  {
    id: "req-1",
    principalId: "user-principal-1",
    principalName: "Dr. Rajesh Sharma",
    institutionName: "Delhi Public School R.K. Puram",
    title: "Need Cyber Security & Ethical Digital Hygiene Workshop for Grade 10-12",
    categoryId: "cat-5",
    categoryName: "Data Science and Cybersecurity",
    description: "Looking for an industry practitioner to conduct a 2-hour interactive seminar on online safety, data breaches, and career paths in cybersecurity.",
    targetDate: "2026-11-28",
    startTime: "11:00",
    durationMinutes: 120,
    deliveryFormat: "hybrid",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110022",
    audienceSize: 150,
    budget: 12000,
    preferredLanguage: "English & Hindi",
    status: "open",
    createdAt: "2026-10-20T10:00:00Z",
  },
];

class DataStore {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        // Ensure new schema fields exist if upgrading
        return {
          users: parsed.users || INITIAL_USERS,
          institutions: parsed.institutions || INITIAL_INSTITUTIONS,
          candidates: parsed.candidates || INITIAL_CANDIDATES,
          categories: parsed.categories || INITIAL_CATEGORIES,
          offerings: parsed.offerings || INITIAL_OFFERINGS,
          availabilitySlots: parsed.availabilitySlots || INITIAL_AVAILABILITY_SLOTS,
          requirements: parsed.requirements || INITIAL_REQUIREMENTS,
          bookings: parsed.bookings || INITIAL_BOOKINGS,
          payments: parsed.payments || INITIAL_PAYMENTS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          messages: parsed.messages || [],
          favorites: parsed.favorites || [],
          reviews: parsed.reviews || INITIAL_REVIEWS,
          settings: parsed.settings || {
            platformCommissionPercent: 10,
            taxRateGst: 18,
            minimumBookingLeadDays: 2,
            cancellationCutoffHours: 48,
          },
          auditLogs: parsed.auditLogs || [],
        };
      }
    } catch (e) {
      console.warn("Failed reading DB file, using initial data", e);
    }

    return {
      users: [...INITIAL_USERS],
      institutions: [...INITIAL_INSTITUTIONS],
      candidates: [...INITIAL_CANDIDATES],
      categories: [...INITIAL_CATEGORIES],
      offerings: [...INITIAL_OFFERINGS],
      availabilitySlots: [...INITIAL_AVAILABILITY_SLOTS],
      requirements: [...INITIAL_REQUIREMENTS],
      bookings: [...INITIAL_BOOKINGS],
      payments: [...INITIAL_PAYMENTS],
      notifications: [...INITIAL_NOTIFICATIONS],
      messages: [],
      favorites: [],
      reviews: [...INITIAL_REVIEWS],
      settings: {
        platformCommissionPercent: 10,
        taxRateGst: 18,
        minimumBookingLeadDays: 2,
        cancellationCutoffHours: 48,
      },
      auditLogs: [],
    };
  }

  private saveState(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed persisting data to disk:", err);
    }
  }

  // --- USER OPERATIONS ---
  public getUsers(): UserProfile[] {
    return this.state.users.map(({ passwordHash, ...rest }) => rest);
  }

  public findUserByEmail(email: string): (UserProfile & { passwordHash?: string }) | undefined {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserProfile | undefined {
    const user = this.state.users.find((u) => u.id === id);
    if (!user) return undefined;
    const { passwordHash, ...rest } = user;
    return rest;
  }

  public createUser(userData: {
    email: string;
    role: "principal" | "candidate" | "admin";
    fullName: string;
    phone: string;
    bio?: string;
    avatarUrl?: string;
    passwordHash?: string;
  }): UserProfile {
    const newUser: UserProfile & { passwordHash?: string } = {
      id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: userData.email,
      role: userData.role,
      fullName: userData.fullName,
      phone: userData.phone,
      bio: userData.bio || "",
      avatarUrl:
        userData.avatarUrl ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordHash: userData.passwordHash,
    };
    this.state.users.push(newUser);
    this.saveState();
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  // --- INSTITUTION OPERATIONS ---
  public getInstitutions(): Institution[] {
    return this.state.institutions;
  }

  public getInstitutionByProfileId(profileId: string): Institution | undefined {
    return this.state.institutions.find((i) => i.profileId === profileId);
  }

  public createInstitution(data: Omit<Institution, "id" | "createdAt">): Institution {
    const inst: Institution = {
      ...data,
      id: `inst-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.institutions.push(inst);
    this.saveState();
    return inst;
  }

  public updateInstitutionVerification(
    id: string,
    status: "approved" | "rejected" | "pending",
    rejectionReason?: string
  ): Institution | null {
    const inst = this.state.institutions.find((i) => i.id === id);
    if (!inst) return null;
    inst.verificationStatus = status;
    if (rejectionReason) inst.rejectionReason = rejectionReason;
    this.saveState();
    return inst;
  }

  // --- CANDIDATE OPERATIONS ---
  public getCandidates(): CandidateProfile[] {
    // Enrich with user profile details (name, avatar, bio, email, phone)
    return this.state.candidates.map((cand) => {
      const user = this.findUserById(cand.profileId);
      return {
        ...cand,
        fullName: user?.fullName || "Guest Speaker",
        email: user?.email,
        phone: user?.phone,
        avatarUrl: user?.avatarUrl,
        bio: user?.bio,
      };
    });
  }

  public getCandidateById(candidateId: string): CandidateProfile | undefined {
    const cand = this.state.candidates.find((c) => c.id === candidateId || c.profileId === candidateId);
    if (!cand) return undefined;
    const user = this.findUserById(cand.profileId);
    return {
      ...cand,
      fullName: user?.fullName || "Guest Speaker",
      email: user?.email,
      phone: user?.phone,
      avatarUrl: user?.avatarUrl,
      bio: user?.bio,
    };
  }

  public createCandidateProfile(data: Omit<CandidateProfile, "id" | "createdAt" | "ratingAvg" | "reviewsCount" | "isFeatured">): CandidateProfile {
    const newCand: CandidateProfile = {
      ...data,
      id: `cand-${Date.now()}`,
      ratingAvg: 5.0,
      reviewsCount: 0,
      isFeatured: false,
      createdAt: new Date().toISOString(),
    };
    this.state.candidates.push(newCand);
    this.saveState();
    return this.getCandidateById(newCand.id)!;
  }

  public updateCandidateVerification(
    candidateId: string,
    status: "approved" | "rejected" | "pending"
  ): CandidateProfile | null {
    const cand = this.state.candidates.find((c) => c.id === candidateId);
    if (!cand) return null;
    cand.verificationStatus = status;
    if (status === "approved") {
      cand.verifiedAt = new Date().toISOString();
    }
    this.saveState();
    return this.getCandidateById(cand.id) || null;
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.state.categories.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public addCategory(cat: Omit<Category, "id">): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    this.state.categories.push(newCat);
    this.saveState();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const cat = this.state.categories.find((c) => c.id === id);
    if (!cat) return null;
    Object.assign(cat, updates);
    this.saveState();
    return cat;
  }

  // --- SEMINAR OFFERINGS ---
  public getOfferings(): SeminarOffering[] {
    const candidates = this.getCandidates();
    const categories = this.getCategories();

    return this.state.offerings.map((off) => {
      const candidate = candidates.find((c) => c.id === off.candidateId);
      const category = categories.find((c) => c.id === off.categoryId);
      return {
        ...off,
        categoryName: category?.name,
        candidate,
      };
    });
  }

  public getOfferingById(id: string): SeminarOffering | undefined {
    return this.getOfferings().find((o) => o.id === id);
  }

  public createOffering(data: Omit<SeminarOffering, "id" | "createdAt" | "isActive">): SeminarOffering {
    const newOff: SeminarOffering = {
      ...data,
      id: `off-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    this.state.offerings.push(newOff);
    this.saveState();
    return this.getOfferingById(newOff.id)!;
  }

  // --- AVAILABILITY SLOTS ---
  public getAvailabilitySlots(candidateId: string): AvailabilitySlot[] {
    return this.state.availabilitySlots.filter((s) => s.candidateId === candidateId);
  }

  public addAvailabilitySlot(slot: Omit<AvailabilitySlot, "id" | "isBooked">): AvailabilitySlot {
    const newSlot: AvailabilitySlot = {
      ...slot,
      id: `slot-${Date.now()}`,
      isBooked: false,
    };
    this.state.availabilitySlots.push(newSlot);
    this.saveState();
    return newSlot;
  }

  public checkSlotAvailable(candidateId: string, date: string, startTime: string): boolean {
    // Check if slot exists and is already booked
    const bookedSlot = this.state.availabilitySlots.find(
      (s) => s.candidateId === candidateId && s.slotDate === date && s.startTime === startTime && s.isBooked
    );
    if (bookedSlot) return false;

    // Check confirmed or pending bookings
    const existingBooking = this.state.bookings.find(
      (b) =>
        b.candidateId === candidateId &&
        b.eventDate === date &&
        b.startTime === startTime &&
        ["confirmed", "payment_pending", "accepted"].includes(b.status)
    );
    return !existingBooking;
  }

  // --- SEMINAR REQUIREMENTS (Principal Board) ---
  public getRequirements(): SeminarRequirement[] {
    const categories = this.getCategories();
    return this.state.requirements.map((req) => {
      const cat = categories.find((c) => c.id === req.categoryId);
      return {
        ...req,
        categoryName: cat?.name,
      };
    });
  }

  public createRequirement(data: Omit<SeminarRequirement, "id" | "createdAt" | "status">): SeminarRequirement {
    const newReq: SeminarRequirement = {
      ...data,
      id: `req-${Date.now()}`,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    this.state.requirements.push(newReq);
    this.saveState();
    return newReq;
  }

  // --- BOOKINGS & CONCURRENCY CONTROL ---
  public getBookings(): Booking[] {
    return this.state.bookings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getBookingById(id: string): Booking | undefined {
    return this.state.bookings.find((b) => b.id === id);
  }

  public checkDoubleBooking(candidateId: string, eventDate: string, startTime: string): boolean {
    return this.state.bookings.some(
      (b) =>
        b.candidateId === candidateId &&
        b.eventDate === eventDate &&
        b.startTime === startTime &&
        ["confirmed", "payment_pending", "accepted"].includes(b.status)
    );
  }

  public createBooking(data: Omit<Booking, "id" | "bookingReference" | "createdAt" | "updatedAt">): Booking {
    // Enforce double booking prevention
    if (this.checkDoubleBooking(data.candidateId, data.eventDate, data.startTime)) {
      throw new Error("This candidate is already booked for this specific date and time slot.");
    }

    const refNumber = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...data,
      id: `bk-${Date.now()}`,
      bookingReference: `SC-2026-${refNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.bookings.push(newBooking);

    // Notify candidate
    const cand = this.getCandidateById(data.candidateId);
    if (cand) {
      this.createNotification({
        userId: cand.profileId,
        title: "New Booking Request",
        message: `${data.principalName || "An institution"} submitted a booking request for "${data.seminarTitle}".`,
        link: `/dashboard/candidate`,
        type: "booking",
      });
    }

    this.saveState();
    return newBooking;
  }

  public updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    reason?: string,
    rescheduleNotes?: string
  ): Booking | null {
    const booking = this.state.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    if (reason) booking.cancellationReason = reason;
    if (rescheduleNotes) booking.rescheduleNotes = rescheduleNotes;

    // Send notification to principal
    this.createNotification({
      userId: booking.principalId,
      title: `Booking Update: ${status.toUpperCase()}`,
      message: `Your booking for "${booking.seminarTitle}" status changed to ${status}.`,
      link: `/bookings/${booking.id}`,
      type: "booking",
    });

    this.saveState();
    return booking;
  }

  // --- PAYMENTS ---
  public getPayments(): PaymentRecord[] {
    return this.state.payments;
  }

  public createPayment(paymentData: Omit<PaymentRecord, "id" | "createdAt">): PaymentRecord {
    const payment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.payments.push(payment);

    // Update booking status to confirmed if completed
    if (payment.status === "completed") {
      this.updateBookingStatus(payment.bookingId, "confirmed");
    }

    this.saveState();
    return payment;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId: string): NotificationItem[] {
    return this.state.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createNotification(data: Omit<NotificationItem, "id" | "createdAt" | "isRead">): NotificationItem {
    const notif: NotificationItem = {
      ...data,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.state.notifications.push(notif);
    this.saveState();
    return notif;
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveState();
    }
  }

  // --- FAVORITES ---
  public getFavorites(principalId: string): string[] {
    return this.state.favorites
      .filter((f) => f.principalId === principalId)
      .map((f) => f.candidateId);
  }

  public toggleFavorite(principalId: string, candidateId: string): boolean {
    const idx = this.state.favorites.findIndex(
      (f) => f.principalId === principalId && f.candidateId === candidateId
    );
    if (idx >= 0) {
      this.state.favorites.splice(idx, 1);
      this.saveState();
      return false; // Removed
    } else {
      this.state.favorites.push({
        id: `fav-${Date.now()}`,
        principalId,
        candidateId,
        createdAt: new Date().toISOString(),
      });
      this.saveState();
      return true; // Added
    }
  }

  // --- REVIEWS ---
  public getReviews(candidateId?: string): ReviewItem[] {
    if (candidateId) {
      return this.state.reviews.filter((r) => r.candidateId === candidateId);
    }
    return this.state.reviews;
  }

  public addReview(reviewData: Omit<ReviewItem, "id" | "createdAt">): ReviewItem {
    // Check if review already exists for this booking
    const exists = this.state.reviews.some((r) => r.bookingId === reviewData.bookingId);
    if (exists) {
      throw new Error("A review has already been submitted for this seminar.");
    }

    const review: ReviewItem = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.reviews.push(review);

    // Recalculate candidate rating average
    const candReviews = this.state.reviews.filter((r) => r.candidateId === review.candidateId);
    const avg =
      candReviews.reduce((acc, curr) => acc + curr.rating, 0) / candReviews.length;
    const cand = this.state.candidates.find((c) => c.id === review.candidateId);
    if (cand) {
      cand.ratingAvg = Math.round(avg * 100) / 100;
      cand.reviewsCount = candReviews.length;
    }

    // Mark booking as reviewed
    const booking = this.state.bookings.find((b) => b.id === review.bookingId);
    if (booking) {
      booking.status = "completed";
      booking.updatedAt = new Date().toISOString();
    }

    this.saveState();
    return review;
  }

  // --- MESSAGES ---
  public getMessages(bookingId?: string): ConversationMessage[] {
    if (bookingId) {
      return this.state.messages.filter((m) => m.conversationId === bookingId);
    }
    return this.state.messages;
  }

  public sendMessage(msg: Omit<ConversationMessage, "id" | "createdAt" | "isRead">): ConversationMessage {
    const newMsg: ConversationMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.state.messages.push(newMsg);
    this.saveState();
    return newMsg;
  }

  // --- SETTINGS & AUDIT LOGS ---
  public getSettings(): PlatformSettings {
    return this.state.settings;
  }

  public updateSettings(settings: Partial<PlatformSettings>): PlatformSettings {
    Object.assign(this.state.settings, settings);
    this.saveState();
    return this.state.settings;
  }

  public getAuditLogs() {
    return this.state.auditLogs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public addAuditLog(entry: {
    adminId: string;
    action: string;
    targetType: string;
    targetId: string;
    details?: any;
  }) {
    this.state.auditLogs.push({
      ...entry,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
    this.saveState();
  }
}

// Global Singleton Instance
declare global {
  var __seminarConnectDb: DataStore | undefined;
}

export const db: DataStore = global.__seminarConnectDb || new DataStore();
if (process.env.NODE_ENV !== "production") {
  global.__seminarConnectDb = db;
}
