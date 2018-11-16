<template>
	<div>		
		<header>
			<img class="bg" :src="imgBaseUrl + shopDetail.image_path"/>
			<span @click="back" class="back"> < </span>
			<span class="detail-btn"> > </span>
			<div class="top">
				<img class="shop-img" :src="'http://localhost:8000/img/' + shopDetail.image_path"/>
				<section>
					<h3 class="shop-name">{{shopDetail.name}}</h3>
					<span class="shop-info">商家配送／{{shopDetail.order_lead_time}}分钟送达／配送费¥{{shopDetail.float_delivery_fee}}</span>
					<span>公告：{{notice}}</span>
				</section> 
			</div>
			<div class="discount">
				{{shopDetail.activities[0].description}}（APP专享）
				<span>{{shopDetail.activities.length}}个活动></span>
			</div>
		</header>
		<ul class="toggle">
			<router-link 
				class="nav-toggle"
				:class="{active_show: showType == 'food'}"
				to="/"
				tag="li"
				@click="toggle"
				>
				商品
			</router-link>
			<router-link 
				class="nav-toggle"
				:class="{active_show: showType == 'rating'}"
				to="/"
				tag="li"
				@click="toggle"
				>
				评价
			</router-link>
		</ul>

		<food-list 
			:shopId='$route.query.id' 
			v-show="showType == 'food'"
			@cartChange="cartChange"
			></food-list>
		


		<!-- 购物车 -->
		<section ref="cartWrap" class="buy-cart-container">
			<div class="gouwuche-wrap">
				<i class="iconfont icon-gouwuche"></i>
				<span v-show="cartNum">{{cartNum}}</span>
			</div>
			<div class="price-wrap">
				<span class="all-price">￥{{cartPrice.toFixed(2)}}</span><br/>
				<span class="">配送费¥{{shopDetail.float_delivery_fee}}</span>
			</div>
			<ul class="gouwuche-right">
				<li>还差￥{{shopDetail.float_minimum_order_amount}}起送</li>
				<router-link 
					to="/" 
					tag="li"
					class="cartBtn"
					>去结算</router-link>
			</ul>
		</section>

		<loading v-show="isLoading"></loading>
	</div>
</template>

<script>
import FoodList from './childcompoents/foodList'
import loading from '@/components/loading'
import * as Types from '@/store/mutation-types'
import {getImgPath} from '@/components/mixins'
import {imgBaseUrl} from '@/config/env'
import {shopDetails, currentcity} from '@/service/getData2'
import axios from 'axios'
export default {
	name: 'Shop',
	components: {
		FoodList,
		loading,
	},
	data () {
		return {
			shopDetail: {
				activities: [1,2]
			}, //店铺详情
			shopId: 1, //店铺ID		
			imgBaseUrl: 'http://localhost:8000/img/',
			showType: 'food',
			cartNum: 0, //购物车数量
			cartPrice: 0.0000, //购物车总价格
			isLoading: true,
		}
	},
	mixins: [getImgPath],
	computed: {
		notice () {
			return this.shopDetail.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'
		}
	},
	methods: {
		async initData () {
			if (this.$route.query.id) {
				this.shopDetail = await shopDetails(this.$route.query.id)
				this.shopId = this.$route.query.id
				this.isLoading = false
			}
			
		},
		toggle () {
			
		},
		back () {
			this.$router.go(-1)
		},
		cartChange () {
			//获取购物车信息
			let _this = this
			let cartWrap = this.$refs.cartWrap
			let gouwucheWrap = cartWrap.getElementsByClassName('gouwuche-wrap')[0]
			let gouwucheRight = cartWrap.getElementsByClassName('gouwuche-right')[0]
			
			setTimeout( () => {
				let cartList = JSON.parse(localStorage.getItem('cartList')) || {}
				
				let shopId = parseInt(_this.shopId)
				if (cartList[_this.shopId].length) {
					_this.cartNum = 0
					_this.cartPrice = 0
					cartList[_this.shopId].forEach((item, index, array) => {

						_this.cartNum += parseInt(item.num)
						_this.cartPrice += parseInt(item.price)
					})
					gouwucheWrap.style.backgroundColor = '#318fe6'
					gouwucheRight.getElementsByClassName('cartBtn')[0].style.display = 'block'
				} else {
					_this.cartNum = 0
					_this.cartPrice = 0
					gouwucheWrap.style.backgroundColor = '#3d3d3f'
					gouwucheRight.getElementsByClassName('cartBtn')[0].style.display = 'none'
				}		
			}, 200)
			
		}
	},
	created () {
		this.initData()
		
	},
	mounted () {
		this.cartChange()
	}
}
</script>

