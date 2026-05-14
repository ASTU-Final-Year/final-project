import { fromDriverUUID } from "~/lib";
import { hashPassword } from "~/middleware";

export const sampleData = {
  "user": [
    {
      "id": fromDriverUUID("df5282fa-5987-4c7b-ae1f-72186a479842"),
      "firstname": "Natnael",
      "lastname": "Tadesse",
      "gender": "M",
      "role": "super_admin",
      "email": "natnaeltadesse@gmail.com",
      "phone": "+2510922113344",
      "password": hashPassword("Natnael@1234")
    },
    {
      "id": fromDriverUUID("172b0916-2134-4ade-989f-6b43fa0d7de9"),
      "firstname": "Abebe",
      "lastname": "Tadesse",
      "gender": "M",
      "role": "organization_admin",
      "email": "abebe@gmail.com",
      "phone": "+2510912345678",
      "password": hashPassword("Abebe@1234"),
    },
    {
      "id": fromDriverUUID("3cb48070-cd8a-4e74-9f89-2a04a9bb598c"),
      "firstname": "Natnael",
      "lastname": "Tsegaye",
      "gender": "M",
      "role": "organization_admin",
      "email": "natnaeltsegaye@gmail.com",
      "phone": "+2510933224455",
      "password": hashPassword("Natnael@1234")
    },
    {
      "id": fromDriverUUID("7a58c6ba-939e-4d87-82d2-d56c7ff9ee3c"),
      "firstname": "Abel",
      "lastname": "Girma",
      "gender": "M",
      "role": "client",
      "email": "abel@gmail.com",
      "phone": "+2510944335566",
      "password": hashPassword("Abel@1234")
    },
    {
      "id": fromDriverUUID("ba189bc3-4767-497a-a48d-8eff48cd5a09"),
      "firstname": "Selam",
      "lastname": "Tesfaye",
      "gender": "F",
      "role": "organization_admin",
      "email": "selam@premiumsalon.com",
      "phone": "+2510955446677",
      "password": hashPassword("Selam@1234"),
    },
    {
      "id": fromDriverUUID("011928cb-30c5-41ba-8151-89250b3105ce"),
      "firstname": "Demeke",
      "lastname": "Tadesse",
      "gender": "M",
      "role": "organization_admin",
      "email": "demeke@gmail.com",
      "phone": "+2510955446677",
      "password": hashPassword("Demeke@1234"),
    },
    {
      "id": fromDriverUUID("84f0282d-0237-4278-af00-3c60623235dc"),
      "firstname": "Kelemewerk",
      "lastname": "Tadesse",
      "gender": "F",
      "role": "organization_admin",
      "email": "kelem@gmail.com",
      "phone": "+2510955446677",
      "password": hashPassword("Kelem@1234"),
    },
    {
      "id": fromDriverUUID("955ef4a1-a6f5-4da6-a52b-3184bd3f7350"),
      "firstname": "Meron",
      "lastname": "Desta",
      "gender": "F",
      "email": "meron@citymedical.com",
      "phone": "+2510966557788",
      "role": "employee",
      "password": hashPassword("Meron@1234"),
    },
    {
      "id": fromDriverUUID("c947ca13-c092-4322-bfa1-6a46f359ccb4"),
      "firstname": "Tekle",
      "lastname": "Berhan",
      "gender": "M",
      "email": "tekle@gov.et",
      "phone": "+2510977668899",
      "role": "employee",
      "password": hashPassword("Tekle@1234"),
    },
    {
      "id": fromDriverUUID("6d949cea-54cf-458b-bc79-5c051eaa3907"),
      "firstname": "Helen",
      "lastname": "Alemu",
      "gender": "F",
      "email": "helen@elitefitness.com",
      "phone": "+2510988779900",
      "role": "employee",
      "password": hashPassword("Helen@1234"),
    },
    // Additional clients
    {
      "id": fromDriverUUID("f5ead93b-9465-46af-985b-fbb2aaa79df8"),
      "firstname": "Biruk",
      "lastname": "Lemma",
      "gender": "M",
      "role": "client",
      "email": "biruklemma@gmail.com",
      "phone": "+2510911556677",
      "password": hashPassword("Biruk@1234")
    },
    {
      "id": fromDriverUUID("d5c7a08d-7a1b-4a88-ba1a-3528b68184cf"),
      "firstname": "Tigist",
      "lastname": "Worku",
      "gender": "F",
      "role": "client",
      "email": "tigistworku@gmail.com",
      "phone": "+2510922667788",
      "password": hashPassword("Tigist@1234")
    },
    {
      "id": fromDriverUUID("19257345-fa9f-4d40-9918-429f152015a0"),
      "firstname": "Dawit",
      "lastname": "Haile",
      "gender": "M",
      "role": "client",
      "email": "dawithaile@gmail.com",
      "phone": "+2510933778899",
      "password": hashPassword("Dawit@1234")
    },
    // New organization admins
    {
      "id": fromDriverUUID("a4b3c742-b8d0-4013-90e4-c863ea1de535"),
      "firstname": "Yonas",
      "lastname": "Ayele",
      "gender": "M",
      "role": "organization_admin",
      "email": "yonas@autocare.com",
      "phone": "+2510944889900",
      "password": hashPassword("Yonas@1234")
    },
    {
      "id": fromDriverUUID("681ee00c-160f-491d-905b-c2f8769b7631"),
      "firstname": "Dr.",
      "lastname": "Selamawit",
      "gender": "F",
      "role": "organization_admin",
      "email": "selamawit@bethzatha.com",
      "phone": "+2510955990011",
      "password": hashPassword("Selamawit@1234")
    },
    {
      "id": fromDriverUUID("65724749-6b22-4363-8886-78af3d3629f6"),
      "firstname": "Tadesse",
      "lastname": "Mekonnen",
      "gender": "M",
      "role": "organization_admin",
      "email": "tadesse@revenue.gov.et",
      "phone": "+2510966001122",
      "password": hashPassword("Tadesse@1234")
    },
    {
      "id": fromDriverUUID("2ca64980-9fa1-4743-8f69-ded58788bbab"),
      "firstname": "Azeb",
      "lastname": "Gebre",
      "gender": "F",
      "role": "organization_admin",
      "email": "azeb@ethiotelecom.com",
      "phone": "+2510977112233",
      "password": hashPassword("Azeb@1234")
    },
    {
      "id": fromDriverUUID("4015f9b8-abc4-4895-9db3-9ace50707167"),
      "firstname": "Samuel",
      "lastname": "Assefa",
      "gender": "M",
      "role": "organization_admin",
      "email": "samuel@habeshabank.com",
      "phone": "+2510988223344",
      "password": hashPassword("Samuel@1234")
    },
    {
      "id": fromDriverUUID("ddab46e2-797a-48bf-a1f6-849b4c9f11d3"),
      "firstname": "Dr.",
      "lastname": "Mulugeta",
      "gender": "M",
      "role": "organization_admin",
      "email": "mulugeta@yekatit12.gov.et",
      "phone": "+2510999334455",
      "password": hashPassword("Mulugeta@1234")
    },
    {
      "id": fromDriverUUID("ee1b8fed-1c44-47ff-b50c-4b78a66d84bb"),
      "firstname": "Dr.",
      "lastname": "Tigist",
      "gender": "F",
      "role": "organization_admin",
      "email": "tigist@stpaul.com",
      "phone": "+2510910445566",
      "password": hashPassword("Tigist@1234")
    },
    // New employees for hospitals
    {
      "id": fromDriverUUID("300a2696-a47c-4882-8afb-9ea734ee3f96"),
      "firstname": "Nurse",
      "lastname": "Alemitu",
      "gender": "F",
      "role": "employee",
      "email": "alemitu@yekatit12.gov.et",
      "phone": "+2510921556677",
      "password": hashPassword("Alemitu@1234")
    },
    {
      "id": fromDriverUUID("56e67168-bbd4-4861-85ad-ed824dc7e9c6"),
      "firstname": "Dr.",
      "lastname": "Abebech",
      "gender": "F",
      "role": "employee",
      "email": "abebech@stpaul.com",
      "phone": "+2510932667788",
      "password": hashPassword("Abebech@1234")
    },
    {
      "id": fromDriverUUID("9dc3570b-50c0-4515-b1ca-3431062d59d9"),
      "firstname": "Dr.",
      "lastname": "Yonas",
      "gender": "M",
      "role": "employee",
      "email": "yonas@myungsung.com",
      "phone": "+2510943778899",
      "password": hashPassword("Yonas@1234")
    },
    {
      "id": fromDriverUUID("641a31c0-a41d-42e3-8dc6-01cb58350b50"),
      "firstname": "Nurse",
      "lastname": "Selam",
      "gender": "F",
      "role": "employee",
      "email": "selam@myungsung.com",
      "phone": "+2510954889900",
      "password": hashPassword("Selam@1234")
    }
  ],
  
  "organization": [
    {
      "id": fromDriverUUID("4bd16724-94c7-428b-b8ed-ae02a6b62a04"),
      "name": "Nati Barber Shop",
      "slug": "nati-barber-shop",
      "description": "Get better hair cuts",
      "sector": "Beauty",
      "isGovernment": false,
      "isActive": true,
      "address": "Yeka, Addis Abeba",
      "email": "natibarbershop@gmail.com",
      "phone": "+2510912345678",
      "adminId": fromDriverUUID("3cb48070-cd8a-4e74-9f89-2a04a9bb598c"),
      "pricingPlanId": "small",
      "billingPeriod": "monthly"
    },
    {
      "id": fromDriverUUID("83824481-00e1-4b05-b7e3-de54026b1f47"),
      "name": "Premium Salon & Spa",
      "slug": "premium-salon-spa",
      "description": "Luxury hair and beauty treatments",
      "sector": "Beauty",
      "isGovernment": false,
      "isActive": true,
      "address": "Bole, Addis Abeba",
      "email": "info@premiumsalon.com",
      "phone": "+2510922334455",
      "adminId": fromDriverUUID("ba189bc3-4767-497a-a48d-8eff48cd5a09"),
      "pricingPlanId": "medium",
      "billingPeriod": "yearly"
    },
    {
      "id": fromDriverUUID("976e9b87-f6c3-416a-9e1a-e0350e359697"),
      "name": "City Medical Center",
      "slug": "city-medical-center",
      "description": "Full-service medical facility",
      "sector": "Healthcare",
      "isGovernment": false,
      "isActive": true,
      "address": "Kirkos, Addis Abeba",
      "email": "contact@citymedical.com",
      "phone": "+2510933445566",
      "adminId": fromDriverUUID("172b0916-2134-4ade-989f-6b43fa0d7de9"),
      "pricingPlanId": "large",
      "billingPeriod": "yearly"
    },
    {
      "id": fromDriverUUID("0b7ab6df-13c0-4e29-885c-7ac5631588f6"),
      "name": "Government Dental Clinic",
      "slug": "gov-dental-clinic",
      "description": "Affordable dental care for all",
      "sector": "Healthcare",
      "isGovernment": true,
      "isActive": true,
      "address": "Piassa, Addis Abeba",
      "email": "dental@gov.et",
      "phone": "+2510944556677",
      "adminId": fromDriverUUID("84f0282d-0237-4278-af00-3c60623235dc"),
      "pricingPlanId": "large",
      "billingPeriod": "monthly"
    },
    {
      "id": fromDriverUUID("f15e3b68-2bd4-4070-8377-1ca6dba659c5"),
      "name": "Elite Fitness Gym",
      "slug": "elite-fitness-gym",
      "description": "State-of-the-art fitness facility",
      "sector": "Fitness",
      "isGovernment": false,
      "isActive": true,
      "address": "Cazanchise, Addis Abeba",
      "email": "info@elitefitness.com",
      "phone": "+2510955667788",
      "adminId": fromDriverUUID("011928cb-30c5-41ba-8151-89250b3105ce"),
      "pricingPlanId": "small",
      "billingPeriod": "monthly"
    },
    {
      "id": fromDriverUUID("fc53bec0-736f-4b93-adf5-c3ac25dbc1be"),
      "name": "AutoCare Plus",
      "slug": "autocare-plus",
      "description": "Professional auto repair and maintenance",
      "sector": "Automotive",
      "isGovernment": false,
      "isActive": true,
      "address": "Mexico, Addis Abeba",
      "email": "service@autocareplus.com",
      "phone": "+2510911557788",
      "adminId": fromDriverUUID("a4b3c742-b8d0-4013-90e4-c863ea1de535"),
      "pricingPlanId": "medium",
      "billingPeriod": "monthly"
    },
    {
      "id": fromDriverUUID("81e054ac-aafc-4fa3-8d22-f261432518da"),
      "name": "Bethzatha General Hospital",
      "slug": "bethzatha-hospital",
      "description": "Comprehensive healthcare services",
      "sector": "Healthcare",
      "isGovernment": false,
      "isActive": true,
      "address": "Gulele, Addis Abeba",
      "email": "info@bethzatha.com",
      "phone": "+2510922668899",
      "adminId": fromDriverUUID("681ee00c-160f-491d-905b-c2f8769b7631"),
      "pricingPlanId": "large",
      "billingPeriod": "yearly"
    },
    // NEW HOSPITALS
    {
      "id": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944"),
      "name": "Yekatit 12 Hospital",
      "slug": "yekatit-12-hospital",
      "description": "Government referral hospital",
      "sector": "Healthcare",
      "isGovernment": true,
      "isActive": true,
      "address": "Kebena, Addis Abeba",
      "email": "info@yekatit12.gov.et",
      "phone": "+2510933779900",
      "adminId": fromDriverUUID("ddab46e2-797a-48bf-a1f6-849b4c9f11d3"),
      "pricingPlanId": "large",
      "billingPeriod": "yearly"
    },
    {
      "id": fromDriverUUID("53d7a49a-93f0-4b3b-ae46-956bb2d5403d"),
      "name": "St. Paul Hospital",
      "slug": "st-paul-hospital",
      "description": "University teaching hospital",
      "sector": "Healthcare",
      "isGovernment": true,
      "isActive": true,
      "address": "Gulele, Addis Abeba",
      "email": "contact@stpaul.com",
      "phone": "+2510944880011",
      "adminId": fromDriverUUID("ee1b8fed-1c44-47ff-b50c-4b78a66d84bb"),
      "pricingPlanId": "large",
      "billingPeriod": "yearly"
    },
    {
      "id": fromDriverUUID("13485662-824f-4a1a-9c14-c50fe68e91d6"),
      "name": "Myungsung Christian Hospital",
      "slug": "myungsung-hospital",
      "description": "Private Christian hospital",
      "sector": "Healthcare",
      "isGovernment": false,
      "isActive": true,
      "address": "Gurd Shola, Addis Abeba",
      "email": "info@myungsung.com",
      "phone": "+2510955991122",
      "adminId": fromDriverUUID("4015f9b8-abc4-4895-9db3-9ace50707167"),
      "pricingPlanId": "medium",
      "billingPeriod": "monthly"
    },
    {
      "id": fromDriverUUID("5a31b145-0992-4e12-b6d0-b9917c0f7cfd"),
      "name": "Ethiopian Revenue Authority",
      "slug": "ethiopian-revenue",
      "description": "Government tax collection and services",
      "sector": "Government",
      "isGovernment": true,
      "isActive": true,
      "address": "Kazanchise, Addis Abeba",
      "email": "service@revenue.gov.et",
      "phone": "+2510966001122",
      "adminId": fromDriverUUID("65724749-6b22-4363-8886-78af3d3629f6"),
      "pricingPlanId": "large",
      "billingPeriod": "yearly"
    },
    {
      "id": fromDriverUUID("d9940d5b-7158-475f-bd97-22c6dec23350"),
      "name": "Ethio Telecom",
      "slug": "ethio-telecom",
      "description": "Telecommunications services",
      "sector": "Telecommunications",
      "isGovernment": true,
      "isActive": true,
      "address": "Churchill Road, Addis Abeba",
      "email": "customercare@ethiotelecom.et",
      "phone": "+2510977112233",
      "adminId": fromDriverUUID("2ca64980-9fa1-4743-8f69-ded58788bbab"),
      "pricingPlanId": "large",
      "billingPeriod": "monthly"
    },
    {
      "id": fromDriverUUID("9ed5e12e-7de5-4dd8-bb97-7b0031f10979"),
      "name": "Habesha Bank",
      "slug": "habesha-bank",
      "description": "Commercial banking services",
      "sector": "Banking",
      "isGovernment": false,
      "isActive": true,
      "address": "Bole Road, Addis Abeba",
      "email": "customercare@habeshabank.com",
      "phone": "+2510988223344",
      "adminId": fromDriverUUID("4015f9b8-abc4-4895-9db3-9ace50707167"),
      "pricingPlanId": "medium",
      "billingPeriod": "yearly"
    },
    {
      "id": fromDriverUUID("47a0016c-008f-497b-a906-3f2317b1c9e1"),
      "name": "Sheger Cafe & Restaurant",
      "slug": "sheger-cafe",
      "description": "Traditional Ethiopian cuisine",
      "sector": "Food & Beverage",
      "isGovernment": false,
      "isActive": true,
      "address": "Piassa, Addis Abeba",
      "email": "info@shegercafe.com",
      "phone": "+2510999334455",
      "adminId": fromDriverUUID("011928cb-30c5-41ba-8151-89250b3105ce"),
      "pricingPlanId": "small",
      "billingPeriod": "monthly"
    },
    {
      "id": fromDriverUUID("e24dfabc-07c1-428c-85fb-a7503068136b"),
      "name": "Addis Tech Hub",
      "slug": "addis-tech-hub",
      "description": "IT training and consulting",
      "sector": "Technology",
      "isGovernment": false,
      "isActive": true,
      "address": "4 Kilo, Addis Abeba",
      "email": "contact@addistech.com",
      "phone": "+2510910445566",
      "adminId": fromDriverUUID("3cb48070-cd8a-4e74-9f89-2a04a9bb598c"),
      "pricingPlanId": "small",
      "billingPeriod": "monthly"
    }
  ],
  
  "organizationCalendar": [
    // Nati Barber Shop calendars
    {
      "id": fromDriverUUID("c8daca93-0603-41ce-ba51-324d6b081e1e"),
      "name": "Mon-Fri",
      "description": "Monday to Friday schedule",
      "available": {
        "weekly": [1, 2, 3, 4, 5],
        "hours": [["09:00", "18:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("4bd16724-94c7-428b-b8ed-ae02a6b62a04")
    },
    {
      "id": fromDriverUUID("70adc961-2f3f-435e-96cd-422f7bea52e5"),
      "name": "Weekend",
      "description": "Saturday schedule",
      "available": {
        "weekly": [6],
        "hours": [["10:00", "15:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("4bd16724-94c7-428b-b8ed-ae02a6b62a04")
    },
    
    // Premium Salon & Spa calendars
    {
      "id": fromDriverUUID("895baf0f-7269-41b7-96bc-2624b51813dd"),
      "name": "Mon-Sat",
      "description": "Monday to Saturday schedule",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6],
        "hours": [["08:00", "20:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("83824481-00e1-4b05-b7e3-de54026b1f47")
    },
    {
      "id": fromDriverUUID("5da92f8e-6abd-4eeb-a8e4-b8719d2b48ba"),
      "name": "Sunday Special",
      "description": "Sunday limited hours",
      "available": {
        "weekly": [7],
        "hours": [["10:00", "16:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("83824481-00e1-4b05-b7e3-de54026b1f47")
    },
    
    // City Medical Center calendars
    {
      "id": fromDriverUUID("c2837034-512f-4788-b1f9-c1516907b6c4"),
      "name": "Full Week",
      "description": "7 days a week",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6, 7],
        "hours": [["00:00", "23:59"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("976e9b87-f6c3-416a-9e1a-e0350e359697")
    },
    
    // Government Dental Clinic calendars
    {
      "id": fromDriverUUID("33a8c73c-ebd4-4445-8f38-6c25423aeedd"),
      "name": "Weekdays Only",
      "description": "Monday to Friday, government hours",
      "available": {
        "weekly": [1, 2, 3, 4, 5],
        "hours": [["08:30", "16:30"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("0b7ab6df-13c0-4e29-885c-7ac5631588f6")
    },
    
    // Elite Fitness Gym calendars
    {
      "id": fromDriverUUID("e20446fc-6b34-4820-b3e5-35848b9bce5d"),
      "name": "Full Week Early Bird",
      "description": "Early morning to late night",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6, 7],
        "hours": [["05:00", "22:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("f15e3b68-2bd4-4070-8377-1ca6dba659c5")
    },
    
    // AutoCare Plus calendars
    {
      "id": fromDriverUUID("7f9b9b3e-26e3-4f72-916f-cc668d5c696a"),
      "name": "Mon-Sat Workshop",
      "description": "Service center hours",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6],
        "hours": [["08:00", "18:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("fc53bec0-736f-4b93-adf5-c3ac25dbc1be")
    },
    
    // Bethzatha Hospital calendars
    {
      "id": fromDriverUUID("22860e92-e9a0-4542-a143-6776780bdb1a"),
      "name": "24/7 Emergency",
      "description": "Always open",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6, 7],
        "hours": [["00:00", "23:59"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("81e054ac-aafc-4fa3-8d22-f261432518da")
    },
    {
      "id": fromDriverUUID("7c3554db-a0ff-4dcd-aace-f57c5e19018f"),
      "name": "Outpatient Clinic",
      "description": "Regular clinic hours",
      "available": {
        "weekly": [1, 2, 3, 4, 5],
        "hours": [["08:00", "17:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("81e054ac-aafc-4fa3-8d22-f261432518da")
    },
    
    // Yekatit 12 Hospital calendars
    {
      "id": fromDriverUUID("587b1268-4162-49f5-8f9e-2bde50c3b186"),
      "name": "Emergency 24/7",
      "description": "24/7 emergency services",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6, 7],
        "hours": [["00:00", "23:59"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944")
    },
    {
      "id": fromDriverUUID("06dda58f-4538-41b3-830e-f65580809b64"),
      "name": "Regular Clinic",
      "description": "General clinic hours",
      "available": {
        "weekly": [1, 2, 3, 4, 5],
        "hours": [["08:00", "18:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944")
    },
    
    // St. Paul Hospital calendars
    {
      "id": fromDriverUUID("35ebd79b-4033-49c8-8b80-d91c847b4f65"),
      "name": "Full Service",
      "description": "24/7 hospital services",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6, 7],
        "hours": [["00:00", "23:59"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("53d7a49a-93f0-4b3b-ae46-956bb2d5403d")
    },
    {
      "id": fromDriverUUID("570c7cf6-0337-4334-89a1-e8b4738b5f94"),
      "name": "Teaching Hours",
      "description": "Academic medical center hours",
      "available": {
        "weekly": [1, 2, 3, 4, 5],
        "hours": [["07:00", "19:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("53d7a49a-93f0-4b3b-ae46-956bb2d5403d")
    },
    
    // Myungsung Hospital calendars
    {
      "id": fromDriverUUID("08ab728c-a2f3-4417-8a84-88d171baaafd"),
      "name": "Private Hours",
      "description": "Private hospital hours",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6],
        "hours": [["07:00", "21:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("13485662-824f-4a1a-9c14-c50fe68e91d6")
    },
    {
      "id": fromDriverUUID("01a12379-6f9a-432c-8252-a30c19893c52"),
      "name": "Specialist Clinic",
      "description": "Specialist appointment hours",
      "available": {
        "weekly": [1, 2, 4, 5],
        "hours": [["09:00", "17:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("13485662-824f-4a1a-9c14-c50fe68e91d6")
    },
    
    // Ethiopian Revenue Authority calendars
    {
      "id": fromDriverUUID("83ff2216-4fe6-47b2-9723-842d50c4d2e2"),
      "name": "Business Hours",
      "description": "Government office hours",
      "available": {
        "weekly": [1, 2, 3, 4, 5],
        "hours": [["08:30", "17:30"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("5a31b145-0992-4e12-b6d0-b9917c0f7cfd")
    },
    
    // Ethio Telecom calendars
    {
      "id": fromDriverUUID("37a47691-d55a-4124-9ff4-6aa4cd714bcd"),
      "name": "Customer Service",
      "description": "Service center hours",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6],
        "hours": [["09:00", "18:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("d9940d5b-7158-475f-bd97-22c6dec23350")
    },
    
    // Habesha Bank calendars
    {
      "id": fromDriverUUID("287111d6-87c8-4380-80b7-440bd2af3cd9"),
      "name": "Banking Hours",
      "description": "Regular banking hours",
      "available": {
        "weekly": [1, 2, 3, 4, 5],
        "hours": [["08:00", "16:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("9ed5e12e-7de5-4dd8-bb97-7b0031f10979")
    },
    
    // Sheger Cafe calendars
    {
      "id": fromDriverUUID("d3704081-1ddb-4062-b4b5-ad1c5ccd5573"),
      "name": "Restaurant Hours",
      "description": "Open daily",
      "available": {
        "weekly": [1, 2, 3, 4, 5, 6, 7],
        "hours": [["07:00", "22:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("47a0016c-008f-497b-a906-3f2317b1c9e1")
    },
    
    // Addis Tech Hub calendars
    {
      "id": fromDriverUUID("b93537b9-842c-4f75-9e08-bdfef28a858f"),
      "name": "Training Days",
      "description": "Weekday training",
      "available": {
        "weekly": [1, 2, 3, 4, 5],
        "hours": [["09:00", "20:00"]]
      },
      "unavailable": {
        "hours": [["11:30", "14:00"]]
      },
      "organizationId": fromDriverUUID("e24dfabc-07c1-428c-85fb-a7503068136b")
    }
  ],
  
  "organizationService": [
    // Nati Barber Shop services
    {
      "id": fromDriverUUID("1e1164a7-9843-449c-a574-44a4443bcbd8"),
      "name": "Haircut - Classic",
      "description": "Traditional haircut with scissors",
      "price": 150,
      "organizationId": fromDriverUUID("4bd16724-94c7-428b-b8ed-ae02a6b62a04"),
      "calendarId": fromDriverUUID("c8daca93-0603-41ce-ba51-324d6b081e1e"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("073598c8-bd74-409f-8ca1-e3b2fbc7a4de"),
      "name": "Haircut - Modern Fade",
      "description": "Trendy fade haircut with clippers",
      "price": 200,
      "organizationId": fromDriverUUID("4bd16724-94c7-428b-b8ed-ae02a6b62a04"),
      "calendarId": fromDriverUUID("c8daca93-0603-41ce-ba51-324d6b081e1e"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("9cef6cc2-ec9e-4e0c-99b7-a13e94eb5117"),
      "name": "Beard Trim & Shape",
      "description": "Professional beard grooming",
      "price": 100,
      "organizationId": fromDriverUUID("4bd16724-94c7-428b-b8ed-ae02a6b62a04"),
      "calendarId": fromDriverUUID("c8daca93-0603-41ce-ba51-324d6b081e1e"),
      "isActive": true
    },
    
    // Premium Salon & Spa services
    {
      "id": fromDriverUUID("76548561-2427-4efd-ac69-215c9f4739a8"),
      "name": "Hair Coloring",
      "description": "Full hair coloring treatment",
      "price": 800,
      "organizationId": fromDriverUUID("83824481-00e1-4b05-b7e3-de54026b1f47"),
      "calendarId": fromDriverUUID("895baf0f-7269-41b7-96bc-2624b51813dd"),
      "isActive": true
    },
    
    // City Medical Center services
    {
      "id": fromDriverUUID("079c5a08-283e-40eb-893b-f684cdeba680"),
      "name": "General Consultation",
      "description": "General medical consultation",
      "price": 300,
      "organizationId": fromDriverUUID("976e9b87-f6c3-416a-9e1a-e0350e359697"),
      "calendarId": fromDriverUUID("c2837034-512f-4788-b1f9-c1516907b6c4"),
      "isActive": true
    },
    
    // Government Dental Clinic services
    {
      "id": fromDriverUUID("6e605635-e0cf-4746-8e74-3b8de7502b4f"),
      "name": "Dental Cleaning",
      "description": "Professional teeth cleaning",
      "price": 500,
      "organizationId": fromDriverUUID("0b7ab6df-13c0-4e29-885c-7ac5631588f6"),
      "calendarId": fromDriverUUID("33a8c73c-ebd4-4445-8f38-6c25423aeedd"),
      "isActive": true
    },
    
    // Elite Fitness Gym services
    {
      "id": fromDriverUUID("1fa2559a-f669-4fbc-b35b-169965b84b3d"),
      "name": "Personal Training Session",
      "description": "1-on-1 fitness training",
      "price": 400,
      "organizationId": fromDriverUUID("f15e3b68-2bd4-4070-8377-1ca6dba659c5"),
      "calendarId": fromDriverUUID("e20446fc-6b34-4820-b3e5-35848b9bce5d"),
      "isActive": true
    },
    
    // AutoCare Plus services
    {
      "id": fromDriverUUID("e8cbdba0-b3b0-4180-bf7d-b0e942838afd"),
      "name": "Oil Change Service",
      "description": "Full synthetic oil change with filter",
      "price": 800,
      "organizationId": fromDriverUUID("fc53bec0-736f-4b93-adf5-c3ac25dbc1be"),
      "calendarId": fromDriverUUID("7f9b9b3e-26e3-4f72-916f-cc668d5c696a"),
      "isActive": true
    },
    
    // Bethzatha Hospital services
    {
      "id": fromDriverUUID("ffae90e8-26ac-47b0-b453-8bc64398aef7"),
      "name": "General Consultation",
      "description": "General medical consultation",
      "price": 500,
      "organizationId": fromDriverUUID("81e054ac-aafc-4fa3-8d22-f261432518da"),
      "calendarId": fromDriverUUID("7c3554db-a0ff-4dcd-aace-f57c5e19018f"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("5da92f8e-6abd-4eeb-a8e4-b8719d2b48ba"),
      "name": "Emergency Room",
      "description": "24/7 emergency care",
      "price": 1000,
      "organizationId": fromDriverUUID("81e054ac-aafc-4fa3-8d22-f261432518da"),
      "calendarId": fromDriverUUID("22860e92-e9a0-4542-a143-6776780bdb1a"),
      "isActive": true
    },
    
    // Yekatit 12 Hospital services
    {
      "id": fromDriverUUID("33a8c73c-ebd4-4445-8f38-6c25423aeedd"),
      "name": "Emergency Services",
      "description": "24/7 emergency department",
      "price": 800,
      "organizationId": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944"),
      "calendarId": fromDriverUUID("587b1268-4162-49f5-8f9e-2bde50c3b186"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("e20446fc-6b34-4820-b3e5-35848b9bce5d"),
      "name": "Outpatient Clinic",
      "description": "General outpatient services",
      "price": 400,
      "organizationId": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944"),
      "calendarId": fromDriverUUID("06dda58f-4538-41b3-830e-f65580809b64"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("7f9b9b3e-26e3-4f72-916f-cc668d5c696a"),
      "name": "Maternity Ward",
      "description": "Prenatal and delivery services",
      "price": 1500,
      "organizationId": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944"),
      "calendarId": fromDriverUUID("587b1268-4162-49f5-8f9e-2bde50c3b186"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("22860e92-e9a0-4542-a143-6776780bdb1a"),
      "name": "Pharmacy",
      "description": "Prescription medications",
      "price": 0,
      "organizationId": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944"),
      "calendarId": fromDriverUUID("06dda58f-4538-41b3-830e-f65580809b64"),
      "isActive": true
    },
    
    // St. Paul Hospital services
    {
      "id": fromDriverUUID("7c3554db-a0ff-4dcd-aace-f57c5e19018f"),
      "name": "Emergency & Trauma",
      "description": "Level 1 trauma center",
      "price": 1000,
      "organizationId": fromDriverUUID("53d7a49a-93f0-4b3b-ae46-956bb2d5403d"),
      "calendarId": fromDriverUUID("35ebd79b-4033-49c8-8b80-d91c847b4f65"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("587b1268-4162-49f5-8f9e-2bde50c3b186"),
      "name": "Cardiology",
      "description": "Heart specialist consultation",
      "price": 800,
      "organizationId": fromDriverUUID("53d7a49a-93f0-4b3b-ae46-956bb2d5403d"),
      "calendarId": fromDriverUUID("570c7cf6-0337-4334-89a1-e8b4738b5f94"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("06dda58f-4538-41b3-830e-f65580809b64"),
      "name": "Surgery",
      "description": "General and specialized surgery",
      "price": 5000,
      "organizationId": fromDriverUUID("53d7a49a-93f0-4b3b-ae46-956bb2d5403d"),
      "calendarId": fromDriverUUID("35ebd79b-4033-49c8-8b80-d91c847b4f65"),
      "isActive": true
    },
    
    // Myungsung Hospital services
    {
      "id": fromDriverUUID("35ebd79b-4033-49c8-8b80-d91c847b4f65"),
      "name": "Pediatrics",
      "description": "Children's medical care",
      "price": 600,
      "organizationId": fromDriverUUID("13485662-824f-4a1a-9c14-c50fe68e91d6"),
      "calendarId": fromDriverUUID("08ab728c-a2f3-4417-8a84-88d171baaafd"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("570c7cf6-0337-4334-89a1-e8b4738b5f94"),
      "name": "Orthopedics",
      "description": "Bone and joint specialist",
      "price": 700,
      "organizationId": fromDriverUUID("13485662-824f-4a1a-9c14-c50fe68e91d6"),
      "calendarId": fromDriverUUID("01a12379-6f9a-432c-8252-a30c19893c52"),
      "isActive": true
    },
    {
      "id": fromDriverUUID("08ab728c-a2f3-4417-8a84-88d171baaafd"),
      "name": "Dermatology",
      "description": "Skin care specialist",
      "price": 500,
      "organizationId": fromDriverUUID("13485662-824f-4a1a-9c14-c50fe68e91d6"),
      "calendarId": fromDriverUUID("08ab728c-a2f3-4417-8a84-88d171baaafd"),
      "isActive": true
    },
    
    // Ethiopian Revenue Authority services
    {
      "id": fromDriverUUID("01a12379-6f9a-432c-8252-a30c19893c52"),
      "name": "Tax Registration",
      "description": "Register for TIN and VAT",
      "price": 0,
      "organizationId": fromDriverUUID("5a31b145-0992-4e12-b6d0-b9917c0f7cfd"),
      "calendarId": fromDriverUUID("83ff2216-4fe6-47b2-9723-842d50c4d2e2"),
      "isActive": true
    },
    
    // Ethio Telecom services
    {
      "id": fromDriverUUID("83ff2216-4fe6-47b2-9723-842d50c4d2e2"),
      "name": "SIM Card Replacement",
      "description": "New SIM card issuance",
      "price": 50,
      "organizationId": fromDriverUUID("d9940d5b-7158-475f-bd97-22c6dec23350"),
      "calendarId": fromDriverUUID("37a47691-d55a-4124-9ff4-6aa4cd714bcd"),
      "isActive": true
    },
    
    // Habesha Bank services
    {
      "id": fromDriverUUID("37a47691-d55a-4124-9ff4-6aa4cd714bcd"),
      "name": "Account Opening",
      "description": "New bank account setup",
      "price": 0,
      "organizationId": fromDriverUUID("9ed5e12e-7de5-4dd8-bb97-7b0031f10979"),
      "calendarId": fromDriverUUID("287111d6-87c8-4380-80b7-440bd2af3cd9"),
      "isActive": true
    },
    
    // Sheger Cafe services
    {
      "id": fromDriverUUID("287111d6-87c8-4380-80b7-440bd2af3cd9"),
      "name": "Lunch Buffet",
      "description": "Full lunch buffet",
      "price": 250,
      "organizationId": fromDriverUUID("47a0016c-008f-497b-a906-3f2317b1c9e1"),
      "calendarId": fromDriverUUID("d3704081-1ddb-4062-b4b5-ad1c5ccd5573"),
      "isActive": true
    },
    
    // Addis Tech Hub services
    {
      "id": fromDriverUUID("d3704081-1ddb-4062-b4b5-ad1c5ccd5573"),
      "name": "Web Development Course",
      "description": "Full stack web development training",
      "price": 5000,
      "organizationId": fromDriverUUID("e24dfabc-07c1-428c-85fb-a7503068136b"),
      "calendarId": fromDriverUUID("b93537b9-842c-4f75-9e08-bdfef28a858f"),
      "isActive": true
    }
  ],
  
  "employee": [
    // Nati Barber Shop employees
    {
      "id": fromDriverUUID("b93537b9-842c-4f75-9e08-bdfef28a858f"),
      "userId": fromDriverUUID("3cb48070-cd8a-4e74-9f89-2a04a9bb598c"),
      "organizationId": fromDriverUUID("4bd16724-94c7-428b-b8ed-ae02a6b62a04"),
      "calendarId": fromDriverUUID("c8daca93-0603-41ce-ba51-324d6b081e1e"),
      "jobTitle": "Master Barber",
      "jobDescription": "Specializes in modern haircuts and fades",
      "isActive": true
    },
    
    // Premium Salon & Spa employees
    {
      "id": fromDriverUUID("36264c7f-ead1-4579-9a0c-e828c9997bc3"),
      "userId": fromDriverUUID("ba189bc3-4767-497a-a48d-8eff48cd5a09"),
      "organizationId": fromDriverUUID("83824481-00e1-4b05-b7e3-de54026b1f47"),
      "calendarId": fromDriverUUID("895baf0f-7269-41b7-96bc-2624b51813dd"),
      "jobTitle": "Senior Stylist",
      "jobDescription": "Expert in hair coloring and styling",
      "isActive": true
    },
    
    // City Medical Center employees
    {
      "id": fromDriverUUID("c1f514ef-eac4-468f-bfd4-89628cafa8ea"),
      "userId": fromDriverUUID("955ef4a1-a6f5-4da6-a52b-3184bd3f7350"),
      "organizationId": fromDriverUUID("976e9b87-f6c3-416a-9e1a-e0350e359697"),
      "calendarId": fromDriverUUID("c2837034-512f-4788-b1f9-c1516907b6c4"),
      "jobTitle": "General Practitioner",
      "jobDescription": "Primary care physician",
      "isActive": true
    },
    
    // Government Dental Clinic employees
    {
      "id": fromDriverUUID("60c4d3a0-06a8-4bb4-94af-221766ce8314"),
      "userId": fromDriverUUID("c947ca13-c092-4322-bfa1-6a46f359ccb4"),
      "organizationId": fromDriverUUID("0b7ab6df-13c0-4e29-885c-7ac5631588f6"),
      "calendarId": fromDriverUUID("33a8c73c-ebd4-4445-8f38-6c25423aeedd"),
      "jobTitle": "Dentist",
      "jobDescription": "General dentistry",
      "isActive": true
    },
    
    // Elite Fitness Gym employees
    {
      "id": fromDriverUUID("0d0e09c0-a6bf-4098-b4a1-e016ac0e2d8d"),
      "userId": fromDriverUUID("6d949cea-54cf-458b-bc79-5c051eaa3907"),
      "organizationId": fromDriverUUID("f15e3b68-2bd4-4070-8377-1ca6dba659c5"),
      "calendarId": fromDriverUUID("e20446fc-6b34-4820-b3e5-35848b9bce5d"),
      "jobTitle": "Personal Trainer",
      "jobDescription": "Fitness training",
      "isActive": true
    },
    
    // AutoCare Plus employees
    {
      "id": fromDriverUUID("44f668ee-1c4e-466b-a2d6-aa361a0618ff"),
      "userId": fromDriverUUID("a4b3c742-b8d0-4013-90e4-c863ea1de535"),
      "organizationId": fromDriverUUID("fc53bec0-736f-4b93-adf5-c3ac25dbc1be"),
      "calendarId": fromDriverUUID("7f9b9b3e-26e3-4f72-916f-cc668d5c696a"),
      "jobTitle": "Senior Mechanic",
      "jobDescription": "Engine specialist",
      "isActive": true
    },
    
    // Bethzatha Hospital employees
    {
      "id": fromDriverUUID("62dfce05-1b72-4f6f-901a-05db8317a226"),
      "userId": fromDriverUUID("681ee00c-160f-491d-905b-c2f8769b7631"),
      "organizationId": fromDriverUUID("81e054ac-aafc-4fa3-8d22-f261432518da"),
      "calendarId": fromDriverUUID("7c3554db-a0ff-4dcd-aace-f57c5e19018f"),
      "jobTitle": "General Practitioner",
      "jobDescription": "Primary care",
      "isActive": true
    },
    
    // Yekatit 12 Hospital employees
    {
      "id": fromDriverUUID("9e97dff0-9b64-4fb1-b2e0-a9d38efc1e2e"),
      "userId": fromDriverUUID("300a2696-a47c-4882-8afb-9ea734ee3f96"),
      "organizationId": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944"),
      "calendarId": fromDriverUUID("587b1268-4162-49f5-8f9e-2bde50c3b186"),
      "jobTitle": "ER Nurse",
      "jobDescription": "Emergency room nurse",
      "isActive": true
    },
    {
      "id": fromDriverUUID("2fbb91df-1425-4f53-8e39-d822fffd47a2"),
      "userId": fromDriverUUID("ddab46e2-797a-48bf-a1f6-849b4c9f11d3"),
      "organizationId": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944"),
      "calendarId": fromDriverUUID("06dda58f-4538-41b3-830e-f65580809b64"),
      "jobTitle": "General Physician",
      "jobDescription": "Outpatient doctor",
      "isActive": true
    },
    
    // St. Paul Hospital employees
    {
      "id": fromDriverUUID("eac9b12c-16c8-4c63-be2b-6ac7df38b3cd"),
      "userId": fromDriverUUID("56e67168-bbd4-4861-85ad-ed824dc7e9c6"),
      "organizationId": fromDriverUUID("53d7a49a-93f0-4b3b-ae46-956bb2d5403d"),
      "calendarId": fromDriverUUID("35ebd79b-4033-49c8-8b80-d91c847b4f65"),
      "jobTitle": "Cardiologist",
      "jobDescription": "Heart specialist",
      "isActive": true
    },
    {
      "id": fromDriverUUID("2087d28a-6a20-4cf5-b869-80d90b3c74d2"),
      "userId": fromDriverUUID("ee1b8fed-1c44-47ff-b50c-4b78a66d84bb"),
      "organizationId": fromDriverUUID("53d7a49a-93f0-4b3b-ae46-956bb2d5403d"),
      "calendarId": fromDriverUUID("570c7cf6-0337-4334-89a1-e8b4738b5f94"),
      "jobTitle": "Surgeon",
      "jobDescription": "General surgeon",
      "isActive": true
    },
    
    // Myungsung Hospital employees
    {
      "id": fromDriverUUID("065dda8d-e555-4598-97aa-5ae50854c49a"),
      "userId": fromDriverUUID("9dc3570b-50c0-4515-b1ca-3431062d59d9"),
      "organizationId": fromDriverUUID("13485662-824f-4a1a-9c14-c50fe68e91d6"),
      "calendarId": fromDriverUUID("08ab728c-a2f3-4417-8a84-88d171baaafd"),
      "jobTitle": "Pediatrician",
      "jobDescription": "Children's doctor",
      "isActive": true
    },
    {
      "id": fromDriverUUID("91620f4d-cd67-4b20-a542-6331fa0a3426"),
      "userId": fromDriverUUID("641a31c0-a41d-42e3-8dc6-01cb58350b50"),
      "organizationId": fromDriverUUID("13485662-824f-4a1a-9c14-c50fe68e91d6"),
      "calendarId": fromDriverUUID("01a12379-6f9a-432c-8252-a30c19893c52"),
      "jobTitle": "Orthopedic Surgeon",
      "jobDescription": "Bone specialist",
      "isActive": true
    },
    
    // Ethiopian Revenue Authority employees
    {
      "id": fromDriverUUID("b5a113c9-8692-4885-89e3-55d9ac67b055"),
      "userId": fromDriverUUID("65724749-6b22-4363-8886-78af3d3629f6"),
      "organizationId": fromDriverUUID("5a31b145-0992-4e12-b6d0-b9917c0f7cfd"),
      "calendarId": fromDriverUUID("83ff2216-4fe6-47b2-9723-842d50c4d2e2"),
      "jobTitle": "Tax Officer",
      "jobDescription": "Tax assessment",
      "isActive": true
    },
    
    // Ethio Telecom employees
    {
      "id": fromDriverUUID("3f0bdafd-09da-44c6-9d99-70ca0978083d"),
      "userId": fromDriverUUID("2ca64980-9fa1-4743-8f69-ded58788bbab"),
      "organizationId": fromDriverUUID("d9940d5b-7158-475f-bd97-22c6dec23350"),
      "calendarId": fromDriverUUID("37a47691-d55a-4124-9ff4-6aa4cd714bcd"),
      "jobTitle": "Customer Service Rep",
      "jobDescription": "Customer support",
      "isActive": true
    },
    
    // Habesha Bank employees
    {
      "id": fromDriverUUID("960c3d22-9599-4ee3-8c1e-eb62ef1d02d4"),
      "userId": fromDriverUUID("4015f9b8-abc4-4895-9db3-9ace50707167"),
      "organizationId": fromDriverUUID("9ed5e12e-7de5-4dd8-bb97-7b0031f10979"),
      "calendarId": fromDriverUUID("287111d6-87c8-4380-80b7-440bd2af3cd9"),
      "jobTitle": "Bank Teller",
      "jobDescription": "Cash transactions",
      "isActive": true
    },
    
    // Sheger Cafe employees
    {
      "id": fromDriverUUID("a18ede4b-0f80-48f3-9054-58648360358a"),
      "userId": fromDriverUUID("011928cb-30c5-41ba-8151-89250b3105ce"),
      "organizationId": fromDriverUUID("47a0016c-008f-497b-a906-3f2317b1c9e1"),
      "calendarId": fromDriverUUID("d3704081-1ddb-4062-b4b5-ad1c5ccd5573"),
      "jobTitle": "Chef",
      "jobDescription": "Head chef",
      "isActive": true
    },
    
    // Addis Tech Hub employees
    {
      "id": fromDriverUUID("2545a2a3-2e51-4eb9-8934-1a2519c111e7"),
      "userId": fromDriverUUID("3cb48070-cd8a-4e74-9f89-2a04a9bb598c"),
      "organizationId": fromDriverUUID("e24dfabc-07c1-428c-85fb-a7503068136b"),
      "calendarId": fromDriverUUID("b93537b9-842c-4f75-9e08-bdfef28a858f"),
      "jobTitle": "Lead Instructor",
      "jobDescription": "Web development instructor",
      "isActive": true
    }
  ],
  
  "appointment": [
    // Nati Barber Shop appointments
    {
      "id": fromDriverUUID("13611831-93be-4e80-b256-e9a37d850a3f"),
      "serviceId": fromDriverUUID("1e1164a7-9843-449c-a574-44a4443bcbd8"),
      "organizationId": fromDriverUUID("4bd16724-94c7-428b-b8ed-ae02a6b62a04"),
      "clientId": fromDriverUUID("f5ead93b-9465-46af-985b-fbb2aaa79df8"),
      "startTime": new Date("2026-05-10T10:00:00Z"),
      "endTime": new Date("2026-05-10T10:30:00Z"),
      "status": "scheduled",
      "notes": "Classic haircut",
      "isActive": true
    },
    
    // Yekatit 12 Hospital appointments
    {
      "id": fromDriverUUID("7ce411ec-8311-42ca-84f4-4ca569170415"),
      "serviceId": fromDriverUUID("e20446fc-6b34-4820-b3e5-35848b9bce5d"),
      "organizationId": fromDriverUUID("d38848d7-437e-4275-a765-9b6b2eb46944"),
      "clientId": fromDriverUUID("d5c7a08d-7a1b-4a88-ba1a-3528b68184cf"),
      "startTime": new Date("2026-05-11T09:00:00Z"),
      "endTime": new Date("2026-05-11T09:30:00Z"),
      "status": "scheduled",
      "notes": "Follow-up checkup",
      "isActive": true
    },
    
    // St. Paul Hospital appointments
    {
      "id": fromDriverUUID("ac5da1c6-7973-4907-b9ac-6d593a228c37"),
      "serviceId": fromDriverUUID("587b1268-4162-49f5-8f9e-2bde50c3b186"),
      "organizationId": fromDriverUUID("53d7a49a-93f0-4b3b-ae46-956bb2d5403d"),
      "clientId": fromDriverUUID("19257345-fa9f-4d40-9918-429f152015a0"),
      "startTime": new Date("2026-05-12T14:00:00Z"),
      "endTime": new Date("2026-05-12T14:30:00Z"),
      "status": "scheduled",
      "notes": "Cardiology consultation",
      "isActive": true
    },
    
    // Myungsung Hospital appointments
    {
      "id": fromDriverUUID("3b110b0d-3643-4d18-9980-dbf83add127a"),
      "serviceId": fromDriverUUID("35ebd79b-4033-49c8-8b80-d91c847b4f65"),
      "organizationId": fromDriverUUID("13485662-824f-4a1a-9c14-c50fe68e91d6"),
      "clientId": fromDriverUUID("7a58c6ba-939e-4d87-82d2-d56c7ff9ee3c"),
      "startTime": new Date("2026-05-13T11:00:00Z"),
      "endTime": new Date("2026-05-13T11:30:00Z"),
      "status": "scheduled",
      "notes": "Pediatric checkup",
      "isActive": true
    },
    
    // Bethzatha Hospital appointments
    {
      "id": fromDriverUUID("a9b14438-6744-4b97-ad2f-fca4d9319336"),
      "serviceId": fromDriverUUID("ffae90e8-26ac-47b0-b453-8bc64398aef7"),
      "organizationId": fromDriverUUID("81e054ac-aafc-4fa3-8d22-f261432518da"),
      "clientId": fromDriverUUID("f5ead93b-9465-46af-985b-fbb2aaa79df8"),
      "startTime": new Date("2026-05-14T15:00:00Z"),
      "endTime": new Date("2026-05-14T15:30:00Z"),
      "status": "scheduled",
      "notes": "General consultation",
      "isActive": true
    }
  ],
  
  "serviceFirstEmployee": [
    // Nati Barber Shop
    {
      "serviceId": fromDriverUUID("1e1164a7-9843-449c-a574-44a4443bcbd8"),
      "employeeId": fromDriverUUID("b93537b9-842c-4f75-9e08-bdfef28a858f")
    },
    
    // Yekatit 12 Hospital
    {
      "serviceId": fromDriverUUID("e20446fc-6b34-4820-b3e5-35848b9bce5d"),
      "employeeId": fromDriverUUID("2fbb91df-1425-4f53-8e39-d822fffd47a2")
    },
    
    // St. Paul Hospital
    {
      "serviceId": fromDriverUUID("587b1268-4162-49f5-8f9e-2bde50c3b186"),
      "employeeId": fromDriverUUID("eac9b12c-16c8-4c63-be2b-6ac7df38b3cd")
    },
    
    // Myungsung Hospital
    {
      "serviceId": fromDriverUUID("35ebd79b-4033-49c8-8b80-d91c847b4f65"),
      "employeeId": fromDriverUUID("065dda8d-e555-4598-97aa-5ae50854c49a")
    },
    
    // Bethzatha Hospital
    {
      "serviceId": fromDriverUUID("ffae90e8-26ac-47b0-b453-8bc64398aef7"),
      "employeeId": fromDriverUUID("62dfce05-1b72-4f6f-901a-05db8317a226")
    }
  ]
};

// const matches = s.matchAll(/(?:[a-z0-9][a-z0-9]){4}-(?:[a-z0-9][a-z0-9]){2}-(?:[a-z0-9][a-z0-9]){2}-(?:[a-z0-9][a-z0-9]){2}-(?:[a-z0-9][a-z0-9]){6}/g);
// if(matches) {
//   const set = new Set(matches.map(([m]) => m));
//   const newIds = new Map(Array.from(set).map((k) => [k, crypto.randomUUID()]))
//   // console.log(newIds)
//   const newS = s.replaceAll(/(?:[a-z0-9][a-z0-9]){4}-(?:[a-z0-9][a-z0-9]){2}-(?:[a-z0-9][a-z0-9]){2}-(?:[a-z0-9][a-z0-9]){2}-(?:[a-z0-9][a-z0-9]){6}/g, (r) => {
//     return newIds.get(r);
//   })
//   // console.log(newS)
//   Bun.write("./sample.data.json", newS);
//   // for(const [match] of matches) {
//   //   // console.log(match)
//   // }

// }

export default sampleData;