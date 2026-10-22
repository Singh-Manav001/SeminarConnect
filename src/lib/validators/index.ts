import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const PrincipalRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Valid institutional email is required"),
  phone: z.string().min(10, "Valid 10-digit phone number is required").max(13),
  password: z.string().min(6, "Password must be at least 6 characters"),
  institutionName: z.string().min(3, "Institution name is required"),
  institutionType: z.enum([
    "School",
    "College",
    "University",
    "Coaching Institute",
    "Vocational Centre",
  ]),
  address: z.string().min(5, "Physical campus address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Valid 6-digit Indian PIN code required"),
  website: z.string().url("Enter valid website URL").optional().or(z.literal("")),
  verificationDocUrl: z.string().optional(),
});

export const CandidateRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid 10-digit phone number is required").max(13),
  password: z.string().min(6, "Password must be at least 6 characters"),
  professionalTitle: z.string().min(3, "Professional title (e.g., AI Research Scientist) is required"),
  highestQualification: z.string().min(2, "Highest qualification (e.g. M.Tech, Ph.D.) is required"),
  experienceYears: z.number().min(0, "Experience must be 0 or more years").max(50),
  baseSeminarFee: z.number().min(500, "Minimum seminar fee must be at least ₹500"),
  travelRadiusKm: z.number().min(5, "Travel radius must be at least 5 km").max(1500),
  preferredDeliveryFormat: z.enum(["online", "offline", "hybrid"]),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Valid 6-digit Indian PIN code required"),
  skills: z.array(z.string()).min(1, "Please select or enter at least one core skill"),
  bio: z.string().min(20, "Please provide a concise bio (minimum 20 characters)"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
});

export const SeminarOfferingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().min(30, "Please write a comprehensive description (at least 30 chars)"),
  learningOutcomes: z.array(z.string()).min(1, "Add at least one learning outcome"),
  targetAudience: z.string().min(2, "Target audience is required"),
  sessionDurationMinutes: z.number().min(30, "Minimum 30 minutes").max(480, "Maximum 8 hours"),
  maxAudienceSize: z.number().min(5, "Minimum 5 attendees").max(5000),
  deliveryFormat: z.enum(["online", "offline", "hybrid"]),
  basePrice: z.number().min(500, "Base price must be at least ₹500"),
  travelChargePerKm: z.number().min(0, "Travel charge cannot be negative"),
});

export const SeminarRequirementSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  categoryId: z.string().min(1, "Select an academic category"),
  description: z.string().min(25, "Describe your seminar requirements"),
  targetDate: z.string().min(10, "Target date is required"),
  startTime: z.string().min(4, "Start time is required"),
  durationMinutes: z.number().min(30).max(480),
  deliveryFormat: z.enum(["online", "offline", "hybrid"]),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Valid PIN code is required"),
  audienceSize: z.number().min(10, "Audience size must be at least 10 students"),
  budget: z.number().min(1000, "Budget must be at least ₹1000"),
  preferredLanguage: z.string().default("English"),
});

export const BookingRequestSchema = z.object({
  offeringId: z.string().optional(),
  candidateId: z.string().min(1, "Candidate speaker is required"),
  seminarTitle: z.string().min(3, "Seminar title is required"),
  eventDate: z.string().min(10, "Event date is required"),
  startTime: z.string().min(4, "Start time is required"),
  endTime: z.string().min(4, "End time is required"),
  deliveryFormat: z.enum(["online", "offline", "hybrid"]),
  venueAddress: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(6, "PIN code is required"),
  audienceCount: z.number().min(5, "Audience count must be at least 5"),
  specialRequests: z.string().optional(),
});

export const ReviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters"),
});
