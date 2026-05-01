import { NextResponse } from "next/server";

// GET all services for an organization
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get("organizationId");
  const search = searchParams.get("search");
  const isActive = searchParams.get("isActive");
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  
  // This is where you'd fetch from your SQLite database using Drizzle ORM
  // Example with your schema:
  // const services = await db.select().from(sqOrganizationServices)
  //   .where(eq(sqOrganizationServices.organizationId, organizationId));
  
  // Mock response matching the image
  const mockServices = [
    { id: "1", name: "General Checkup", description: "Comprehensive physical examination including vital signs monitoring and...", isActive: true, duration: 30, price: 500, category: "HEALTHCARE", bookingCapacity: 85, organizationId: "org_1" },
    { id: "2", name: "Urgent Care", description: "Premium synthetic oil replacement with filter change and multi-point...", isActive: true, duration: 45, price: 1200, category: "MAINTENANCE", bookingCapacity: 42, organizationId: "org_1" },
    { id: "3", name: "Lab Test", description: "Full blood panel analysis and diagnostic laboratory services with...", isActive: true, duration: 15, price: 850, category: "HEALTHCARE", bookingCapacity: 68, organizationId: "org_1" },
    { id: "4", name: "Dental Checkup", description: "Professional teeth cleaning, X-rays, and comprehensive oral health...", isActive: false, duration: 60, price: 1500, category: "HEALTHCARE", bookingCapacity: 0, organizationId: "org_1" },
    { id: "5", name: "X-Ray", description: "Digital radiographic imaging for skeletal assessment and internal...", isActive: false, duration: 20, price: 2000, category: "HEALTHCARE", bookingCapacity: 30, organizationId: "org_1" },
    { id: "6", name: "Physical Therapy", description: "One-on-one session focused on rehabilitation, mobility improvement...", isActive: false, duration: 45, price: 1100, category: "HEALTHCARE", bookingCapacity: 95, organizationId: "org_1" },
    { id: "7", name: "Vaccination", description: "Administration of routine immunizations and travel vaccines...", isActive: true, duration: 10, price: 300, category: "HEALTHCARE", bookingCapacity: 25, organizationId: "org_1" },
    { id: "8", name: "Eye Exam", description: "Comprehensive vision testing and eye health screening by professional...", isActive: true, duration: 30, price: 750, category: "HEALTHCARE", bookingCapacity: 55, organizationId: "org_1" },
  ];
  
  let filtered = [...mockServices];
  
  if (search) {
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (isActive !== null && isActive !== undefined) {
    filtered = filtered.filter(s => s.isActive.toString() === isActive);
  }
  
  if (fromDate && toDate) {
    // Apply date filter logic here
    console.log("Filtering from:", fromDate, "to:", toDate);
  }
  
  return NextResponse.json(filtered);
}

// POST - Create new service
export async function POST(request) {
  const body = await request.json();
  
  // Validate required fields
  if (!body.name) {
    return NextResponse.json({ error: "Service name is required" }, { status: 400 });
  }
  
  // Here you'd insert into your SQLite database
  // const newService = await db.insert(sqOrganizationServices).values({
  //   name: body.name,
  //   description: body.description || "",
  //   isActive: body.isActive ?? true,
  //   organizationId: body.organizationId,
  //   calendarId: body.calendarId || null,
  // });
  
  const newService = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  return NextResponse.json(newService, { status: 201 });
}