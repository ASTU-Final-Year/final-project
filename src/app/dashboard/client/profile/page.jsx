"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Lock } from "lucide-react";
import RequestHandler from "@/lib/request-handler";

export default function ClientProfilePage() {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    RequestHandler.Get("/query/v1/user").then(async (res) => {
      if (res.ok) {
        const {
          users: [user],
        } = await res.json();
        const { firstname, lastname, email, phone } = user;
        setProfile({ firstname, lastname, email, phone });
        setLoading(false);
      }
    });
  }, []);

  const handleUpdate = async () => {
    const res = await RequestHandler.Patch("/query/v1/user", {
      body: profile,
    });
    if (res.ok) alert("Profile updated");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={profile.firstname}
                onChange={(e) =>
                  setProfile({ ...profile, firstname: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={profile.lastname}
                onChange={(e) =>
                  setProfile({ ...profile, lastname: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
