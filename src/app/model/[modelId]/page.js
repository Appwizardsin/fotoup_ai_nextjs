import { models } from "@/services/api";
import ModelPageClient from "@/app/components/SingleModelPage/ModelPageClient";

export async function generateMetadata({ params }) {
  const model = await models.getSingle(params.modelId);
  return {
    title: `${model.name} - Your App Name`,
    description: model.description || `Process your images with ${model.name}`,
  };
}

export default async function SingleModelPage({ params }) {
  const model = await models.getSingle(params.modelId);

  if (!model) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Model not found
          </h2>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <ModelPageClient initialModel={model} />;
}
