<template>
<div id="app">

  <div>
    <h1>Welcome to our feedback system</h1>
    <h2>Please tell us how your meal went so we can do even better next time!</h2>
  </div>

  <div>
    <table>
      <thead>
        <th>Order ID</th>
        <th>Feedback</th>
      </thead>

      <tbody>
        <tr v-for="order in orders">

          <td> {{ order.order_id }} </td>
          <td v-if="order.feedback_submitted"> Thanks for sharing your feedback! </td>
          <td v-if="!order.feedback_submitted"> <button v-on:click="handleClick(order.order_id)">Submit Feedback</button> </td>
        </tr>
      </tbody>
    </table>
  </div>

</div>
</template>

<script>
export default {

  data() {
    return {
      orders: { },
      selectedOrder: ""
    }
  },

  methods: {

    fetchOrders() {
      fetch("https://food-delivery-api.herokuapp.com/orders")
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

</style>
