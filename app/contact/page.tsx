"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { Mail, Phone, Linkedin, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const projectTypes = [
  "Web Development",
  "Cloud Solutions",
  "Data Analytics",
  "Consulting",
  "Other",
];

const contactMethods = ["Email", "Phone", "LinkedIn"];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
    preferredContact: "Email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          project_type: formData.projectType,
          message: formData.message,
          preferred_contact: formData.preferredContact,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        projectType: "",
        message: "",
        preferredContact: "Email",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-bg-dark pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-secondary mb-6">
            Let's Build Something Together
          </h1>
          <p className="text-xl text-secondary/80 max-w-3xl mx-auto leading-relaxed">
            Whether you have a project in mind, need a technical solution for your business, or want to discuss how my unique background can benefit your team, I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-serif text-secondary mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="text-secondary/60 text-sm mb-1">Email</div>
                    <a
                      href="mailto:montjeffrey@gmail.com"
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      montjeffrey@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="text-secondary/60 text-sm mb-1">Phone</div>
                    <a
                      href="tel:+12018419697"
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      (201) 841-9697
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Linkedin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="text-secondary/60 text-sm mb-1">LinkedIn</div>
                    <a
                      href="https://linkedin.com/in/montjeffrey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      linkedin.com/in/montjeffrey
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="text-secondary/60 text-sm mb-1">Location</div>
                    <div className="text-secondary">Dover, NJ</div>
                    <div className="text-secondary/60 text-sm">Open to remote opportunities</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-primary/20">
                <div className="text-secondary/60 text-sm">
                  <strong className="text-secondary">Response Time:</strong> I typically respond
                  within 24 hours on business days.
                </div>
              </div>
            </div>

            {/* What I Can Help With */}
            <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-serif text-secondary mb-6">What I Can Help With</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "🚀 Full-Stack Development",
                    desc: "Need a responsive web application or custom business solution? I build scalable applications that solve real problems.",
                  },
                  {
                    title: "☁️ Cloud Architecture",
                    desc: "Looking to migrate to AWS or Azure? I can help design and implement secure, cost-effective cloud solutions.",
                  },
                  {
                    title: "📊 Data & Analytics",
                    desc: "Want to leverage your data for better decisions? From SQL databases to ML models, I turn data into insights.",
                  },
                  {
                    title: "🔧 Technical Consulting",
                    desc: "Need guidance on technical strategy or system integration? My operational background helps me see the full picture.",
                  },
                ].map((item, i) => (
                  <div key={i} className="pb-4 border-b border-primary/10 last:border-0">
                    <h3 className="text-secondary font-semibold mb-2">{item.title}</h3>
                    <p className="text-secondary/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-serif text-secondary mb-6">Quick Connect Form</h2>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Message sent successfully! I'll get back to you soon.</span>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>Error sending message. Please try again or contact me directly.</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-secondary mb-2">
                      Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-bg-dark border border-primary/20 rounded-lg text-secondary placeholder-secondary/40 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-secondary mb-2">
                      Email <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-bg-dark border border-primary/20 rounded-lg text-secondary placeholder-secondary/40 focus:outline-none focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-secondary mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-dark border border-primary/20 rounded-lg text-secondary placeholder-secondary/40 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-secondary mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-dark border border-primary/20 rounded-lg text-secondary focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select a project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-secondary mb-2">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-dark border border-primary/20 rounded-lg text-secondary placeholder-secondary/40 focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <div>
                  <label className="block text-secondary mb-3">
                    Preferred Contact Method
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {contactMethods.map((method) => (
                      <label
                        key={method}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method}
                          checked={formData.preferredContact === method}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary bg-bg-dark border-primary/20 focus:ring-primary focus:ring-2"
                        />
                        <span className="text-secondary">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-bg-dark border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

