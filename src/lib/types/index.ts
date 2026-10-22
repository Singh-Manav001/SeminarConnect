export type UserRole = "principal" | "candidate" | "admin";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type DeliveryFormat = "online" | "offline" | "hybrid";
export type BookingStatus =
  | "pending"
  | "accepted"
  | "payment_pending"
  | "confirmed"
  | "rescheduled"
  | "completed"
  | "cancelled"
  | "rejected"
  | "disputed";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Institution {
  id: string;
  profileId: string;
  institutionName: string;
  institutionType: "School" | "College" | "University" | "Coaching Institute" | "Vocational Centre";
  address: string;
  city: string;
  district?: string;
  state: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  verificationDocUrl?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface CandidateProfile {
  id: string;
  profileId: string;
  professionalTitle: string;
  experienceYears: number;
  highestQualification: string;
  baseSeminarFee: number; // INR
  travelRadiusKm: number;
  preferredDeliveryFormat: DeliveryFormat;
  address?: string;
  city: string;
  district?: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  bioVideoUrl?: string;
  resumeUrl?: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  ratingAvg: number;
  reviewsCount: number;
  isFeatured: boolean;
  languages: string[];
  skills: string[];
  createdAt: string;
  // Joined fields for ease of presentation:
  fullName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SeminarOffering {
  id: string;
  candidateId: string;
  title: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  learningOutcomes: string[];
  targetAudience: string;
  sessionDurationMinutes: number;
  maxAudienceSize: number;
  deliveryFormat: DeliveryFormat;
  basePrice: number; // INR
  travelChargePerKm: number; // INR
  isActive: boolean;
  createdAt: string;
  // Joined candidate profile preview
  candidate?: CandidateProfile;
}

export interface AvailabilitySlot {
  id: string;
  candidateId: string;
  slotDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isBooked: boolean;
  isRecurring: boolean;
}

export interface SeminarRequirement {
  id: string;
  principalId: string;
  principalName?: string;
  institutionName?: string;
  title: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  targetDate: string;
  startTime?: string;
  durationMinutes: number;
  deliveryFormat: DeliveryFormat;
  city: string;
  state: string;
  postalCode: string;
  audienceSize: number;
  budget: number;
  preferredLanguage: string;
  status: "open" | "assigned" | "closed";
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  offeringId?: string;
  requirementId?: string;
  candidateId: string;
  candidateName?: string;
  candidateTitle?: string;
  candidateAvatar?: string;
  candidatePhone?: string;
  candidateEmail?: string;
  principalId: string;
  principalName?: string;
  institutionName?: string;
  principalPhone?: string;
  principalEmail?: string;
  seminarTitle: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  deliveryFormat: DeliveryFormat;
  venueAddress?: string;
  city: string;
  state: string;
  postalCode: string;
  audienceCount: number;
  baseFee: number;
  travelFee: number;
  platformCommissionRate: number;
  platformFee: number;
  totalAmount: number;
  candidatePayoutAmount: number;
  status: BookingStatus;
  cancellationReason?: string;
  cancelledBy?: string;
  rescheduleNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  bookingReference: string;
  principalId: string;
  principalName?: string;
  institutionName?: string;
  paymentGateway: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  receiptUrl?: string;
  paymentMethod: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string;
  type: "booking" | "payment" | "system" | "message";
  isRead: boolean;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  messageText: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  bookingId: string;
  principalId: string;
  principalName: string;
  institutionName: string;
  candidateId: string;
  offeringId?: string;
  rating: number; // 1-5
  reviewText: string;
  createdAt: string;
}

export interface PlatformSettings {
  platformCommissionPercent: number;
  taxRateGst: number;
  minimumBookingLeadDays: number;
  cancellationCutoffHours: number;
}
