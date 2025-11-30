import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReviewContext } from '../Context/ReviewContext';
import { useAuth } from '../Context/Authcontext';
import { toast } from 'react-toastify';
import './ReviewPage.css';
import CyberpunkDivider from '../Components/CyberpunkDivider';
import ReviewAnalyticsChart from '../Components/ReviewAnalyticsChart';
import ReviewForm from '../Components/ReviewForm';
import ConfirmDialog from '../Components/ConfirmDialog/ConfirmDialog';

const ReviewPage = () => {
  const { addReview, getAllReviews, getReviewsByGame, fetchReviews, deleteReview } = useContext(ReviewContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [submitted, setSubmitted] = useState(false);
  const [displayReviews, setDisplayReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentGameName, setCurrentGameName] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, reviewId: null });

  // Pre-populate game name if coming from game page
  useEffect(() => {
    if (location.state?.gameName) {
      setCurrentGameName(location.state.gameName);
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
    setDeleteDialog({ isOpen: true, reviewId });
  };

  const confirmDelete = async () => {

    const reviewId = deleteDialog.reviewId;
    if (!reviewId) return;

    try {
      await deleteReview(reviewId, token);

      // Reload reviews after deletion
      if (location.state?.gameId) {
        await loadReviewsForGame(location.state.gameId);
      } else {
        loadReviewsFromStorage();
      }

      toast.success('🗑️ Review deleted successfully!');
    } catch (error) {
      toast.error(`❌ ${error.message || 'Failed to delete review'}`);
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

  // Define filteredReviews first (needed by analyticsData)
  const filteredReviews = showAllReviews
    ? displayReviews
    : displayReviews.filter(review => review.gameName === (currentGameName || location.state?.gameName));

  // Calculate analytics data for the chart - split into sentiment and tags
  const analyticsData = useMemo(() => {
    const reviewsToAnalyze = filteredReviews;
    if (!reviewsToAnalyze || reviewsToAnalyze.length === 0) return { sentiment: [], tags: [] };

    const sentimentStats = {
      'Positive': 0,
      'Negative': 0,
      'Mixed': 0
    };

    const tagStats = {
      'Story': 0,
      'Gameplay': 0,
      'Graphics': 0,
      'Performance': 0,
      'Sound': 0,
      'Multiplayer': 0
    };

    reviewsToAnalyze.forEach(review => {
      const rating = parseInt(review.rating);

      // Sentiment Logic
      if (rating >= 4) sentimentStats['Positive']++;
      else if (rating <= 2) sentimentStats['Negative']++;
      else sentimentStats['Mixed']++;

      // Tag Logic - PRIORITIZE user-selected tags from the form
      if (review.tags && Array.isArray(review.tags) && review.tags.length > 0) {
        // User explicitly selected these tags in the form
        review.tags.forEach(tag => {
          if (tagStats[tag] !== undefined) {
            tagStats[tag]++;
          }
        });
      } else {
        // Fallback: Auto-detect from text for legacy reviews without tags
        const text = (review.reviewText || review.comment || '').toLowerCase();
        if (text.includes('story') || text.includes('plot') || text.includes('narrative')) tagStats['Story']++;
        if (text.includes('gameplay') || text.includes('fun') || text.includes('mechanic')) tagStats['Gameplay']++;
        if (text.includes('graphics') || text.includes('visual') || text.includes('art')) tagStats['Graphics']++;
        if (text.includes('performance') || text.includes('lag') || text.includes('fps') || text.includes('bug')) tagStats['Performance']++;
        if (text.includes('sound') || text.includes('music') || text.includes('audio')) tagStats['Sound']++;
        if (text.includes('multiplayer') || text.includes('online') || text.includes('co-op')) tagStats['Multiplayer']++;
      }
    });

    return {
      sentiment: Object.entries(sentimentStats)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0),
      tags: Object.entries(tagStats)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0)
    };
  }, [filteredReviews]);

  const handleFormSubmit = async (formData) => {
    // Wrapper to adapt ReviewForm data to the existing addReview context function
    const gameId = location.state?.gameId;
    if (!gameId) {
      toast.error('🎮 Game ID is required. Please navigate from a game page.');
      return;
    }

    const reviewData = {
      gameId: gameId,
      gameName: formData.gameName,
      rating: formData.rating,
      reviewText: formData.reviewText,
      reviewerName: formData.reviewerName,
      tags: formData.tags // Pass tags to backend (even if backend ignores them, we use them locally)
    };

    try {
      await addReview(reviewData, { user, token });

      // Optimistically add to displayReviews to show immediate update in chart
      // (The context might already do this, but let's ensure it for the "Real-time" feel)
      const newReview = { ...reviewData, id: Date.now(), createdAt: new Date().toISOString() };
      setDisplayReviews(prev => [newReview, ...prev]);

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error(`❌ ${error.message || 'Failed to submit review'}`);
    }
  };



  return (
    <div className="review-page">
      <div className="review-container max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 font-orbitron">
          Mission Report
        </h1>
        <p className="text-center text-slate-400 mb-8">Submit your analysis and view live community intelligence.</p>

        {location.state?.gameName && (
          <div className="game-info-banner mb-8">
            <span>📝 Target: <strong>{location.state.gameName}</strong></span>
            <button onClick={() => navigate(-1)} className="back-btn">← Abort</button>
          </div>
        )}

        {submitted && (
          <div className="success-message mb-6 text-center bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-lg backdrop-blur-md">
            ✅ Data Upload Complete. Intelligence Updated.
          </div>
        )}

        {/* Dashboard Grid: Form + Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-stretch">

          {/* Left: Review Form */}
          <div className="h-full">
            <ReviewForm
              onSubmit={handleFormSubmit}
              initialGameName={location.state?.gameName || ''}
            />
          </div>

          {/* Right: Sentiment Analytics */}
          <div className="h-full min-h-[500px]">
            <ReviewAnalyticsChart
              data={analyticsData.sentiment.length > 0 ? analyticsData.sentiment : undefined}
              title="Sentiment Vibe"
            />
          </div>

        </div>

        {/* Second Row: Tag Analytics */}
        {analyticsData.tags.length > 0 && (
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-2xl">
              <ReviewAnalyticsChart
                data={analyticsData.tags}
                title={currentGameName ? `${currentGameName} - Feature Analysis` : "Feature Analysis"}
              />
            </div>
          </div>
        )}

        {/* Cyberpunk Divider */}
        <CyberpunkDivider />

        {/* Reviews Display Section */}
        <div className="reviews-section mt-8">

          <div className="reviews-header">
            <h2>Game Reviews</h2>
            <div className="reviews-toggle">
              {/* <button
                className={!showAllReviews ? 'active' : ''}
                onClick={() => setShowAllReviews(false)}
              >
                {formData.gameName ? `Reviews for ${formData.gameName}` : 'Current Game Reviews'}
              </button> */}
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, reviewId: null })}
        onConfirm={confirmDelete}
        title="⚠️ Delete Review"
        message="Are you sure you want to permanently delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ReviewPage;
