<template>
	<div>
		<ul class="shopList-wrap">
			<router-link 
				:to="{path: '/shop', query: {geohash, id: item.id}}"
				tag="li"
				class="shop_li"
				v-for="(item, index) in shopListArr"
				:key="item.id"
			>
				<section>
					<img class="shop_img" :src="'http://localhost:8000/img/' + item.image_path"/>
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
						<rating-star :rating="item.rating"></rating-star>
						<span class="rating_count">{{item.rating}}</span>
						<span class="order_num">月售{{item.recent_order_num}}单</span>
						<section class="rating_order_num_right">
							<span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
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
	</div>
</template>

<script>
import {mapState} from 'vuex'
import RatingStar from '@/components/ratingStar'
import Loading from '@/components/loading'
import {imgBaseUrl} from '@/config/env'
import {shopList} from '@/service/getData2'
import {getImgPath} from '@/components/mixins'
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
		getImgPath
	],
	components: {
		RatingStar,
		Loading,
	},
	data () {
		return {
			offset: 0, //每次加载的个数
			shopListArr:[], // 店铺列表数据
			hasMore: false, //没有更多数据
			imgBaseUrl: '',
			showLoading: true
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
			this.showLoading = false;
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
				zhunStatus = false;
			}
			return zhunStatus
		},
	},
	mounted () {
		this.initData()
	}
}
</script>

<style lang="scss" scoped>
@import '~@/style/mixin';
.shopList-wrap{
	background-color: #fff;
	margin-bottom: 2rem;
}
.shop_li{
	display: flex;
	border-bottom: 0.025rem solid #f1f1f1;
	padding: 0.7rem 0.4rem;
	@include font(.5rem,1rem)

}
.shop_img{
	@include wh(2.7rem, 2.7rem);
	display: block;
	margin-right: 0.4rem;
}
.shop_right{
	flex: auto;
	.brand {
		background: yellow;
	}
	.shop-name {
		display: inline-block;
		padding: 0 .2rem;
		@include font(.7rem, 1rem);
		font-weight: 900;
	}
	& > section {
		display: flex;
		margin: .1rem 0;
	}
	.shop_supports {
		flex: auto;
		display: flex;
		justify-content: flex-end;
		li {
			color: #AAA;
		}
	}
	.rating_count {
		color: #FA0;
		@include font(.6rem, 1rem)
	}
	.order_num {
		display: inline-block;
		padding: 0 .3rem;
		@include font(.1rem, 1rem)
	}
	.rating_order_num_right {
		flex: auto;
		text-align: right;
		& span {
			border: 1px solid #00F;
			border-radius: 3px;
			@include font(.2rem, 1rem)
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
	
}
</style>