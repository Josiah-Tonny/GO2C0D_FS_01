import React from 'react';

const PostCard = ({ post }) => {
  // Format date to be more readable
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {post.imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={`http://localhost:5000${post.imageUrl}`}
            alt={post.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
        </div>
      )}

      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white mb-2 line-clamp-2">
          {post.title}
        </h2>

        <p className="text-gray-400 mb-4 line-clamp-3">
          {post.content}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-600 text-sm text-white rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            By {post.author || 'Anonymous'}
          </span>
          <span className="text-sm text-gray-400">
            {formatDate(post.date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;