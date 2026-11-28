"use client";

import { useActionState } from "react";
import MemberCard from "@/components/MemberCard";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { updateMyProfile } from "@/lib/hub";
import type { TeamMember } from "@/lib/team";

// TODO: These constants should maybe come from somewhere else later?
const MAX_LINKS = 3;
const LINK_TYPES = [
  { value: "link", label: "Link" },
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "website", label: "Website" },
];

interface FormState {
  profile: TeamMember;
  message?: string;
}

async function saveProfile(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const cleanedInput = {
    name: String(formData.get("name")).trim(),
    photoUrl: String(formData.get("photoUrl")).trim() || null,
    links: Array.from({ length: MAX_LINKS }, (_, i) => ({
      type: String(formData.get(`links.${i}.type`)),
      url: String(formData.get(`links.${i}.url`)),
    })).filter((link) => link.url),
  };

  try {
    const profile = await updateMyProfile(cleanedInput);
    return { profile, message: "Profile saved." };
  } catch {
    return {
      profile: { ...state.profile, ...cleanedInput },
      message: "An error occurred while saving your profile.",
    };
  }
}

export default function ProfileForm({
  initialProfile,
}: {
  initialProfile: TeamMember;
}) {
  const [{ profile, message }, formAction, pending] = useActionState(
    saveProfile,
    { profile: initialProfile },
  );

  return (
    <div className="flex lg:flex-row flex-col gap-10 lg:items-start lg:gap-12">
      <form action={formAction} className="flex-1">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              required
              defaultValue={profile.name}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="photoUrl">Photo URL</FieldLabel>
            <Input
              id="photoUrl"
              name="photoUrl"
              type="url"
              placeholder="https://github.com/acmfeup.png"
              defaultValue={profile.photoUrl ?? ""}
            />
          </Field>

          <FieldSet>
            <FieldLegend>Links</FieldLegend>
            {Array.from({ length: MAX_LINKS }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed rows, never reordered
              <div key={i} className="flex gap-2">
                <Select
                  name={`links.${i}.type`}
                  aria-label={`Link ${i + 1} platform`}
                  defaultValue={profile.links[i]?.type ?? "link"}
                  className="w-30"
                >
                  {LINK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
                <Input
                  name={`links.${i}.url`}
                  aria-label={`Link ${i + 1} URL`}
                  type="url"
                  placeholder="https://..."
                  defaultValue={profile.links[i]?.url ?? ""}
                />
              </div>
            ))}
            <FieldDescription>
              Leave empty to skip. Max 3 links.
            </FieldDescription>
          </FieldSet>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save profile"}
            </Button>
            {message && <output className="text-sm">{message}</output>}
          </div>
        </FieldGroup>
      </form>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Preview
        </h2>
        <div className="w-full sm:w-64">
          <MemberCard member={profile} />
        </div>
      </section>
    </div>
  );
}
