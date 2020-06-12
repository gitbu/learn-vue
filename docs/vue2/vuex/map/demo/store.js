store = new Vuex.Store({
  state: {
    nums: []
  },
  mutations: {
    add(state, num) {
      state.nums.push(num);
    }
  }
})