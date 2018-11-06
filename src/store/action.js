import getCurrentCity from '@/config/mUtil'
import * as Types from './mutation-types'

export default {
	//保存当前城市geohash
	[Types.SAVE_GEOHASH]({
		commit,
		state
	}, geohash) {
		commit(Types.SAVE_GEOHASH, geohash)
	},

	//保存当前城市地理位置(经纬度)
	[Types.RECORD_ADDRESS] ({
		commit,
		state
	}, res) {
		state.latitude = res.latitude
		state.longitude = res.longitude
	}
}