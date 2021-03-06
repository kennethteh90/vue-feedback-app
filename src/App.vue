<template>
  <div id="app">

    <div>
      <h1>Welcome to our feedback system</h1>
      <h2>Please tell us how your meal went so we can do even better next time!</h2>
      <hr>
    </div>

    <div>

      <!-- Check if there are any orders -->
      <h3 v-if="Object.keys(orders).length === 0">Nothing here yet! Head on over to our ordering page to get some awesome food!</h3>
      <table v-else-if="orders.length">
        <thead>
          <th>Order ID</th>
          <th>Feedback</th>
        </thead>

        <tbody>
          <tr v-for="order in orders" v-bind:key="order.order_id">
            <td> {{ order.order_id }} </td>
            <td v-if="order.feedback_submitted"> Thanks for sharing your feedback! </td>
            <td v-else-if="!order.feedback_submitted">
              <button v-on:click="handleClick(order.order_id)" id="show-modal">Submit Feedback</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Show modal if button is clicked, order is selected -->
    <transition v-if="selectedOrder" name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                <h1>Feedback for Order {{selectedOrder}}</h1>
              </slot>
            </div>

            <hr>

            <div class="modal-body">
              <slot name="body">

                <form @submit.prevent="handleSubmit()">

                  <h2>How was the food?</h2>

                  <div v-for="(order_item, index) in order.order_items">

                    <h3> {{ order_item.name }} </h3>

                      <input type="radio" :id="'good'+index" class="good" value=1 v-model="formData.feedbacks[index+1].rating">
                      <label :for="'good'+index"></label>

                      <input type="radio" :id="'bad'+index" class="bad" value=-1 v-model="formData.feedbacks[index+1].rating">
                      <label :for="'bad'+index"></label>

                    <br>

                    <span>Comment:</span>
                    <br>
                    <textarea v-model="formData.feedbacks[index+1].comment" placeholder="Leave your comments here!"></textarea>

                  </div>

                  <h2>What about the delivery?</h2>
                  <h3> Courier </h3>

                  <input type="radio" id="good" class="good" value=1 v-model="formData.feedbacks[0].rating">
                  <label for="good"></label>
                  <input type="radio" id="bad" class="bad" value=-1 v-model="formData.feedbacks[0].rating">
                  <label for="bad"></label>

                  <br>

                  <span>Comment:</span>
                  <br>
                  <textarea v-model="formData.feedbacks[0].comment" placeholder="Leave your comments here!"></textarea>

                  <br> <br>

                  <button type="submit">Submit</button>

                </form>

              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button class="modal-close-button" @click="selectedOrder=null">
                  Close
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

    data () {
      return {
        orders: {},
        selectedOrder: null,
        formData: {
          feedbacks: []
        },
        // baseUrl: 'http://localhost:3000/orders/' // for localhost
        baseUrl: 'https://food-delivery-api.herokuapp.com/orders/' // for heroku
      }
    },

    computed: {
      order: function () {
        return this.orders.find(item => item.id === this.selectedOrder)
      }
    },

    methods: {

      // Fetch order list from API
      fetchOrders () {
        fetch (this.baseUrl)
          .then(function (response) {
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
          .catch(error => {
            console.log(error)
          })
      },

      // Select order to provide feedback, launch modal
      handleClick: function (order_id) {
        this.selectedOrder = order_id
        this.formData = {
          feedbacks: [
            {
              ratable_id: "",
              ratable_type: "",
              rating: 0,
              comment: ""
            }
          ]
        }
        console.log("clicked")
        console.log(this.selectedOrder)
        for (let order_item of this.order.order_items) {
          this.formData.feedbacks.push({
            ratable_id: "",
            ratable_type: "",
            rating: 0,
            comment: ""
          })
        }
      },

      // Submit form
      handleSubmit: function() {
        // Workaround: starts from 1 to avoid the DeliveryItem
        for (let i = 1; i <= this.order.order_items.length; i++) {
          this.formData.feedbacks[i].ratable_id = this.order.order_items[i-1].order_item_id
          this.formData.feedbacks[i].ratable_type = "OrderItem"
        }

        this.formData.feedbacks[0].ratable_id = this.order.order_id
        this.formData.feedbacks[0].ratable_type = "DeliveryOrder"

        var url = this.baseUrl + this.order.order_id + '/feedbacks'

        // Post to API
        fetch(url,
          {
            method: 'POST',
            body: JSON.stringify(this.formData),
            headers: new Headers({
              'Content-Type': 'application/json'
          })
        })
        .catch(error => console.error('Error:', error))
        .then(response => {
          console.log('Success:', response)
          this.selectedOrder = null
          alert("Thanks for your feedback!")
          this.fetchOrders()
        }
      }
    },

    mounted() {
      this.fetchOrders()
    },

  }


</script>

<style>

  @import url(//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css);

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
    overflow-y: auto;
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

  .modal-close-button {
    /*float: right;*/
    background-color: grey;
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

  /*https://gist.githubusercontent.com/pom-pom/10255961/raw/1ec68600b358e7719a9b1295756d99cfa53365d0/font-awesome-form-elements.css*/
  /*Custom Radio Buttons and Checkboxes using Font Awesome*/

  .radio {
    display: block;
  }

  input[type=radio] {
    display: none;
  }

  input[type='radio'] + label:before {
    display: inline-block;
    font-family: FontAwesome;
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    font-size: 2em;
    margin-bottom: .5em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding-right: 8px;
    width: 23px;
  }
  input[type='radio'].good + label:before {
    content: "\f164";
    color: #D6D5D5;
  }

  input[type='radio']:checked.good + label:before {
    content: "\f164";
    color: orange;
  }

  input[type='radio'].bad + label:before {
    content: "\f165";
    color: #D6D5D5;
  }

  input[type='radio']:checked.bad + label:before {
    content: "\f165";
    color: orange;
  }

  .radio label  {
    padding-left: 0;
  }

</style>
