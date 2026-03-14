export default function Testimonials() {
  const reviews = [
    {
      name: "Prathap K",
      text: "Amazing service! Booking was super easy.",
    },
    {
      name: "Raghu D",
      text: "Professional and quick work.",
    },
  ];

  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl font-bold">What Customers Say</h2>

      <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
        {reviews.map((r, i) => (
          <div key={i} className="p-6 border rounded-xl">
            <p>"{r.text}"</p>
            <p className="mt-3 font-semibold">- {r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}