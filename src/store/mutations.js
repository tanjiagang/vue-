import * as Types from './mutation-types'
export default {
	//保存当前城市geohash
	[Types.SAVE_GEOHASH] (state, geohash) {
		state.geohash = geohash
	},

	//保存当前城市地理位置
	[Types.RECORD_ADDRESS] (state, recordAddress) {
		state.recordAddress = georecordAddresshash
	}
}