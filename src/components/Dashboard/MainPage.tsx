// HomePage.tsx
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <header className="mb-8">
        <h1 className="text-gray-800 animate-fade-in mb-4 text-4xl font-bold">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600 animate-slide-up text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam.
        </p>
      </header>

      <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="animate-fade-in transform rounded-lg bg-blue-100 p-6 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
          <h2 className="mb-2 text-2xl font-semibold">Feature 1</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero.
          </p>
          <img
            src="https://via.placeholder.com/150"
            alt="Feature 1"
            className="mt-4 h-40 w-full rounded-lg object-cover"
          />
        </div>
        <div className="animate-fade-in transform rounded-lg bg-green-100 p-6 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
          <h2 className="mb-2 text-2xl font-semibold">Feature 2</h2>
          <p className="text-gray-600">
            Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh
            elementum imperdiet.
          </p>
          <img
            src="https://via.placeholder.com/150"
            alt="Feature 2"
            className="mt-4 h-40 w-full rounded-lg object-cover"
          />
        </div>
        <div className="animate-fade-in transform rounded-lg bg-yellow-100 p-6 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
          <h2 className="mb-2 text-2xl font-semibold">Feature 3</h2>
          <p className="text-gray-600">
            Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue
            semper porta.
          </p>
          <img
            src="https://via.placeholder.com/150"
            alt="Feature 3"
            className="mt-4 h-40 w-full rounded-lg object-cover"
          />
        </div>
      </section>

      <section>
        <h3 className="text-gray-800 animate-fade-in mb-4 text-3xl font-semibold">
          Why Choose Us?
        </h3>
        <p className="text-gray-600 animate-slide-up mb-6 text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          tincidunt vestibulum ligula, vitae tincidunt massa ullamcorper ut.
        </p>
        <div className="animate-fade-in transform rounded-lg bg-indigo-100 p-6 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
          <p className="text-gray-600">
            Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed
            nisi. Nulla quis sem at nibh elementum imperdiet.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
