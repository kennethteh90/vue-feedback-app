<template>
  <div id="app">

    <div>
      <h1>Welcome to our feedback system</h1>
      <h2>Please tell us how your meal went so we can do even better next time!</h2>
      <hr>
    </div>

    <div>
      <h3 v-if="Object.keys(orders).length === 0">Nothing here yet! Head on over to our ordering page to get some awesome food!</h3>
      <table v-else-if="orders.length">
        <thead>
          <th>Order ID</th>
          <th>Feedback</th>
        </thead>

        <tbody>
          <tr v-for="order in orders">
            <td> {{ order.order_id }} </td>
            <td v-if="order.feedback_submitted"> Thanks for sharing your feedback! </td>
            <td v-else-if="!order.feedback_submitted">
              <button v-on:click="handleClick(order.order_id)" id="show-modal" @click="showModal = true">Submit Feedback</button> 
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition v-if="showModal" name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                default header
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                default body
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                default footer
                <button class="modal-default-button" @click="showModal=false">
                  OK
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>

</template>

<script>
  export default {

    data() {
      return {
        orders: {},
        selectedOrder: null,
        showModal: false,
        baseUrl: 'http://localhost:3000/orders/'
        // baseUrl: 'https://food-delivery-api.herokuapp.com/orders'
      }
    },

    methods: {

      fetchOrders() {
        fetch(this.baseUrl)
          .then(function(response) {
            if (!response.ok) {
              throw Error(response.statusText)
            }
            return response
          })
          .then(results => results.json())
          .then(res => {
            console.log(res.orders)
            this.orders = res.orders
          })
      },

      handleClick: function(order_id) {
        this.selectedOrder = order_id
        console.log("clicked")
        console.log(this.selectedOrder)
      },

      handleSubmit: function() {

        console.log("submitted")

        // loop to get data from handleSubmit(itemRatableId, orderRatableId)
        // Workaround: starts from 1 to avoid the DeliveryItem, but this array only contains itemRatableId for OrderItems, so use i-1
        for (i = 1; i <= this.itemRatableId.length; i++) {
          this.formData.feedbacks[i].ratable_id = this.itemRatableId[i - 1]
          this.formData.feedbacks[i].ratable_type = "OrderItem"
        }

        this.formData.feedbacks[0].ratable_id = this.orderRatableId
        this.formData.feedbacks[0].ratable_type = "DeliveryOrder"

        var url = this.baseUrl + this.orderRatableId + '/feedbacks'

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(this.formData),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          })
          .then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => console.log('Success:', response))

        this.selectedOrder = null
        alert("Thanks for your feedback!")
        location.reload()
      }
    },

    mounted() {
        // call this.apiCall here
        this.fetchOrders()
    },

  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  table {
    margin: 2em;
    padding: 2em;
  }

  th {
    font-size: 1.2em;
    border-bottom: 1px solid black;
    padding: .5em 2em;
  }

  td {
    padding: .5em 2em;
  }

  button {
    border-radius: 0;
    border: none;
    padding: .5em 3em;
    margin: .5em 1em;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }

  button:hover {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc;
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    height: 80%;
    width: 80%;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }


</style>
