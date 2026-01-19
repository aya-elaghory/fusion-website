import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  FlaskConical,
  Shield,
  Stethoscope,
  Syringe,
  Baby,
  Dog,
  Leaf,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

/**
 * About Us — Fusion Apothecary (Based on https://fusionrxny.com/about/)
 *
 * Tailwind-only, one-file component. Drop into your routes as <AboutUsPage />.
 * - Animations: framer-motion (optional); safe to remove if unused.
 * - Update images/links as needed.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const services = [
  {
    icon: Leaf,
    title: "Dermatology",
    blurb:
      "Custom topicals, dermatological bases, and strengths tailored to your skin.",
    to: "/dark-spots",
  },
  {
    icon: Stethoscope,
    title: "Hormone Replacement Therapy",
    blurb:
      "Personalized formulations designed to balance hormones with precision dosing.",
    to: "/menopause",
  },

  // {
  //   icon: Baby,
  //   title: "Pediatric",
  //   blurb:
  //     "Child‑friendly flavors and dosage forms to improve comfort and adherence.",
  //   // to: "/services/pediatric",
  // },
  // {
  //   icon: Syringe,
  //   title: "Pain Management",
  //   blurb:
  //     "Multi‑agent creams and alternate routes to support targeted relief.",
  //   to: "/migraine",
  // },
  // {
  //   icon: Dog,
  //   title: "Veterinary",
  //   blurb:
  //     "Species‑appropriate preparations for companion animals and exotics.",
  //   // to: "/services/veterinary",
  // },
];

const qualityPoints = [
  "Labs built to current USP 795 & USP 800 guidance.",
  "Facility design focused on product integrity and staff safety.",
  "Experienced, certified compounding professionals.",
  "A culture where quality is everyone’s responsibility.",
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-emerald-500" />
        <div
          aria-hidden
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-3xl text-white"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur">
              <Shield className="h-4 w-4" />
              USP 795 & 800 Aligned Lab
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Fusion Apothecary New York
            </h1>
            <p className="mt-4 text-lg text-white/90">
              A compounding pharmacy and integrated lab serving New York City
              with tailor‑made medications for human and veterinary patients.
            </p>
            {/* <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 font-semibold text-green-900 shadow hover:shadow-md"
              >
                Contact Us
              </a>
              <a
                href="/locations"
                className="inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2 font-semibold text-white ring-1 ring-white/40 hover:bg-white/20"
              >
                Find a Location
              </a>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Intro / Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              About Us
            </h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              We are a well‑established compounding lab and pharmacy in New York
              City. Our integrated facilities are equipped with modern
              technology and operated by experienced professionals to produce
              individualized medications that meet the specific needs of each
              patient.
            </p>
            <p className="mt-4 leading-relaxed text-gray-700">
              From dosage form adjustments and allergen‑free bases to flavored
              preparations for pediatric and veterinary use, our team
              collaborates with providers to solve therapy challenges
              thoughtfully and safely.
            </p>
            <ul className="mt-6 space-y-3">
              {qualityPoints.map((q) => (
                <li key={q} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow">
              <img
                src="/assets/about_1.jpg"
                alt="Compounding lab workspace"
                className="h-full w-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "/assets/placeholder-lab.jpg")
                }
              />
            </div>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow">
              <img
                src="/assets/about_2.jpg"
                alt="Cleanroom and equipment"
                className="h-full w-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "/assets/placeholder-lab.jpg")
                }
              />
            </div>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow">
              <img
                src="/assets/about_3.jpg"
                alt="Pharmacy team at work"
                className="h-full w-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "/assets/placeholder-lab.jpg")
                }
              />
            </div>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow">
              <img
                src="/assets/about_4.jpg"
                alt="Quality control bench"
                className="h-full w-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "/assets/placeholder-lab.jpg")
                }
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center text-2xl font-bold text-gray-900 sm:text-3xl"
          >
            What We Do
          </motion.h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <motion.a
                key={svc.title}
                href={svc.to}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <svc.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {svc.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-gray-600">{svc.blurb}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-emerald-700 opacity-0 transition group-hover:opacity-100">
                  Learn more →
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Assurance */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-emerald-600" />
                <h3 className="text-lg font-semibold">Safety & Quality</h3>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                We emphasize robust processes, validated equipment, and
                continuous training. Quality isn’t a department—it’s a shared
                commitment.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <FlaskConical className="h-6 w-6 text-emerald-600" />
                <h3 className="text-lg font-semibold">Integrated Labs</h3>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Our labs are equipped with modern tools and built with workflow
                and contamination control in mind—supporting consistent,
                reliable output.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <h3 className="text-lg font-semibold">Experienced Team</h3>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Certified compounding professionals with years of practical
                experience partnering with prescribers across many specialties.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
