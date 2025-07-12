import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

const FeedbackModal = ({ order, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    feedbacks: []
  });

  useEffect(() => {
    if (order) {
      // Initialize form data with empty feedbacks
      const initialFeedbacks = [
        {
          ratable_id: "",
          ratable_type: "",
          rating: 0,
          comment: ""
        }
      ];

      // Add feedback slots for each order item
      for (let order_item of order.order_items) {
        initialFeedbacks.push({
          ratable_id: "",
          ratable_type: "",
          rating: 0,
          comment: ""
        });
      }

      setFormData({
        feedbacks: initialFeedbacks
      });
    }
  }, [order]);

  const handleRatingChange = (index, rating) => {
    const newFeedbacks = [...formData.feedbacks];
    newFeedbacks[index].rating = rating;
    setFormData({ feedbacks: newFeedbacks });
  };

  const handleCommentChange = (index, comment) => {
    const newFeedbacks = [...formData.feedbacks];
    newFeedbacks[index].comment = comment;
    setFormData({ feedbacks: newFeedbacks });
  };

  const handleSubmit = () => {
    // Validate that all ratings are provided
    const hasAllRatings = formData.feedbacks.every(feedback => feedback.rating !== 0);
    
    if (!hasAllRatings) {
      Alert.alert('Error', 'Please provide ratings for all items');
      return;
    }

    onSubmit(formData);
  };

  if (!order) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Feedback for Order {order.order_id}</Text>
      </View>

      <ScrollView style={styles.modalBody}>
        <Text style={styles.sectionTitle}>How was the food?</Text>

        {order.order_items.map((order_item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemName}>{order_item.name}</Text>
            
            <View style={styles.ratingContainer}>
              <TouchableOpacity
                style={[
                  styles.ratingButton,
                  formData.feedbacks[index + 1]?.rating === 1 && styles.ratingButtonSelected
                ]}
                onPress={() => handleRatingChange(index + 1, 1)}
              >
                <Text style={[
                  styles.ratingButtonText,
                  formData.feedbacks[index + 1]?.rating === 1 && styles.ratingButtonTextSelected
                ]}>
                  👍 Good
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ratingButton,
                  formData.feedbacks[index + 1]?.rating === -1 && styles.ratingButtonSelected
                ]}
                onPress={() => handleRatingChange(index + 1, -1)}
              >
                <Text style={[
                  styles.ratingButtonText,
                  formData.feedbacks[index + 1]?.rating === -1 && styles.ratingButtonTextSelected
                ]}>
                  👎 Bad
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.commentLabel}>Comment:</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Leave your comments here!"
              value={formData.feedbacks[index + 1]?.comment || ''}
              onChangeText={(text) => handleCommentChange(index + 1, text)}
              multiline
              numberOfLines={3}
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>What about the delivery?</Text>
        <Text style={styles.itemName}>Courier</Text>
        
        <View style={styles.ratingContainer}>
          <TouchableOpacity
            style={[
              styles.ratingButton,
              formData.feedbacks[0]?.rating === 1 && styles.ratingButtonSelected
            ]}
            onPress={() => handleRatingChange(0, 1)}
          >
            <Text style={[
              styles.ratingButtonText,
              formData.feedbacks[0]?.rating === 1 && styles.ratingButtonTextSelected
            ]}>
              👍 Good
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ratingButton,
              formData.feedbacks[0]?.rating === -1 && styles.ratingButtonSelected
            ]}
            onPress={() => handleRatingChange(0, -1)}
          >
            <Text style={[
              styles.ratingButtonText,
              formData.feedbacks[0]?.rating === -1 && styles.ratingButtonTextSelected
            ]}>
              👎 Bad
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.commentLabel}>Comment:</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Leave your comments here!"
          value={formData.feedbacks[0]?.comment || ''}
          onChangeText={(text) => handleCommentChange(0, text)}
          multiline
          numberOfLines={3}
        />
      </ScrollView>

      <View style={styles.modalFooter}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    marginTop: 10,
  },
  itemContainer: {
    marginBottom: 20,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  ratingButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#f8f9fa',
  },
  ratingButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  ratingButtonText: {
    fontSize: 14,
    color: '#495057',
  },
  ratingButtonTextSelected: {
    color: 'white',
  },
  commentLabel: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    color: '#495057',
    textAlignVertical: 'top',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 4,
    flex: 1,
    marginLeft: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FeedbackModal;