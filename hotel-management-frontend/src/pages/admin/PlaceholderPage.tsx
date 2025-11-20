interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
}

export const PlaceholderPage = ({ title, description, icon }: PlaceholderPageProps) => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">{icon}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
