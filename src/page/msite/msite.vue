<template>
	<div>
		<head-top signin-up='msite'>
    		<router-link :to="'/search/geohash'" class="link-search" slot="search">
	    			
    		</router-link>
			<router-link to="/home" slot="head-title" class="head-title">
				{{msiteTitle}}
			</router-link>
    	</head-top>

    	<nav class="msite-nav">
    		<div class="swiper-container" v-if="foodTypes.length">
		        <div class="swiper-wrapper">
		            <div 
		            	class="swiper-slide food-types-container" 
		            	v-for="(item, index) in foodTypes" 
		            	:key="index">
	            		<router-link :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: ''}}" v-for="foodItem in item" :key="foodItem.id" class="link-to-food">
	            			<figure ref="test">
	            				<img :src="imgBaseUrl + foodItem.image_url">
	            				<figcaption>{{foodItem.title}}</figcaption>
	            			</figure>
	            		</router-link>
		            </div>
		        </div>
		        <div class="swiper-pagination"></div>
		    </div>
    	</nav>

    	<div class="shop-list-wrap">
    		<h4>附近商家</h4>
    		<shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    	</div>

    	<footer-nav></footer-nav>
	</div>
</template>

<script>
import HeadTop from '@/components/head/head'
import ShopList from '@/components/shoplist'
import FooterNav from '@/components/footer/footerNav'
import axios from 'axios'
import * as Types from '@/store/mutation-types'
import {cityGuess, msiteAddress, msiteFoodTypes} from '@/service/getData2'
import '@/plugins/swiper.min.js'
import '@/style/swiper.min.css'
export default {
	name: 'Msite',
	components: {
		 HeadTop,
		 ShopList,
		 FooterNav,
	},
	data () {
		return {
			msiteTitle: '请选择地址...',
			foodTypes: [], // 食品分类列表
			geohash: '', // city页面传递过来的地址geohash
			hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
			imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
		}
	},
	methods: {

	},
	created () {
		
	},
	async beforeMount(){
		if (!this.$route.query.geohash) {
			// const address = await cityGuess()

			const address = await (axios.get('http://elm.cangdu.org/v1/cities/?type=guess'))
			this.geohash = address.latitude + ',' + address.longitude
			
		}else{
			this.geohash = this.$route.query.geohash
		}
		//保存geohash 到vuex
		this.$store.dispatch(Types.SAVE_GEOHASH, this.geohash)

    	if (this.geohash) {
    		//获取位置信息
	    	let data = await msiteAddress(this.geohash);
	    	this.msiteTitle = data.name
    		// 记录当前经度纬度
    		this.$store.dispatch(Types.RECORD_ADDRESS, data);
    	}
    	this.hasGetData = true;
    },
	mounted () {
		//获取导航食品类型列表
		msiteFoodTypes().then(res => {
			
			let foods = res
			let resLength = foods.length
			let resArr = [...foods]; // 返回一个新的数组
			let foodArr = [];
			for (let i = 0, j = 0; i < resLength; i += 8, j++) {
				foodArr[j] = resArr.splice(0, 8);
			}
			this.foodTypes = foodArr;
		}).then(() => {
			//初始化swiper
			new Swiper('.swiper-container', {
		    pagination: '.swiper-pagination',
		    loop: true
			});
		})

	}
}
</script>

<style lang="scss" scoped>
@import 'src/style/mixin';
.link-search{
	left: .8rem;
	@include wh(.9rem, .9rem);
	@include ct;
}

.msite-nav{
	padding-top: 2.1rem;
	background-color: #fff;
	border-bottom: 0.025rem solid $bc;
	height: 10.6rem;
	.swiper-container{
		@include wh(100%, auto);
		padding-bottom: 0.6rem;
		.swiper-pagination{
			bottom: 0.2rem;
		}
	}
	.fl-back{
		@include wh(100%, 100%);
	}
}
.food-types-container{
	display:flex;
	flex-wrap: wrap;
	.link-to-food{
		width: 25%;
		padding: 0.3rem 0rem;
		@include fj(center);
		img{
			margin-bottom: 0.3rem;
			@include wh(1.8rem, 1.8rem);
		}
		figcaption{
			text-align: center;
			@include sc(0.55rem, #666);
		}
	}

}
.shop-list-wrap{
	margin-top: .4rem;
	border-top: 0.025rem solid $bc;
	background-color: #fff;
	h4{
		margin-left: 0.6rem;
		vertical-align: middle;
		color: #999;
		@include font(0.55rem, 1.6rem);	
	}
}

</style>