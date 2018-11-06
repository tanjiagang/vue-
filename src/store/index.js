import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
	currentCity: {}, //当前城市
	geohash: '', //当前城市地理位置
	latitude: '', // 当前位置纬度
	longitude: '', // 当前位置经度
}
export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
})