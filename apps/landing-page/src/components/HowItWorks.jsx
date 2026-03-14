export default function HowItWorks() {
  const steps = [
    { title: "Choose Service", desc: "Select the service you need." },
    { title: "Book Schedule", desc: "Pick your convenient time." },
    { title: "Get It Done", desc: "Professional arrives at your door." },
  ];

  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl font-bold">How It Works</h2>

      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="p-6 border rounded-xl">
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-gray-500">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}