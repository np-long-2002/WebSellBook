import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";

function CategorySidebar({ selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const categoryEmojis = {
    "Fiction": "📖",
    "Non-Fiction": "📚",
    "Science": "🔬",
    "Technology": "💻",
    "Business": "💼",
    "Self-Help": "🌱",
    "History": "🏛️",
    "Biography": "👤",
    "Mystery": "🔍",
    "Romance": "💕",
    "Children": "👶",
    "Art": "🎨",
  };

  const getEmoji = (categoryName) => {
    return categoryEmojis[categoryName] || "📕";
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Danh mục</h3>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* All Books Button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full px-4 py-3 text-left rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
              selectedCategory === null
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-800 hover:bg-blue-50"
            }`}
          >
            <span className="text-xl">📚</span>
            <span>Tất cả sách</span>
          </button>

          {/* Category Buttons */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full px-4 py-3 text-left rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-800 hover:bg-blue-50"
              }`}
            >
              <span className="text-xl">{getEmoji(category.name)}</span>
              <span className="flex-1 truncate">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategorySidebar;
