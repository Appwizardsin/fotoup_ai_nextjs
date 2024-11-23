import { models } from "../../../services/api";
import ModelCard from "../../components/ModelCard";

export default async function CategoryPage({ params, searchParams }) {
  const category = params?.category || "";
  const sort = searchParams?.sort || "latest";
  const search = searchParams?.search || "";

  let categoryModels;
  let error = null;

  try {
    categoryModels = await models.getByCategory(category, { sort, search });
  } catch (err) {
    console.error("Error fetching category data:", err);
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
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-2 md:py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-1">
        <h1 className="text-2xl md:text-4xl font-bold text-white capitalize">
          {category}
        </h1>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 px-1">
        {categoryModels?.map((model) => (
          <ModelCard
            key={model._id}
            modelId={model._id}
            title={model.name}
            description={model.description}
            imageUrl={model.mainImage}
            runCount={model.runCount}
          />
        ))}
      </div>

      {(!categoryModels || categoryModels.length === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-400">No models found in this category.</p>
        </div>
      )}
    </div>
  );
}