<style lang="scss" scoped>
@import '~@/style/mixin';
.bg {
	position: absolute;
	height: 100%;
	width: 100%;
	fliter: blur(10px);
	-webkit-filter: blur(10px);
	z-index: 1;
}
*:not(.bg) {
	position: relative;
	z-index: 2;
}
.back,
.detail-btn {
	position: fixed;
	z-index: 3;
	color: #FFF;
	left: 2%;
	top: .5%;
	@include font(1.6rem,1rem)
}
.detail-btn {
	left: 90%;
	top: 7%;
}
header {
	padding: 2%;
	color: #FFF;
	background: rgba(0,0,0,.3);
	@include font(.5rem, 1rem)
	.top {
		display: flex;
		width: 100%;
		padding-top: 3%;
		img {
			width: 2.9rem;
			height: 2.9rem;
			margin-right: .3rem;
		} 
		section {
			flex: auto;
			span {
				display: inline-block;
				padding: .1rem;
				color: #FFF;
			}
		}
	}
	.discount span {
		float: right;
	}
}
.toggle {
	display: flex;
    background-color: #fff;
    padding: .3rem 0 .6rem;
    border-bottom: 1px solid #ebebeb;
    li {
    	flex: 1;
   		font-size: 0.65rem;
	    color: #666;
	    padding: .2rem .1rem;
	    border-bottom: 0.12rem solid #fff;
	    text-align: center;
    }
    .active_show {
		color: #3190e8;
	    border-color: #3190e8;
	}	
}
.buy-cart-container {
	position: fixed;
    background-color: #3d3d3f;
    bottom: 0;
    left: 0;
    z-index: 13;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 2rem;
    color: #FFF;
    @include font(.7rem, 1rem)
    font-weight: bold;
   .gouwuche-wrap {
   	    display: flex;
	    background-color: #3d3d3f;
	    position: absolute;
	    padding: .4rem;
	    border: 0.18rem solid #444;
	    border-radius: 50%;
	    left: .5rem;
	    top: -.7rem;
	    i {
	    	font-size: 1.1rem;
	    	color: #FFF;
	    }
	    span {
	    	position: absolute;
	    	top: -10%;	
	    	right: -20%;
	    	font-size: .6rem;
	    	width: .8rem;
	    	height: .8rem;
	    	line-height: .8rem;
	    	text-align: center;
	    	background: red;
	    	color: #FFF;
	    	border-radius: 50%;
	    }
   }
   .price-wrap {
	   	position: absolute;
	   	top: 50%;
	   	-webkit-transform: translateY(-50%);
	   	-ms-transform: translateY(-50%);
	   	transform: translateY(-50%);
	   	left: 3.5rem;
	   	.all-price {
	   		@include font(.9rem, 1rem)
	   	}
   }
   .gouwuche-right {
   	    position: absolute;
	    right: 0;
	    background-color: #535356;
	    width: 5rem;
	    height: 100%;
	    text-align: center;
	    -webkit-box-align: center;
	    -webkit-align-items: center;
	    -ms-flex-align: center;
	    align-items: center;
	    -webkit-box-pack: center;
	    -webkit-justify-content: center;
	    -ms-flex-pack: center;
	    justify-content: center;
	    li {
	    	position: absolute;
	    	width: 100%;
	    	height: 100%;
	  		padding: .4rem .2rem 0 .2rem;
	  		text-align: center;
	    }
	    li:last-child {
	    	display: none;
	    	background: #4cd964;
	    }
   }
}
</style>