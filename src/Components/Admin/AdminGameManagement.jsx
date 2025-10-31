import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminGameManagement = () => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        console.log('File dropped:', file);
        setFormData({
          ...formData,
          image: file
        });
      } else {
        alert('Please select an image file only');
      }
    }
  };

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    downloadLink: '',
    releaseDate: '',
    price: '',
    image: null, // File object for upload
    imageUrl: '', // Current image URL for display
    createdBy: '77a13a7c-1f2b-414e-86b7-f61dd141d99b', // Fixed UUID
    updateAt: new Date().toISOString()
  });

  // Fetch games from API
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Fetch games - Admin token exists:', !!token);

      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch('https://localhost:7270/api/Game/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Fetch games response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched games data:', data);
        if (data.length > 0) {
          console.log('First game object:', data[0]);
          console.log('First game image field:', data[0].image);
          console.log('All game image fields:', data.map(game => ({ id: game.id, title: game.title, image: game.image })));
        }
        setGames(data);
      } else {
        let errorText;
        try {
          const errorData = await response.json();
          console.error('Fetch games error (JSON):', errorData);
          errorText = JSON.stringify(errorData, null, 2);
        } catch (parseError) {
          errorText = await response.text();
          console.error('Fetch games error (text):', errorText);
        }
        alert('Error fetching games: ' + errorText);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      alert('Error fetching games: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new game
  const handleAddGame = async (e) => {
    e.preventDefault();

    console.log('Current formData:', formData); // Debug: Check form data

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.downloadLink || !formData.image) {
      console.log('Validation failed - empty fields:', {
        title: !formData.title,
        description: !formData.description,
        category: !formData.category,
        downloadLink: !formData.downloadLink,
        image: !formData.image
      });
      alert('Please fill in all required fields (Title, Description, Category, Download Link, and select an Image file)!');
      return;
    }

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all fields
      formDataToSend.append('Title', formData.title);
      formDataToSend.append('Description', formData.description);
      formDataToSend.append('Category', formData.category);
      formDataToSend.append('DownloadLink', formData.downloadLink);

      if (formData.releaseDate) {
        formDataToSend.append('ReleaseDate', formData.releaseDate);
      }

      if (formData.price) {
        formDataToSend.append('Price', parseInt(formData.price));
      }

      formDataToSend.append('CreatedBy', formData.createdBy);
      formDataToSend.append('UpdateAt', new Date().toISOString());

      // Add image file
      if (formData.image) {
        formDataToSend.append('Image', formData.image);
      }

      console.log('Sending FormData for add...'); // Debug log

      // Debug: Check authentication token
      const token = localStorage.getItem('adminToken');
      console.log('Add - Admin token exists:', !!token);
      console.log('Add - Token length:', token ? token.length : 0);

      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }

      const response = await fetch('https://localhost:7270/api/Game/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - let browser set it for FormData
        },
        body: formDataToSend,
      });

      console.log('Add response status:', response.status); // Debug log

      if (response.ok) {
        const result = await response.json();
        console.log('Game added successfully:', result);
        console.log('Image field in response:', result.image);
        setShowAddForm(false);
        resetForm();
        fetchGames(); // Refresh the list
        alert('Game added successfully!');
      } else {
        let errorText;
        try {
          const errorData = await response.json();
          console.error('Add error (JSON):', errorData);
          errorText = JSON.stringify(errorData, null, 2);
        } catch (parseError) {
          errorText = await response.text();
          console.error('Add error (text):', errorText);
        }
        alert('Error adding game: ' + errorText);
      }
    } catch (error) {
      console.error('Error adding game:', error);
      alert('Error adding game: ' + error.message);
    }
  };

  // Update game
  const handleUpdateGame = async (e) => {
    e.preventDefault();

    console.log('Current formData for update:', formData); // Debug: Check form data

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.downloadLink || !formData.image) {
      console.log('Validation failed - empty fields:', {
        title: !formData.title,
        description: !formData.description,
        category: !formData.category,
        downloadLink: !formData.downloadLink,
        image: !formData.image
      });
      alert('Please fill in all required fields (Title, Description, Category, Download Link, and select an Image file)!');
      return;
    }

    try {
      // Create FormData for file upload (similar to add function)
      const formDataToSend = new FormData();

      // Add all required fields
      formDataToSend.append('Title', formData.title);
      formDataToSend.append('Description', formData.description);
      formDataToSend.append('Category', formData.category);
      formDataToSend.append('DownloadLink', formData.downloadLink);

      if (formData.releaseDate) {
        formDataToSend.append('ReleaseDate', formData.releaseDate);
      }

      if (formData.price) {
        formDataToSend.append('Price', parseInt(formData.price));
      }

      formDataToSend.append('CreatedBy', formData.createdBy);
      formDataToSend.append('UpdateAt', new Date().toISOString());

      // Add image file (required for both add and update operations)
      if (formData.image) {
        formDataToSend.append('Image', formData.image);
      }

      console.log('Sending FormData for update...'); // Debug log

      // Debug: Check authentication token
      const token = localStorage.getItem('adminToken');
      console.log('Admin token exists:', !!token);
      console.log('Token length:', token ? token.length : 0);

      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }

      const response = await fetch(`https://localhost:7270/api/Game/update/${editingGame.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - let browser set it for FormData
        },
        body: formDataToSend,
      });

      console.log('Update response status:', response.status); // Debug log
      console.log('Update response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('Game updated successfully:', result);
        setEditingGame(null);
        resetForm();
        fetchGames(); // Refresh the list
        alert('Game updated successfully!');
      } else {
        let errorText;
        try {
          const errorData = await response.json();
          console.error('Update error (JSON):', errorData);
          errorText = JSON.stringify(errorData, null, 2);
        } catch (parseError) {
          errorText = await response.text();
          console.error('Update error (text):', errorText);
        }
        alert('Error updating game: ' + errorText);
      }
    } catch (error) {
      console.error('Error updating game:', error);
      alert('Error updating game: ' + error.message);
    }
  };

  // Delete game
  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      console.log('Delete - Admin token exists:', !!token);

      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }

      const response = await fetch(`https://localhost:7270/api/Game/delete/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        console.log('Game deleted successfully');
        alert('Game deleted successfully!');
        fetchGames(); // Refresh the list
      } else {
        // Read response body once and store it
        const responseText = await response.text();
        console.error('Delete error response:', responseText);
        
        let errorText;
        try {
          // Try to parse as JSON
          const errorData = JSON.parse(responseText);
          errorText = errorData.message || JSON.stringify(errorData, null, 2);
        } catch (parseError) {
          // If not JSON, use the text directly
          errorText = responseText || `Error: ${response.status} ${response.statusText}`;
        }
        alert('Error deleting game: ' + errorText);
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Error deleting game: ' + error.message);
    }
  };

  // Edit game
  const handleEditGame = (game) => {
    setEditingGame(game);
    setFormData({
      title: game.title || '',
      description: game.description || '',
      category: game.category || '',
      downloadLink: game.downloadLink || '',
      releaseDate: game.releaseDate ? game.releaseDate.slice(0, 16) : '',
      price: game.price || '',
      image: null, // User must select image (even current one) for updates
      imageUrl: game.imageUrl || game.image || '', // Store current image URL for display
      createdBy: game.createdBy || '77a13a7c-1f2b-414e-86b7-f61dd141d99b',
      createdAt: game.createdAt || new Date().toISOString(),
      updateAt: new Date().toISOString()
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      downloadLink: '',
      releaseDate: '',
      price: '',
      image: null,
      imageUrl: '',
      createdBy: '77a13a7c-1f2b-414e-86b7-f61dd141d99b',
      createdAt: new Date().toISOString(),
      updateAt: new Date().toISOString()
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value); // Debug log
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Image file selected:', file); // Debug log
    setFormData({
      ...formData,
      image: file
    });
  };

  // Helper function to handle image URLs
  const getImageUrl = (imageUrl) => {
    // Handle null, undefined, or empty image URLs
    if (!imageUrl || imageUrl === undefined || imageUrl === null || imageUrl === '') {
      console.log('No image URL provided, using placeholder');
      return "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center";
    }

    console.log('Processing image URL:', imageUrl);

    // If it's already a full URL (http/https), use it directly
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      console.log('Using full URL:', imageUrl);
      return imageUrl;
    }

    // If it's a relative path from backend (like /uploads/filename.jpg)
    if (imageUrl.startsWith('/')) {
      // Handle paths like /uploads/filename with spaces
      if (imageUrl.startsWith('/uploads/')) {
        const filename = imageUrl.substring('/uploads/'.length);
        const encodedFilename = encodeURIComponent(filename);
        const fullUrl = `https://localhost:7270/uploads/${encodedFilename}`;
        // console.log('Constructed uploads URL:', fullUrl);
        return fullUrl;
      } else {
        // For other relative paths, encode the entire path
        const fullUrl = `https://localhost:7270${encodeURIComponent(imageUrl)}`;
        console.log('Constructed URL from relative path:', fullUrl);
        return fullUrl;
      }
    }

    // If it's just a filename (like "game-image.jpg")
    if (imageUrl && imageUrl.trim()) {
      const encodedFilename = encodeURIComponent(imageUrl.trim());
      const possiblePaths = [
        `https://localhost:7270/uploads/${encodedFilename}`,
        `https://localhost:7270/images/${encodedFilename}`,
        `https://localhost:7270/${encodedFilename}`
      ];

      // Use the first path (uploads folder is most likely)
      const finalUrl = possiblePaths[0];
      // console.log('Using uploads path:', finalUrl);
      return finalUrl;
    }

    // Final fallback to placeholder
    console.log('Using placeholder as final fallback');
    return "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Game Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
        >
          <FaPlus />
          Add Game
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingGame) && (
        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">
              {editingGame ? 'Edit Game' : 'Add New Game'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingGame(null);
                resetForm();
              }}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={editingGame ? handleUpdateGame : handleAddGame} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                min="0"
                step="1"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Download Link *</label>
              <input
                type="url"
                name="downloadLink"
                value={formData.downloadLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game Image *
              </label>
              <div
                className={`w-full px-3 py-8 bg-gray-700 border-2 border-dashed rounded-lg text-center transition-all ${
                  dragOver ? 'border-red-500 bg-red-500/10' : 'border-gray-600 hover:border-red-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                  accept="image/*"
                  required={!editingGame} // Only required for new games at HTML level
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-gray-400">
                    <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                    </svg>
                    <p className="text-lg font-medium">
                      {dragOver ? 'Drop image here' : 'Drag & drop an image here'}
                    </p>
                    <p className="text-sm">or click to browse</p>
                  </div>
                </label>
              </div>
              {formData.image && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-600"
                    onLoad={() => console.log('Image preview loaded')}
                    onError={(e) => {
                      console.error('Preview image failed to load');
                      e.target.style.display = 'none';
                    }}
                  />
                  <p className="text-sm text-gray-400 mt-1">Selected: {formData.image.name}</p>
                </div>
              )}

              {/* Show current image when editing (for reference) */}
              {editingGame && !formData.image && formData.imageUrl && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Current Image (select this image to keep it):</p>
                  <img
                    src={getImageUrl(formData.imageUrl)}
                    alt="Current"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-600"
                    onError={(e) => {
                      console.error('Current image failed to load');
                      e.target.style.display = 'none';
                    }}
                  />
                  <p className="text-sm text-gray-400 mt-1">Select the current image above to keep it unchanged</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Release Date</label>
              <input
                type="datetime-local"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Select release date"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                onClick={(e) => {
                  console.log('Update button clicked');
                  console.log('Form is valid:', e.target.form.checkValidity());
                  console.log('Current editingGame:', editingGame);
                  console.log('Current formData:', formData);
                }}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <FaSave />
                {editingGame ? 'Update Game' : 'Add Game'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Games List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">All Games ({games.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Game</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Release Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {games.map((game, index) => (
                <motion.tr
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={getImageUrl(game.imageUrl)}
                        alt={game.title}
                        onError={(e) => {
                          console.error('Image failed to load:', (game.imageUrl || 'undefined'), '->', e.target.src);
                          // Prevent infinite error loops - only set placeholder if not already a data URL or placeholder
                          if (e.target.src.includes('data:image') || e.target.src.includes('placeholder')) return;

                          // Use data URL placeholder as final fallback
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzQ0NTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObzwvdGV4dD48L3N2Zz4=';
                        }}
                        onLoad={(e) => {
                          console.log('Image loaded successfully:', e.target.src);
                        }}
                        loading="lazy"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{game.title}</div>
                        <div className="text-sm text-gray-400">Created by: {game.createdBy || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{game.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ₹{game.price || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditGame(game)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteGame(game.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminGameManagement;
