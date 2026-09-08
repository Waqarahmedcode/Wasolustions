"use client";

import { motion } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { contact, site } from "@/content/site";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSplitText } from "@/hooks/useSplitText";
import { cn } from "@/lib/cn";

type Field = "name" | "email" | "budget" | "message";
type Errors = Partial<Record<Field, string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const budget = String(data.get("budget") || "");
  const message = String(data.get("message") || "").trim();
  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!budget) errors.budget = "Pick a budget range.";
  if (message.length < 20) errors.message = "Give us at least a sentence or two.";
  return errors;
}

const inputClass =
  "w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-sm text-snow placeholder:text-fog/70 transition-colors focus:border-glow focus:outline-none";

export function Contact() {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  useScrollReveal(section);
  useSplitText(heading, { mode: "words", duration: 1400 });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = validate(data);
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    // No backend yet: simulate a send so the UI states are complete.
    window.setTimeout(() => setStatus("sent"), 900);
  };

  const field = (name: Field) => ({
    name,
    id: `contact-${name}`,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    onChange: () => errors[name] && setErrors((prev) => ({ ...prev, [name]: undefined })),
  });

  return (
    <section ref={section} id="contact" className="relative scroll-mt-20 overflow-hidden py-28 sm:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(201,160,255,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p data-reveal className="eyebrow mb-6">Start a project</p>
            <h2 ref={heading} className="font-display max-w-3xl text-balance text-[clamp(2.4rem,6.5vw,5.4rem)] font-semibold leading-[1] text-snow">
              {contact.headline}
            </h2>
            <p data-reveal className="mt-8 max-w-md text-base leading-relaxed text-fog">{contact.sub}</p>
            <div data-reveal className="mt-10 space-y-2 text-sm">
              <a href={`mailto:${site.email}`} className="block text-snow underline-offset-4 hover:underline">
                {site.email}
              </a>
              <p className="text-fog">{site.location}</p>
            </div>
          </div>

          <motion.form
            data-reveal
            noValidate
            onSubmit={onSubmit}
            className="glass rounded-3xl p-6 sm:p-8"
            aria-label="Project enquiry"
          >
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[380px] flex-col items-center justify-center text-center"
                role="status"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-glow/15 text-glow">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="font-display mt-6 text-2xl font-semibold text-snow">Received.</h3>
                <p className="mt-2 max-w-xs text-sm text-fog">We will read it properly and reply within two working days.</p>
              </motion.div>
            ) : (
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="eyebrow mb-2 block">Name</label>
                    <input {...field("name")} type="text" autoComplete="name" placeholder="Your name" className={cn(inputClass, errors.name && "border-ember")} />
                    {errors.name && <p id="contact-name-error" className="mt-2 text-xs text-ember">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="eyebrow mb-2 block">Email</label>
                    <input {...field("email")} type="email" autoComplete="email" placeholder="you@company.com" className={cn(inputClass, errors.email && "border-ember")} />
                    {errors.email && <p id="contact-email-error" className="mt-2 text-xs text-ember">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-budget" className="eyebrow mb-2 block">Budget range</label>
                  <select {...field("budget")} defaultValue="" className={cn(inputClass, "appearance-none", errors.budget && "border-ember")}>
                    <option value="" disabled>Select a range</option>
                    {contact.budgets.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  {errors.budget && <p id="contact-budget-error" className="mt-2 text-xs text-ember">{errors.budget}</p>}
                </div>
                <div>
                  <label htmlFor="contact-message" className="eyebrow mb-2 block">Project</label>
                  <textarea {...field("message")} rows={5} placeholder="What are you launching, and when?" className={cn(inputClass, "resize-none", errors.message && "border-ember")} />
                  {errors.message && <p id="contact-message-error" className="mt-2 text-xs text-ember">{errors.message}</p>}
                </div>
                <Button
                  as="button"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    (e.currentTarget.closest("form") as HTMLFormElement | null)?.requestSubmit();
                  }}
                  aria-disabled={status === "sending"}
                  className={cn("mt-2 w-full", status === "sending" && "pointer-events-none opacity-70")}
                  role="button"
                >
                  {status === "sending" ? "Sending" : "Send the brief"}
                </Button>
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
