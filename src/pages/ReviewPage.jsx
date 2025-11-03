import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReviewContext } from '../Context/ReviewContext';
import { useAuth } from '../Context/Authcontext';
import './ReviewPage.css';

const ReviewPage = () => {
  const { addReview, getAllReviews, getReviewsByGame, fetchReviews, deleteReview } = useContext(ReviewContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    gameName: '',
    rating: 5,
    reviewText: '',
    reviewerName: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [displayReviews, setDisplayReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Pre-populate game name if coming from game page
  useEffect(() => {
    if (location.state?.gameName) {
      setFormData(prev => ({
        ...prev,
        gameName: location.state.gameName
      }));
    }
    // Load reviews for this specific game from API
    if (location.state?.gameId) {
      loadReviewsForGame(location.state.gameId);
    } else {
      loadReviewsFromStorage();
    }
  }, [location.state]);

  const loadReviewsForGame = async (gameId) => {
    try {
      const reviews = await fetchReviews(gameId);
      console.log('Loaded reviews for game from API:', reviews);
      // Debug: Log the structure of the first review to see available fields
      if (reviews && reviews.length > 0) {
        console.log('First review structure:', reviews[0]);
        console.log('Available keys:', Object.keys(reviews[0]));
      }
      setDisplayReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews for game:', error);
      setDisplayReviews([]);
    }
  };

  // Always return 'Anonymous' for privacy
  const getReviewerName = (review) => {
    return 'Anonymous';
  };

  const loadReviewsFromStorage = () => {
    try {
      // Try to get reviews from context first
      const contextReviews = getAllReviews();
      if (contextReviews && contextReviews.length > 0) {
        console.log('Loaded reviews from context:', contextReviews);
        setDisplayReviews(contextReviews);
        return;
      }

      // Fallback: load directly from localStorage
      const storedReviews = localStorage.getItem('gameReviews');
      if (storedReviews) {
        const reviews = JSON.parse(storedReviews);
        console.log('Loaded reviews from localStorage:', reviews);
        setDisplayReviews(reviews);
      } else {
        console.log('No reviews found in localStorage');
        setDisplayReviews([]);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setDisplayReviews([]);
    }
  };

  const loadReviews = () => {
    loadReviewsFromStorage();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Review submit - user:', user);
    console.log('Review submit - token:', token);
    
    if (!formData.gameName || !formData.reviewText || !formData.reviewerName) {
      alert('Please fill in all required fields');
      return;
    }

    // Get gameId from location state or prompt user
    const gameId = location.state?.gameId;
    if (!gameId) {
      alert('Game ID is required. Please navigate from a game page.');
      return;
    }

    const reviewData = {
      gameId: gameId,
      gameName: formData.gameName,
      rating: formData.rating,
      reviewText: formData.reviewText,
      reviewerName: formData.reviewerName
    };

    try {
      await addReview(reviewData, { user, token });

      // Reset form
      setFormData({
        gameName: location.state?.gameName || '',
        rating: 5,
        reviewText: '',
        reviewerName: ''
      });

      setSubmitted(true);

      // Reload reviews for this game from API after successful submission
      if (gameId) {
        await loadReviewsForGame(gameId);
      }

      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      alert(error.message || 'Failed to submit review');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      // Try parsing common alternative keys or formats if needed later
      return 'Unknown date';
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(parseInt(rating));
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(reviewId, token);
      
      // Reload reviews after deletion
      if (location.state?.gameId) {
        await loadReviewsForGame(location.state.gameId);
      } else {
        loadReviewsFromStorage();
      }
      
      alert('Review deleted successfully!');
    } catch (error) {
      alert(error.message || 'Failed to delete review');
    }
  };

  const canDeleteReview = (review) => {
    // Check if the current user is the author of the review
    const currentUserId = user?.id || user?.userId || user?.UserId || user?.Id;
    const reviewUserId = review.userId || review.userID || review.UserId || review.UserID;
    
    console.log('Delete check - Current User:', user);
    console.log('Delete check - Current UserId:', currentUserId);
    console.log('Delete check - Review:', review);
    console.log('Delete check - Review UserId:', reviewUserId);
    console.log('Delete check - Can delete:', currentUserId && reviewUserId && currentUserId === reviewUserId);
    
    // For now, allow any logged-in user to delete any review (you can restrict this later)
    return !!user && !!token;
    
    // Uncomment below to restrict deletion to only the review author:
    // return currentUserId && reviewUserId && currentUserId === reviewUserId;
  };

  const filteredReviews = showAllReviews
    ? displayReviews
    : displayReviews.filter(review => review.gameName === formData.gameName);

  return (
    <div className="review-page">
      <div className="review-container">
        <h1>Add Game Review</h1>
        <p>Share your gaming experience with the community!</p>

        {location.state?.gameName && (
          <div className="game-info-banner">
            <span>📝 Reviewing: <strong>{location.state.gameName}</strong></span>
            <button
              onClick={() => navigate(-1)}
              className="back-btn"
            >
              ← Back to Game
            </button>
          </div>
        )}

        {submitted && (
          <div className="success-message">
            ✅ Review submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="gameName">Game Name *</label>
            <input
              type="text"
              id="gameName"
              name="gameName"
              value={formData.gameName}
              onChange={handleChange}
              placeholder="Enter the game name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reviewerName">Your Name *</label>
            <input
              type="text"
              id="reviewerName"
              name="reviewerName"
              value={formData.reviewerName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating *</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="rating-select"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
              <option value="2">⭐⭐ (2/5)</option>
              <option value="1">⭐ (1/5)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reviewText">Your Review *</label>
            <textarea
              id="reviewText"
              name="reviewText"
              value={formData.reviewText}
              onChange={handleChange}
              placeholder="Share your thoughts about the game..."
              rows="6"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Review
          </button>
        </form>

        {/* Reviews Display Section */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Game Reviews</h2>
            <div className="reviews-toggle">
              <button
                className={!showAllReviews ? 'active' : ''}
                onClick={() => setShowAllReviews(false)}
              >
                {formData.gameName ? `Reviews for ${formData.gameName}` : 'Current Game Reviews'}
              </button>
              <button
                className={showAllReviews ? 'active' : ''}
                onClick={() => setShowAllReviews(true)}
              >
                All Reviews ({displayReviews.length})
              </button>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review a game!</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {filteredReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-rating">
                      {renderStars(review.rating)}
                      <span className="rating-text">({review.rating}/5)</span>
                    </div>
                  </div>

                  <div className="review-content">
                    <p className="review-text">"{review.comment || review.reviewText || ''}"</p>
                  </div>

                  <div className="review-footer">
                    <div className="review-author">
                      <span className="author-name">By {getReviewerName(review)}</span>
                    </div>
                    <div className="review-date">
                      Submitted on {formatDate(review.createdAt || review.date)}
                    </div>
                  </div>

                  {canDeleteReview(review) && (
                    <div className="review-actions">
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="delete-btn"
                        title="Delete this review"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
