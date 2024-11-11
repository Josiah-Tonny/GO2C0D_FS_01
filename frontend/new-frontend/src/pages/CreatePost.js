import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    author: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const imageInputRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append image if exists
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        tags: '',
        author: ''
      });
      setImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }

      // Navigate to home page
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 rounded border border-gray-700"
            required
          />
        </div>

        <div>
          <textarea
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-32"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 rounded border border-gray-700"
          />
        </div>

        <div>
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 rounded border border-gray-700"
          />
        </div>

        <div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 bg-gray-800 rounded border border-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded ${
            loading 
              ? 'bg-gray-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;