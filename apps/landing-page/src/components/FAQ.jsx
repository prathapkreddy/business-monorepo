import { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      q: "How do I book a service?",
      a: "Select service and schedule online.",
    },
    {
      q: "Are professionals verified?",
      a: "Yes all professionals are background checked.",
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <section className="py-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-center">FAQ</h2>

      <div className="max-w-3xl mx-auto mt-10">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b py-4">
            <button
              className="w-full text-left font-semibold"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.q}
            </button>

            {open === i && (
              <p className="mt-2 text-gray-500">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}