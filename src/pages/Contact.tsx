import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
React.useEffect(() => { document.title = 'Contact FindMeRates.com — Get in Touch'; }, []);
const [submitted, setSubmitted] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg(null);
  setSubmitting(true);

  const endpoint = (import.meta.env.VITE_FORMSPREE_ENDPOINT ||
    import.meta.env.VITE_CONTACT_ENDPOINT) as string | undefined;

  try {
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Submit failed (${res.status})`);
      setSubmitted(true);
      return;
    }

    // Fallback: open user's mail client so the message is never lost
    const subj = encodeURIComponent(`[FindMeRates] ${form.subject || 'Contact'}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`,
    );
    window.location.href = `mailto:hello@findmerates.com?subject=${subj}&body=${body}`;
    setSubmitted(true);
  } catch (err) {
    setErrorMsg(
      err instanceof Error ? err.message : 'Something went wrong. Please email hello@findmerates.com directly.',
    );
  } finally {
    setSubmitting(false);
  }
};

return (
  <div className="min-h-screen bg-white">
    {/* Hero */}
    <section className="bg-gradient-to-br from-slate-900 to-brand-900 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Have a question, found an error in our data, or want to partner with us? We read every message and respond within 1-2 business days.
        </p>
      </div>
    </section>

    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-brand-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">Email</div>
                  <a href="mailto:hello@findmerates.com" className="text-brand-600 hover:underline text-sm">
                    hello@findmerates.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-brand-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">Location</div>
                  <div className="text-slate-500 text-sm">United States</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-brand-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">Response Time</div>
                  <div className="text-slate-500 text-sm">1-2 business days</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">Common Questions</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Rate data corrections or updates</li>
              <li>• Lender partnership inquiries</li>
              <li>• Advertising opportunities</li>
              <li>• Press and media requests</li>
              <li>• Technical issues or bugs</li>
              <li>• Privacy or data requests</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-slate-500">Thanks for reaching out. We'll get back to you within 1-2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject *</label>
                <select
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select a topic...</option>
                  <option value="rate-correction">Rate Data Correction</option>
                  <option value="partnership">Lender Partnership</option>
                  <option value="advertising">Advertising</option>
                  <option value="press">Press / Media</option>
                  <option value="technical">Technical Issue</option>
                  <option value="privacy">Privacy / Data Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
              {errorMsg && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}
              <p className="text-xs text-slate-400">
                By submitting this form you agree to our <a href="/privacy" className="underline">Privacy Policy</a>. We never share your information with third parties.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  </div>
);
}