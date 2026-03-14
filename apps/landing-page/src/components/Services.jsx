export default function Services() {
  const services = [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Painting",
    "Carpentry",
    "Appliance Repair",
  ];

  return (
    <section className="py-20 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold">Our Services</h2>

      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
        {services.map((service, index) => (
          <div key={index} className="p-6 border rounded-xl">
            {service}
          </div>
        ))}
      </div>
    </section>
  );
}