"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormData } from "./types";
import { API_URL } from "@/lib/config";

export default function SignUpStep({
  onNext,
}: {
  onNext: (data: FormData) => void;
}) {
  const [form, setForm] = useState({
  name: "",
  username: "",
  email: "",
  password: "",
  phone_number: ""
});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const fields = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "username", label: "Username", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  {name: "phone_number", label: "Phone Number", type: "text"}
];

  const validate = () => {
  const e: Partial<FormData> = {};

  if (!form.name.trim()) e.name = "Full name is required";

  if (!form.username.trim()) {
    e.username = "Username is required";
  } else if (form.username.length < 3) {
    e.username = "Username must be at least 3 characters";
  }

  if (!form.email.includes("@")) e.email = "Invalid email";

  if (form.password.length < 8)
    e.password = "Min 8 characters";

  return e;
};

  const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length) return setErrors(e);

  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        phone_number: form.phone_number
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({
        username: data.username?.[0],
        email: data.email?.[0],
        password: data.password?.[0],
      });
      return;
    }

    onNext({ ...form, reference_code: data.reference_code });
  } catch {
    setErrors({ email: "Network error — is the server running?" });
  } finally {
    setLoading(false);
  }
};
  return (
  <div className="w-full flex justify-center px-4 sm:px-6">
    
    {/* Card Container */}
    <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">

      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-white">
          Create your account
        </h1>

        <div className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <Label className="text-gray-300">{field.label}</Label>

              <Input
                type={field.type}
                value={(form as any)[field.name]}
                onChange={(e) =>
                  setForm({ ...form, [field.name]: e.target.value })
                }
                className={cn(
                  "h-11 rounded-xl border border-gray-800 bg-black text-white focus:border-green-500",
                  errors[field.name as keyof FormData] && "border-red-500"
                )}
              />

              {errors[field.name as keyof FormData] && (
                <p className="text-xs text-red-500">
                  {errors[field.name as keyof FormData]}
                </p>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-11 bg-green-500 hover:bg-green-600 rounded-xl text-white"
        >
          {loading && <Loader2 className="animate-spin mr-2" size={16} />}
          Continue to Payment
        </Button>
      </div>

    </div>
  </div>
);
}