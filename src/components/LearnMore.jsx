import React from 'react';

const LearnMore = () => {

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px] mb-6">Learn More</h1>
        <p className="text-lg text-gray-700 mb-8">
          Explore key metrics to understand how to care for and nurture your plants.
        </p>
        
        <div className="grid gap-8">
          <div>
            <h2 className="font-semibold text-[24px] text-[#444444]">Seed Germination Rate</h2>
            <p className="text-gray-600 mt-2">This is the time, measured in weeks or days, needed for seeds to sprout and develop into seedlings. Ensuring a warm and moist environment helps maximize germination rates.</p>
          </div>

          <div>
  <h2 className="font-semibold text-[24px] text-[#444444]">
    <a 
      href="https://planthardiness.ars.usda.gov/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-blue-600 hover:underline"
    >
      Growing Zone
    </a>
  </h2>
  <p className="text-gray-600 mt-2">
    The USDA Zone number indicates the range of climates where this plant thrives best. Knowing your zone can help you choose plants suited to your environment.
  </p>
</div>


          <div>
            <h2 className="font-semibold text-[24px] text-[#444444]">Time to Harvest</h2>
            <p className="text-gray-600 mt-2">This refers to the amount of time, in weeks or days, needed from planting to harvesting. Following recommended care practices will help achieve optimal harvest timing.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[24px] text-[#444444]">Watering Rate</h2>
            <p className="text-gray-600 mt-2">This shows the recommended watering frequency, often noted as "weekly" or "daily." Consistent watering supports healthy growth without overwatering.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[24px] text-[#444444]">Depth to Plant</h2>
            <p className="text-gray-600 mt-2">The depth, usually in inches or cm, indicates how deep to plant seeds. Proper planting depth promotes root growth and seedling stability.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[24px] text-[#444444]">Sunlight Requirements</h2>
            <p className="text-gray-600 mt-2">The type of sunlight required (e.g., "Full sun") guides how much direct sunlight the plant should receive daily for optimal growth.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearnMore;
