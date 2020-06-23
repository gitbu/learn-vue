const ADD = 'ADD';
const storeOptions = {
  modules: {
    a: {
      namespaced: true,
      state: () => ({
        nums: [],
      }),
      mutations: {
        ADD(state, data) {
          state.push(data);
        }
      },
      actions: {
        plus({ commit }, data) {
          commit(ADD, data);
        }
      },
      getters: {
        maxNum(state) { return Math.max(...state.nums); }
      },
      modules: {
        b: {
          namespaced: true,
          state: () => ({
            nums: [],
          }),
          mutations: {
            ADD(state, data) {
              state.push(data);
            }
          },
          actions: {
            plus({ commit }, data) {
              commit(ADD, data);
            }
          },
          getters: {
            maxNum(state) { return Math.max(...state.nums); }
          },
          modules: {
            c: {
              namespaced: true,
              state: () => ({
                nums: [],
              }),
              mutations: {
                ADD(state, data) {
                  state.push(data);
                }
              },
              actions: {
                plus({ commit }, data) {
                  commit(ADD, data);
                }
              },
              getters: {
                maxNum(state) { return Math.max(...state.nums); }
              },
            }

          }
        }
      }
    }
  }
}

window.storeOptions = storeOptions; 