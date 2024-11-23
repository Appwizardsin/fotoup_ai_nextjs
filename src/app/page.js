import { home } from "../services/api";
import ClientSlider from "./components/ClientSlider";

export default async function Home() {
  let homeData;
  let error = null;

  try {
    homeData = await home.get();
  } catch (err) {
    console.error("Error fetching home data:", err);
    error = err.message;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Error loading content
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const sliderSettings = {
    featured: {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 1,
      swipeToSlide: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true,
            swipeToSlide: true,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: false,
            swipeToSlide: true,
            touchThreshold: 10,
          },
        },
      ],
    },
    category: {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 1,
      swipeToSlide: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true,
            swipeToSlide: true,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3.25,
            slidesToScroll: 1,
            arrows: false,
            swipeToSlide: true,
            touchThreshold: 10,
          },
        },
      ],
    },
  };

  return (
    <div className="container mx-auto px-2 py-2 md:py-6">
      {/* Featured Section */}
      <div className="mb-4 md:mb-8">
        <div className="px-1 md:px-2">
          <ClientSlider
            items={homeData.featured}
            settings={sliderSettings.featured}
            type="featured"
          />
        </div>
      </div>

      {/* Filter Categories */}
      {Object.entries(homeData.filters).map(([category, models]) => (
        <div key={category} className="mb-4 md:mb-8">
          <div className="flex justify-between items-center mb-2 md:mb-4 px-1">
            <h2 className="text-base md:text-3xl font-bold text-white capitalize">
              {category}
            </h2>
            <a
              href={`/category/${category}`}
              className="text-xs md:text-sm text-gray-200 hover:text-grey-300 transition-colors inline-block px-2 py-1 bg-blue-100 hover:bg-blue-800 bg-opacity-10 rounded-lg"
            >
              View All
            </a>
          </div>
          <div className="px-1 md:px-2">
            <ClientSlider
              items={models}
              settings={sliderSettings.category}
              type="category"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
