import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import FeedbackModal from './components/FeedbackModal';

const App = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // baseUrl: 'http://localhost:3000/orders/' // for localhost
  const baseUrl = 'https://food-delivery-api.herokuapp.com/orders/'; // for heroku

  // Fetch order list from API
  const fetchOrders = async () => {
    try {
      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log(data.orders);
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to fetch orders');
    }
  };

  // Select order to provide feedback, launch modal
  const handleOrderSelect = (orderId) => {
    setSelectedOrder(orderId);
    setIsModalVisible(true);
  };

  // Submit feedback
  const handleSubmitFeedback = async (formData) => {
    try {
      const order = orders.find(item => item.id === selectedOrder);
      
      // Workaround: starts from 1 to avoid the DeliveryItem
      for (let i = 1; i <= order.order_items.length; i++) {
        formData.feedbacks[i].ratable_id = order.order_items[i-1].order_item_id;
        formData.feedbacks[i].ratable_type = "OrderItem";
      }

      formData.feedbacks[0].ratable_id = order.order_id;
      formData.feedbacks[0].ratable_type = "DeliveryOrder";

      const url = baseUrl + order.order_id + '/feedbacks';

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Success:', response);
        setSelectedOrder(null);
        setIsModalVisible(false);
        Alert.alert('Success', 'Thanks for your feedback!');
        fetchOrders();
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to submit feedback');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const selectedOrderData = orders.find(item => item.id === selectedOrder);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to our feedback system</Text>
          <Text style={styles.subtitle}>
            Please tell us how your meal went so we can do even better next time!
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.content}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>
              Nothing here yet! Head on over to our ordering page to get some awesome food!
            </Text>
          ) : (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Order ID</Text>
                <Text style={styles.tableHeaderText}>Feedback</Text>
              </View>
              
              {orders.map((order) => (
                <View key={order.order_id} style={styles.tableRow}>
                  <Text style={styles.orderId}>{order.order_id}</Text>
                  <View style={styles.feedbackCell}>
                    {order.feedback_submitted ? (
                      <Text style={styles.submittedText}>
                        Thanks for sharing your feedback!
                      </Text>
                    ) : (
                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => handleOrderSelect(order.order_id)}
                      >
                        <Text style={styles.buttonText}>Submit Feedback</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={styles.modal}
      >
        <FeedbackModal
          order={selectedOrderData}
          onSubmit={handleSubmitFeedback}
          onClose={() => {
            setSelectedOrder(null);
            setIsModalVisible(false);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
  },
  content: {
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableHeaderText: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  orderId: {
    flex: 1,
    padding: 15,
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
  },
  feedbackCell: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  submittedText: {
    fontSize: 14,
    color: '#28a745',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;