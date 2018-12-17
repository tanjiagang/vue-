<template>
	<div ref="shopListWrap">
		<ul   class="shopList-wrap" >
			<router-link 
				:to="{path: '/shop', query: {geohash, id: item.id}}"
				tag="li"
				class="shop_li"
				v-for="(item, index) in shopListArr"
				:key="item.id"
			>
				<section>
					<img class="shop_img" :src="'//elm.cangdu.org/img/' + item.image_path"/>
				</section>

				<section class="shop_right">
					<section>
						<span class="brand" v-if="item.is_premium">品牌</span>
						<span class="shop-name">{{item.name}}</span>
						<ul class="shop_supports">
							<li v-for="item in item.supports" :key="item.id" class="supports">{{item.icon_name}}</li>
						</ul>
					</section>

					<section>
						<rate :value="item.rating"></rate>						
						<span class="rating_count">{{item.rating}}</span>
						<span class="order_num">月售{{item.recent_order_num}}单</span>
						<section class="rating_order_num_right">
							<span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
						</section>
					</section>

					<section>
						<span class="float_minimum_order_amount">
							￥{{item.float_minimum_order_amount}}起送/
						</span>
						<span class="tips">{{item.piecewise_agent_fee.tips}}</span>
						<section class="distance">
							<span v-if="Number(item.distance)">{{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}}
							</span>
							<span>{{item.distance}}</span>
							<span class="order_time">/{{item.order_lead_time}}</span>
						</section>
					</section>
				</section>

			</router-link>
		</ul>
		<transition name="loading">
			<loading v-show="showLoading"></loading>
		</transition>
		<transition name="loading">
			<spin v-show="isMore"></spin>
		</transition>
		<div style="text-align: center;" v-show="touchend">没有更多了</div>
		<back-top></back-top>
	</div>
</template>

<script>
import {mapState} from 'vuex'
import RatingStar from '@/components/ratingStar'
import Rate from '@/components/rate'
import Spin from '@/components/spin'
import BackTop from '@/components/backTop'
import Loading from '@/components/loading'
import {imgBaseUrl} from '@/config/env'
import {shopList} from '@/service/getData2'
import {getImgPath, loadMore} from '@/components/mixins'
export default {
	name: 'ShopList',
	props: [
		'restaurantCategoryId', 
		'restaurantCategoryIds', 
		'sortByType', 
		'deliveryMode', 
		'supportIds', 
		'confirmSelect', 
		'geohash'
	],
	mixins: [
		getImgPath,
		loadMore
	],
	components: {
		RatingStar,
		Loading,
		Rate,//评分组件
		Spin,//加载组件
		BackTop,//回到顶部
	},
	data () {
		return {
			offset: 0, //每次加载的个数
			shopListArr:[], // 店铺列表数据
			hasMore: false, //没有更多数据
			preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
			imgBaseUrl: '',
			showLoading: true,
			touchend: false, //是否有更多
			isMore: false, //加载更多
		}
	},
	computed: {
		...mapState([
			'latitude', 'longitude'
		])
	},
	methods: {
		async initData () {
			//获取数据
			let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId)
			this.shopListArr = [...res]
			this.showLoading = false
			if (res.length < 20) {
				this.hasMore = true
			}
		},
		zhunshi (supports) {
			let zhunStatus;
			if ((supports instanceof Array) && supports.length) {
 				supports.forEach(item => {
 					if (item.icon_name === '准') {
 						zhunStatus = true;
 					}
 				})
			}else{
				zhunStatus = false
			}
			return zhunStatus
		},
		//到达底部加载更多数据
		async loaderMore(){
			if (this.touchend) {
				return
			}
			//防止重复请求
			if (this.preventRepeatReuqest) {
				return
			}
			this.isMore = true;
			this.preventRepeatReuqest = true;

			//数据的定位加20位
			this.offset += 5;
			let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
			this.isMore = false
			this.shopListArr = [...this.shopListArr, ...res];
			//当获取数据小于20，说明没有更多数据，不需要再次请求数据
			if (res.length < 5) {
				this.touchend = true;
				return
			}
			this.preventRepeatReuqest = false;
		},
	},
	mounted () {
		this.initData()
		let shopListWrap = this.$refs.shopListWrap
		window.addEventListener('scroll',  ()=>{
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
			if(scrollTop + window.screen.height >= shopListWrap.offsetHeight + shopListWrap.offsetTop){
				this.loaderMore()
			}
			
		}, {passive: true})
	}
}
</script>

<style lang="scss" scoped>
@import '~@/style/mixin';
.shopList-wrap{
	background-color: #fff;
}
.shop_li{
	display: flex;
	border-bottom: 0.025rem solid #f1f1f1;
	padding: 0.7rem 0.4rem;
	@include font(.6rem,1rem);
}
.shop_img{
	@include wh(2.7rem, 2.7rem);
	display: block;
	margin-right: 0.6rem;
}
.shop_right{
	flex: auto;
	& > section {
		display: flex;
		margin-bottom: .2rem;
	}
	.brand {
		background: yellow;
		font-weight: 900;
		@include font(0.4rem, 1rem);		
	}
	.shop-name {
		display: inline-block;
		padding: 0 .2rem;
		@include font(.6rem, 1rem);
		font-weight: 900;
	}

	.shop_supports {
		flex: auto;
		display: flex;
		justify-content: flex-end;
		li {
			color: #AAA;
			@include font(.4rem, 1rem)
		}
	}
	.rating_count {
		color: #FA0;
		@include font(.6rem, 1rem)
	}
	.order_num {
		display: inline-block;
		padding: 0 .3rem;
		@include font(.4rem, 1rem)
	}
	.rating_order_num_right {
		flex: auto;
		text-align: right;
		& span {
			padding: 3px;
			border-radius: 3px;
			background: #12addc;
			color: #FFF;
			@include font(.4rem, 1rem)

		}
	}
	.distance {
		flex: auto;
		text-align: right;
		.order_time {
			color: #30F;
		}
		.float_minimum_order_amount {

		}
	}
	section:nth-of-type(3) {
		color: #999;
		@include font(0.4rem,1rem)
	}
}
.ivu-rate {
	font-size: 13px;
}
.ivu-rate-star {
    margin-right: 2px;
}

</style>