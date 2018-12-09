import * as Types from './mutation-types'
import * as Util from '@/config/mUtil'
import {setStore, getStore} from '@/config/mUtil'
import {localapi, proapi} from '@/config/env'
export default {
	//保存当前城市geohash
	[Types.SAVE_GEOHASH] (state, geohash) {
		state.geohash = geohash
	},

	//保存当前城市地理位置
	[Types.RECORD_ADDRESS] (state, data) {
		state.latitude = data.latitude
		state.longitude = data.longitude
	},

	//保存用户信息
	[Types.RECORD_USERINFO] (state, info) {
		state.userInfo = info;
		state.login = true;
		Util.setStore('user_id', info.user_id);
	},


	[Types.RECORD_SHOPDETAIL](state, detail) {
		state.shopDetail = detail;
	},
	// 加入购物车
	[Types.ADD_CART](state, {
		shopid,
		category_id,
		item_id,
		food_id,
		name,
		price,
		specs,
		packing_fee,
		sku_id,
		stock,
	}) {
		let cart = state.cartList;
		let shop = cart[shopid] = (cart[shopid] || {});
		shop['shopId'] = shopid
		let category = shop[category_id] = (shop[category_id] || {});
		category['category_id'] = category_id
		let item = category[item_id] = (category[item_id] || {});

		if (item[food_id]) {
			
			item[food_id]['num']++;
		} else {
			item[food_id] = {
					"num" : 1,
					"id" : food_id,
					"name" : name,
					"price" : price,
					"specs" : specs,
					"packing_fee" : packing_fee,
					"sku_id" : sku_id,
					"stock" : stock
			};
		}
		state.cartList = {...cart};
		//存入localStorage
		setStore('cartList', state.cartList);
	},
	// 移出购物车
	[Types.REDUCE_CART](state, {
		shopid,
		category_id,
		item_id,
		food_id,
		name,
		price,
		specs,
	}) {
		let cart = state.cartList;
		let shop = (cart[shopid] || {});
		let category = (shop[category_id] || {})
		let item = (category[item_id] || {})
		if (item && item[food_id]) {
			
			if (item[food_id]['num'] > 0) {
				item[food_id]['num']--;
				state.cartList = {...cart}
				//存入localStorage
				setStore('cartList', state.cartList)
			} else {
				//商品数量为0，则清空当前商品的信息
				item[food_id] = null
			}
		}
	},
	//网页初始化时从本地缓存获取购物车数据
	[Types.INIT_cartList](state) {
		let initCart = getStore('cartList');
		if (initCart) {
			state.cartList = JSON.parse(initCart);
		}
	},
	//清空当前商品的购物车信息
	[Types.CLEAR_CART](state, shopid) {
		state.cartList[shopid] = null;
		state.cartList = {...state.cartList};
		setStore('cartList', state.cartList);
	},
	//获取用户信息存入vuex
	[Types.GET_USERINFO](state, info) {
		if (state.userInfo && (state.userInfo.username !== info.username)) {
			return;
		};
		if (!state.login) {
			return
		}
		if (!info.message) {
			state.userInfo = {...info};
		} else {
			state.userInfo = null;
		}
	},
	//修改用户名
	[Types.RETSET_NAME](state,username) {
		state.userInfo = Object.assign({}, state.userInfo,{username})
	},
	//保存商铺id
	[Types.SAVE_SHOPID](state, shopid) {
		state.shopid = shopid;
	},
	//记录订单页面用户选择的备注, 传递给订单确认页面
	[Types.CONFIRM_REMARK](state, {
		remarkText,
		inputText
	}) {
		state.remarkText = remarkText;
		state.inputText = inputText;
	},
	//是否开发票
	[Types.CONFIRM_INVOICE](state, invoice) {
		state.invoice = invoice;
	},
	//选择搜索的地址
	[Types.CHOOSE_SEARCH_ADDRESS](state, place) {
		state.searchAddress = place;
	},
	//保存geohash
	[Types.SAVE_GEOHASH](state, geohash) {
		state.geohash = geohash;
		
	},
	//确认订单页添加新的的地址
	[Types.CONFIRM_ADDRESS](state, newAddress) {
		state.newAddress.push(newAddress);
	},
	//选择的地址
	[Types.CHOOSE_ADDRESS](state, {
		address,
		index
	}) {
		state.choosedAddress = address;
		state.addressIndex = index;
	},
	//保存下单需要验证的返回值
	[Types.NEED_VALIDATION](state, needValidation) {
		state.needValidation = needValidation;
	},
	//保存下单后购物id 和 sig
	[Types.SAVE_CART_ID_SIG](state, {
		cart_id,
		sig
	}) {
		state.cart_id = cart_id;
		state.sig = sig;
	},
	//保存下单参数，用户验证页面调用
	[Types.SAVE_ORDER_PARAM](state, orderParam) {
		state.orderParam = orderParam;
	},
	//修改下单参数
	[Types.CHANGE_ORDER_PARAM](state, newParam) {
		state.orderParam = Object.assign({}, state.orderParam, newParam);
	},
	//下单成功，保存订单返回信息
	[Types.ORDER_SUCCESS](state, order) {
		state.cartPrice = null;
		state.orderMessage = order;
	},
	//进入订单详情页前保存该订单信息
	[Types.SAVE_ORDER](state, orderDetail) {
		state.orderDetail = orderDetail;
	},
	//退出登录
	[Types.OUT_LOGIN](state) {
		state.userInfo = {};
		state.login = false;
	},
	//保存图片
	[Types.SAVE_AVANDER](state, imgPath) {
		state.imgPath = imgPath;
	},
	//删除地址列表
	[Types.SAVE_ADDRESS](state, newAdress) {
		state.removeAddress = newAdress
	},
	//添加地址name
	[Types.SAVE_ADDDETAIL](state, addAddress){
		state.addAddress=addAddress;
	},
	//保存所选问题标题和详情
	[Types.SAVE_QUESTION](state, question) {
		state.question = {...question};
	},
	//增加地址
	[Types.ADD_ADDRESS](state, obj) {
		state.removeAddress = [obj, ...state.removeAddress];
	},
	//会员卡价格纪录
	[Types.BUY_CART](state, price) {
		state.cartPrice = price;
	},
}