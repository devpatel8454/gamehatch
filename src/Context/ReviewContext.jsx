import React, { createContext, useState, useEffect } from 'react';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  // Load reviews from API on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async (gameId = null) => {
    try {
      // If gameId is provided, fetch reviews for that specific game
      if (gameId) {
        const response = await fetch(`https://localhost:7270/api/Review/game/${gameId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched reviews for game:', gameId, data);
          
          // Fetch user information for each review
          const reviewsWithUsers = await Promise.all(
            (Array.isArray(data) ? data : []).map(async (review) => {
              try {
                // Try to fetch user information
                const userId = review.userId || review.userID || review.UserId || review.UserID;
                if (userId) {
                  const userResponse = await fetch(`https://localhost:7270/api/User/${userId}`);
                  if (userResponse.ok) {
                    const userData = await userResponse.json();
                    console.log('Fetched user data for review:', userData);
                    return {
                      ...review,
                      user: userData,
                      userName: userData.userName || userData.username || userData.UserName || userData.Username || 
                               userData.firstName || userData.FirstName || userData.name || userData.Name
                    };
                  }
                }
                return review;
              } catch (userError) {
                console.error('Error fetching user data:', userError);
                return review;
              }
            })
          );
          
          console.log('Reviews with user data:', reviewsWithUsers);
          return reviewsWithUsers;
        }
      }
      
      // Fallback: load from localStorage
      const storedReviews = localStorage.getItem('gameReviews');
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
      return [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  };

  const addReview = async (reviewData, userContext) => {
    try {
      // Get userId and token from passed context
      const { user, token } = userContext || {};
      
      // Get userId from localStorage if not in user object
      let userId = user?.id || user?.userId || user?.UserId || user?.Id;
      
      // Fallback: try to get from localStorage
      if (!userId) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser.id || parsedUser.userId || parsedUser.UserId || parsedUser.Id;
          }
        } catch (e) {
          console.warn('Failed to parse user from localStorage:', e);
        }
      }
      
      // Fallback: decode from token
      if (!userId && token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          ).join(''));
          const payload = JSON.parse(jsonPayload);
          userId = payload.sub || payload.nameid || payload.userId || payload.UserId || payload.uid || payload.id || payload.Id;
        } catch (e) {
          console.warn('Failed to decode userId from token:', e);
        }
      }
      
      console.log('[ReviewContext] Final resolved userId:', userId);
      
      if (!userId) {
        throw new Error('User not authenticated. Please login to submit a review.');
      }

      // Validate required fields
      const comment = reviewData.reviewText || reviewData.comment || '';
      if (!comment || comment.trim() === '') {
        throw new Error('Review text is required');
      }

      // Prepare payload matching API contract (camelCase as per backend requirement)
      const payload = {
        userId: userId,
        gameId: reviewData.gameId,
        rating: parseInt(reviewData.rating),
        comment: comment.trim(),
        reviewerName: reviewData.reviewerName || reviewData.ReviewerName || '',
        createdAt: new Date().toISOString()
      };

      console.log('[ReviewContext] Review data received:', reviewData);
      console.log('[ReviewContext] Adding review via API:', payload);

      const response = await fetch('https://localhost:7270/api/Review/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log('Review API response:', response.status, text);

      if (!response.ok) {
        throw new Error(text || `Failed to add review (${response.status})`);
      }

      // Update local state after successful API call
      const newReview = {
        id: Date.now(),
        ...reviewData,
        date: payload.CreatedAt,
        helpful: 0
      };
      setReviews(prevReviews => [newReview, ...prevReviews]);

      return { success: true };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const updateReviewHelpful = (reviewId) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const deleteReview = async (reviewId, token) => {
    try {
      console.log('[ReviewContext] Deleting review:', reviewId);

      const response = await fetch(`https://localhost:7270/api/Review/delete/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to delete review (${response.status})`);
      }

      console.log('[ReviewContext] Review deleted successfully');

      // Update local state after successful API call
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));

      return { success: true };
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };

  const getReviewsByGame = (gameName) => {
    return reviews.filter(review =>
      review.gameName.toLowerCase().includes(gameName.toLowerCase())
    );
  };

  const getAllReviews = () => {
    return reviews;
  };

  const getReviewStats = () => {
    if (reviews.length === 0) {
      return { totalReviews: 0, averageRating: 0 };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + parseInt(review.rating), 0) / totalReviews;

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10
    };
  };

  const value = {
    reviews,
    addReview,
    updateReviewHelpful,
    deleteReview,
    getReviewsByGame,
    getAllReviews,
    getReviewStats,
    fetchReviews
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};
