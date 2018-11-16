import getCurrentCity from '@/config/mUtil'
import {
	getUser,
	getAddressList
} from '@/service/getData2'
import {
	GET_USERINFO,
	RECORD_ADDRESS,
	SAVE_GEOHASH
} from './mutation-types.js'

export default {
	async getUserInfo ({
		commit,
		state
	}) {
		let res = await getUser()
		commit(GET_USERINFO, res)
	},

	async saveAddress({
		commit,
		state
	}) {

		if(state.removeAddress.length > 0) return;
		let addres = await getAddressList(state.userInfo.user_id);
		commit(SAVE_ADDRESS, addres);	
	},

	//保存当前城市geohash
	[SAVE_GEOHASH]({
		commit,
		state
	}, geohash) {
		commit(SAVE_GEOHASH, geohash)
	},

	//保存当前城市地理位置(经纬度)
	[RECORD_ADDRESS] ({
		commit,
		state
	}, res) {
		commit(RECORD_ADDRESS, res)
	}
}