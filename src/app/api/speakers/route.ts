import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/dataStore";
import { calculateDistanceKm, getCoordinatesForCity } from "@/lib/geo";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q")?.toLowerCase().trim();
    const categoryId = searchParams.get("category");
    const city = searchParams.get("city")?.toLowerCase().trim();
    const state = searchParams.get("state")?.toLowerCase().trim();
    const postalCode = searchParams.get("postalCode")?.trim();
    const deliveryFormat = searchParams.get("format");
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null;
    const minExperience = searchParams.get("minExp") ? Number(searchParams.get("minExp")) : null;
    const verifiedOnly = searchParams.get("verified") === "true";
    const language = searchParams.get("language")?.toLowerCase();
    const sort = searchParams.get("sort") || "relevance";

    // Proximity parameters
    let userLat = searchParams.get("lat") ? Number(searchParams.get("lat")) : null;
    let userLng = searchParams.get("lng") ? Number(searchParams.get("lng")) : null;
    const searchLocation = searchParams.get("location")?.toLowerCase().trim();
    const maxDistanceKm = searchParams.get("radius") ? Number(searchParams.get("radius")) : null;

    if (searchLocation && (!userLat || !userLng)) {
      const coords = getCoordinatesForCity(searchLocation);
      userLat = coords.lat;
      userLng = coords.lng;
    }

    let candidates = db.getCandidates();
    const offerings = db.getOfferings();

    // 1. Filter by category
    if (categoryId) {
      const candidateIdsWithCategory = new Set(
        offerings.filter((o) => o.categoryId === categoryId).map((o) => o.candidateId)
      );
      candidates = candidates.filter((c) => candidateIdsWithCategory.has(c.id));
    }

    // 2. Filter by search query (name, title, skills, bio)
    if (query) {
      candidates = candidates.filter((c) => {
        const nameMatch = c.fullName?.toLowerCase().includes(query);
        const titleMatch = c.professionalTitle.toLowerCase().includes(query);
        const skillMatch = c.skills.some((s) => s.toLowerCase().includes(query));
        const bioMatch = c.bio?.toLowerCase().includes(query);
        return nameMatch || titleMatch || skillMatch || bioMatch;
      });
    }

    // 3. Filter by city / state / postalCode
    if (city) {
      candidates = candidates.filter((c) => c.city.toLowerCase().includes(city));
    }
    if (state) {
      candidates = candidates.filter((c) => c.state.toLowerCase().includes(state));
    }
    if (postalCode) {
      candidates = candidates.filter((c) => c.postalCode.includes(postalCode));
    }

    // 4. Delivery format filter
    if (deliveryFormat && deliveryFormat !== "all") {
      candidates = candidates.filter((c) => {
        if (c.preferredDeliveryFormat === "hybrid") return true;
        return c.preferredDeliveryFormat === deliveryFormat;
      });
    }

    // 5. Price range filter
    if (minPrice !== null) {
      candidates = candidates.filter((c) => c.baseSeminarFee >= minPrice);
    }
    if (maxPrice !== null) {
      candidates = candidates.filter((c) => c.baseSeminarFee <= maxPrice);
    }

    // 6. Rating filter
    if (minRating !== null) {
      candidates = candidates.filter((c) => c.ratingAvg >= minRating);
    }

    // 7. Experience filter
    if (minExperience !== null) {
      candidates = candidates.filter((c) => c.experienceYears >= minExperience);
    }

    // 8. Verified status
    if (verifiedOnly) {
      candidates = candidates.filter((c) => c.verificationStatus === "approved");
    }

    // 9. Language filter
    if (language) {
      candidates = candidates.filter((c) =>
        c.languages.some((lang) => lang.toLowerCase().includes(language))
      );
    }

    // Calculate distance for each candidate
    const results = candidates.map((c) => {
      let distanceKm: number | null = null;
      if (userLat !== null && userLng !== null) {
        distanceKm = calculateDistanceKm(userLat, userLng, c.latitude, c.longitude);
      }
      const candidateOfferings = offerings.filter((o) => o.candidateId === c.id);
      return {
        ...c,
        distanceKm,
        offeringsCount: candidateOfferings.length,
        sampleOfferings: candidateOfferings.slice(0, 2),
      };
    });

    // 10. Proximity distance filter
    let filteredResults = results;
    if (maxDistanceKm && userLat !== null && userLng !== null) {
      filteredResults = filteredResults.filter((c) => {
        // Online-capable speakers remain discoverable regardless of distance
        if (c.preferredDeliveryFormat === "online") return true;
        if (c.distanceKm === null) return true;
        return c.distanceKm <= maxDistanceKm;
      });
    }

    // 11. Sorting
    filteredResults.sort((a, b) => {
      switch (sort) {
        case "distance":
          if (a.distanceKm === null) return 1;
          if (b.distanceKm === null) return -1;
          return a.distanceKm - b.distanceKm;
        case "price_asc":
          return a.baseSeminarFee - b.baseSeminarFee;
        case "price_desc":
          return b.baseSeminarFee - a.baseSeminarFee;
        case "rating":
          return b.ratingAvg - a.ratingAvg;
        case "experience":
          return b.experienceYears - a.experienceYears;
        case "popularity":
          return b.reviewsCount - a.reviewsCount;
        case "relevance":
        default:
          // Featured candidates first, then high rating
          if (a.isFeatured !== b.isFeatured) {
            return a.isFeatured ? -1 : 1;
          }
          return b.ratingAvg - a.ratingAvg;
      }
    });

    return NextResponse.json({
      total: filteredResults.length,
      speakers: filteredResults,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed fetching speakers" }, { status: 500 });
  }
}
