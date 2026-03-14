export default function Hero() {
  return (
    <section className="text-center py-24 bg-gray-100">
      <h1 className="text-5xl font-bold">Book Trusted Home Services</h1>
      <p className="mt-4 text-gray-600">
        Find plumbers, electricians, cleaners and more in minutes.
      </p>

      <div className="mt-6 flex justify-center gap-4">
        <button className="px-6 py-3 bg-black text-white rounded-lg">
          Book Service
        </button>

        <button className="px-6 py-3 border rounded-lg">
          Become a Professional
        </button>
      </div>
    </section>
  );
}