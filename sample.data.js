import { fromDriverUUID } from "~/lib";
import { hashPassword } from "~/middleware";

 
export const sampleData = {
  
  "user": [
    {
      "id": fromDriverUUID("a4b5c6d7-e8f9-40a1-b2c3-d4e5f6a7b8c9"),
      "firstname": "Natnael",
      "lastname": "Tadesse",
      "gender": "M",
      "role": "super_admin",
      "email": "natnaeltadesse@gmail.com",
      "phone": "+2510922113344",
      "password": hashPassword("Natnael@1234")
    },
    {
      "id": fromDriverUUID("f3a4b5c6-d7e8-49f0-a1b2-c3d4e5f6a7b8"),
      "firstname": "Abebe",
      "lastname": "Tadesse",
      "gender": "M",
      "role": "organization_admin",
      "email": "abebe@gmail.com",
      "phone": "+2510912345678",
      "password": hashPassword("Abebe@1234"),
    },
    {
      "id": fromDriverUUID("b5c6d7e8-f9a0-41b2-c3d4-e5f6a7b8c9d0"),
      "firstname": "Natnael",
      "lastname": "Tsegaye",
      "gender": "M",
      "role": "organization_admin",
      "email": "natnaeltsegaye@gmail.com",
      "phone": "+2510933224455",
      "password": hashPassword("Natnael@1234")
    },
    {
      "id": fromDriverUUID("c6d7e8f9-a0b1-42c3-d4e5-f6a7b8c9d0e1"),
      "firstname": "Abel",
      "lastname": "Girma",
      "gender": "M",
      "role": "client",
      "email": "abel@gmail.com",
      "phone": "+2510944335566",
      "password": hashPassword("Abel@1234")
    },
    {
      "id": fromDriverUUID("d7e8f9a0-b1c2-43d4-e5f6-a7b8c9d0e1f2"),
      "firstname": "Selam",
      "lastname": "Tesfaye",
      "gender": "F",
      "role": "organization_admin",
      "email": "selam@premiumsalon.com",
      "phone": "+2510955446677",
      "password": hashPassword("Selam@1234"),
    },
    {
      "id": fromDriverUUID("53bf8f92-1cb8-45b8-8731-331249b02b93"),
      "firstname": "Demeke",
      "lastname": "Tadesse",
      "gender": "M",
      "role": "organization_admin",
      "email": "demeke@gmail.com",
      "phone": "+2510955446677",
      "password": hashPassword("Demeke@1234"),
    },
    {
      "id": fromDriverUUID("76f4b161-8a30-44f7-a524-c2fee2abbabb"),
      "firstname": "Kelemewerk",
      "lastname": "Tadesse",
      "gender": "F",
      "role": "organization_admin",
      "email": "kelem@gmail.com",
      "phone": "+2510955446677",
      "password": hashPassword("Kelem@1234"),
    },
    //
    {
      "id": fromDriverUUID("f7b65ae8-edfb-4e11-a97b-647c712a257c"),
      "firstname": "Meron",
      "lastname": "Desta",
      "gender": "F",
      "email": "meron@citymedical.com",
      "phone": "+2510966557788",
      "role": "employee",
      "password": hashPassword("Meron@1234"),
    },
    {
      "id": fromDriverUUID("6f3296a6-cf24-4c3e-9dba-334e4eb3fdd4"),
      "firstname": "Tekle",
      "lastname": "Berhan",
      "gender": "M",
      "email": "tekle@gov.et",
      "phone": "+2510977668899",
      "role": "employee",
      "password": hashPassword("Tekle@1234"),
    },
    {
      "id": fromDriverUUID("2f1f1283-d403-4892-bc6c-a52f87513318"),
      "firstname": "Helen",
      "lastname": "Alemu",
      "gender": "F",
      "email": "helen@elitefitness.com",
      "phone": "+2510988779900",
      "role": "employee",
      "password": hashPassword("Helen@1234"),
    },
  ],
  
  "organization": [
    {
      "id": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000"),
      "name": "Nati Barber Shop",
      "slug": "nati-barber-shop",
      "description": "Get better hair cuts",
      "sector": "Beauty",
      "isGovernment": false,
      "isActive": true,
      "address": "Yeka, Addis Abeba",
      "email": "natibarbershop@gmail.com",
      "phone": "+2510912345678",
      "adminId": fromDriverUUID("b5c6d7e8-f9a0-41b2-c3d4-e5f6a7b8c9d0"),
      "pricingPlanId": "small",
      "billingPeriod": "monthly"
    },
    {
      "id": fromDriverUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
      "name": "Premium Salon & Spa",
      "slug": "premium-salon-spa",
      "description": "Luxury hair and beauty treatments",
      "sector": "Beauty",
      "isGovernment": false,
      "isActive": true,
      "address": "Bole, Addis Abeba",
      "email": "info@premiumsalon.com",
      "phone": "+2510922334455",
      "adminId": fromDriverUUID("d7e8f9a0-b1c2-43d4-e5f6-a7b8c9d0e1f2"),
      "pricingPlanId": "medium",
      "billingPeriod": "yearly"
    },
    {
      "id": fromDriverUUID("7c9e6679-7425-40de-944b-e07fc1f90ae7"),
      "name": "City Medical Center",
      "slug": "city-medical-center",
      "description": "Full-service medical facility",
      "sector": "Healthcare",
      "isGovernment": false,
      "isActive": true,
      "address": "Kirkos, Addis Abeba",
      "email": "contact@citymedical.com",
      "phone": "+2510933445566",
      "adminId": fromDriverUUID("f3a4b5c6-d7e8-49f0-a1b2-c3d4e5f6a7b8"),
      "pricingPlanId": "large",
      "billingPeriod": "yearly"
    },
    {
      "id": fromDriverUUID("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"),
      "name": "Government Dental Clinic",
      "slug": "gov-dental-clinic",
      "description": "Affordable dental care for all",
      "sector": "Healthcare",
      "isGovernment": true,
      "isActive": true,
      "address": "Piassa, Addis Abeba",
      "email": "dental@gov.et",
      "phone": "+2510944556677",
      "adminId": fromDriverUUID("76f4b161-8a30-44f7-a524-c2fee2abbabb"),
      "pricingPlanId": "large",
      "billingPeriod": "monthly"
    },
    {
      "id": fromDriverUUID("b0f2b7b9-8e5a-4f1d-9a2c-4c5d6e7f8a9b"),
      "name": "Elite Fitness Gym",
      "slug": "elite-fitness-gym",
      "description": "State-of-the-art fitness facility",
      "sector": "Fitness",
      "isGovernment": false,
      "isActive": false,
      "address": "Cazanchise, Addis Abeba",
      "email": "info@elitefitness.com",
      "phone": "+2510955667788",
      "adminId": fromDriverUUID("53bf8f92-1cb8-45b8-8731-331249b02b93"),
      "pricingPlanId": "small",
      "billingPeriod": "monthly"
    }
  ],
  
  "organizationCalendar": [
    {
      "id": fromDriverUUID("c0a80121-7b3e-4d1e-8b9a-2f5c6d8e9f0a"),
      "name": "Mon-Fri",
      "description": "Monday to Friday schedule",
      "available": {
        "weekly": [1, 2, 3, 4, 5]
      },
      "organizationId": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000")
    },
    {
      "id": fromDriverUUID("d1a2b3c4-d5e6-47f8-90a1-b2c3d4e5f6a7"),
      "name": "Mon-Sat",
      "description": "Monday to Saturday schedule",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6]
      },
      "organizationId": fromDriverUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
    },
    {
      "id": fromDriverUUID("e2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7"),
      "name": "Full Week",
      "description": "7 days a week",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6, 7]
      },
      "organizationId": fromDriverUUID("7c9e6679-7425-40de-944b-e07fc1f90ae7")
    }
  ],
  
  "organizationService": [
    {
      "id": fromDriverUUID("d3e4f5a6-b7c8-49d0-e1f2-a3b4c5d6e7f8"),
      "name": "Haircut - Classic",
      "description": "Traditional haircut with scissors",
      "price": 150,
      "organizationId": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("e4f5a6b7-c8d9-40e1-f2a3-b4c5d6e7f8a9"),
      "name": "Haircut - Modern Fade",
      "description": "Trendy fade haircut with clippers",
      "price": 200,
      "organizationId": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("f5a6b7c8-d9e0-41f2-a3b4-c5d6e7f8a9b0"),
      "name": "Beard Trim & Shape",
      "description": "Professional beard grooming",
      "price": 100,
      "organizationId": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("a6b7c8d9-e0f1-42a3-b4c5-d6e7f8a9b0c1"),
      "name": "Hair Coloring",
      "description": "Full hair coloring treatment",
      "price": 800,
      "organizationId": fromDriverUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("b7c8d9e0-f1a2-43b4-c5d6-e7f8a9b0c1d2"),
      "name": "Dental Cleaning",
      "description": "Professional teeth cleaning",
      "price": 500,
      "organizationId": fromDriverUUID("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("c8d9e0f1-a2b3-44c5-d6e7-f8a9b0c1d2e3"),
      "name": "Personal Training Session",
      "description": "1-on-1 fitness training",
      "price": 400,
      "organizationId": fromDriverUUID("b0f2b7b9-8e5a-4f1d-9a2c-4c5d6e7f8a9b"),
      "isActive": true
    }
  ],
  
  "employee": [
    {
      "id": fromDriverUUID("a0b1c2d3-e4f5-46a7-b8c9-d0e1f2a3b4c5"),
      "userId": fromDriverUUID("f7b65ae8-edfb-4e11-a97b-647c712a257c"),
      "organizationId": fromDriverUUID("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"),
      "calendarId": fromDriverUUID("e2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7"),
      "jobTitle": "Dental Hygienist",
      "jobDescription": "Professional teeth cleaning and care",
      "isActive": true
    },
    {
      "id": fromDriverUUID("b1c2d3e4-f5a6-47b8-c9d0-e1f2a3b4c5d6"),
      "userId": fromDriverUUID("6f3296a6-cf24-4c3e-9dba-334e4eb3fdd4"),
      "organizationId": fromDriverUUID("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"),
      "calendarId": fromDriverUUID("c0a80121-7b3e-4d1e-8b9a-2f5c6d8e9f0a"),
      "jobTitle": "Dentist",
      "jobDescription": "General dentistry and oral surgery",
      "isActive": true
    },
    {
      "id": fromDriverUUID("c2d3e4f5-a6b7-48c9-d0e1-f2a3b4c5d6e7"),
      "userId": fromDriverUUID("2f1f1283-d403-4892-bc6c-a52f87513318"),
      "organizationId": fromDriverUUID("b0f2b7b9-8e5a-4f1d-9a2c-4c5d6e7f8a9b"),
      "calendarId": fromDriverUUID("d1a2b3c4-d5e6-47f8-90a1-b2c3d4e5f6a7"),
      "jobTitle": "Personal Trainer",
      "jobDescription": "Fitness training and nutrition guidance",
      "isActive": false
    },
    {
      "id": fromDriverUUID("e8f9a0b1-c2d3-44e5-f6a7-b8c9d0e1f2a3"),
      "userId": fromDriverUUID("f3a4b5c6-d7e8-49f0-a1b2-c3d4e5f6a7b8"),
      "organizationId": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000"),
      "calendarId": fromDriverUUID("c0a80121-7b3e-4d1e-8b9a-2f5c6d8e9f0a"),
      "jobTitle": "Cool Barber",
      "jobDescription": "Specializes in modern haircuts and fades",
      "isActive": true
    },
    {
      "id": fromDriverUUID("f9a0b1c2-d3e4-45f6-a7b8-c9d0e1f2a3b4"),
      "userId": fromDriverUUID("d7e8f9a0-b1c2-43d4-e5f6-a7b8c9d0e1f2"),
      "organizationId": fromDriverUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
      "calendarId": fromDriverUUID("d1a2b3c4-d5e6-47f8-90a1-b2c3d4e5f6a7"),
      "jobTitle": "Senior Stylist",
      "jobDescription": "Expert in hair coloring and styling",
      "isActive": true
    },
  ],
  
  "appointment": [
    {
      "id": fromDriverUUID("d9e0f1a2-b3c4-45d6-e7f8-a9b0c1d2e3f4"),
      "serviceId": fromDriverUUID("d3e4f5a6-b7c8-49d0-e1f2-a3b4c5d6e7f8"),
      "organizationId": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000"),
      "clientId": fromDriverUUID("c6d7e8f9-a0b1-42c3-d4e5-f6a7b8c9d0e1"),
      "userId": fromDriverUUID("b5c6d7e8-f9a0-41b2-c3d4-e5f6a7b8c9d0"),
      "startTime": new Date("2026-04-20T10:00:00Z"),
      "endTime": new Date("2026-04-20T10:30:00Z"),
      // "status": "scheduled",
      "notes": "First time customer",
      "isActive": true,
    },
    {
      "id": fromDriverUUID("e0f1a2b3-c4d5-46e7-f8a9-b0c1d2e3f4a5"),
      "serviceId": fromDriverUUID("f5a6b7c8-d9e0-41f2-a3b4-c5d6e7f8a9b0"),
      "organizationId": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000"),
      "clientId": fromDriverUUID("c6d7e8f9-a0b1-42c3-d4e5-f6a7b8c9d0e1"),
      "userId": fromDriverUUID("c6d7e8f9-a0b1-42c3-d4e5-f6a7b8c9d0e1"),
      "startTime": new Date("2026-04-20T14:00:00Z"),
      "endTime": new Date("2026-04-20T14:20:00Z"),
      // "status": "scheduled"
      "isActive": true,
    },
    {
      "id": fromDriverUUID("f1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6"),
      "serviceId": fromDriverUUID("e4f5a6b7-c8d9-40e1-f2a3-b4c5d6e7f8a9"),
      "organizationId": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000"),
      "clientId": fromDriverUUID("c6d7e8f9-a0b1-42c3-d4e5-f6a7b8c9d0e1"),
      "customerName": "Biruk Lemma",
      "customerPhone": "+2510911556677",
      "startTime": new Date("2026-04-21T11:00:00Z"),
      "endTime": new Date("2026-04-21T11:45:00Z"),
      // "status": "pending"
      "isActive": true,
    }
  ],
  
  // "task": [
  //   {
  //     "id": fromDriverUUID("a2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7"),
  //     "name": "Setup organization billing",
  //     "status": "completed",
  //     "progress": 100,
  //     "serviceId": null,
  //     "organizationId": fromDriverUUID("550e8400-e29b-41d4-a716-446655440000")
  //   },
  //   {
  //     "id": fromDriverUUID("b3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8"),
  //     "name": "Onboard employees",
  //     "status": "in_progress",
  //     "progress": 60,
  //     "serviceId": null,
  //     "organizationId": fromDriverUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
  //   },
  //   {
  //     "id": fromDriverUUID("c4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9"),
  //     "name": "Configure service pricing",
  //     "status": "pending",
  //     "progress": 0,
  //     "serviceId": null,
  //     "organizationId": fromDriverUUID("b0f2b7b9-8e5a-4f1d-9a2c-4c5d6e7f8a9b")
  //   }
  // ],
  
}

export default sampleData;
