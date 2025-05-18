import { defineStore } from 'pinia'

/*
 * 用户信息存储
*/
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    logout() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.userInfo?.role || null,
    marketerStatus: (state) => state.userInfo?.status || null,
    marketerId: (state) => state.userInfo?.marketerId || null
  }
})
