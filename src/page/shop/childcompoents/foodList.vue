<template>
	<div class="menu-wrap" ref="test">
		<ul class="menu-left">
			<li 
				@click="scrollMenu"
				v-for="(item, index) in foodMenu"
				:key="index"
				:data-index="index"
				:id="item.id.toString()"
				:class="{activity_li: mIndex == index }"
				>
				<img v-if="item.icon_url" :src="getImagePath(item.icon_url)"/>
				{{item.name}}
				<span 
					class="category_num" 
					></span>
			</li>
		</ul>

		<ul class="menu-right">
			<li
				class="menu-right-item"
				v-for="(item, index) in foodMenu"
				:data-index="index"
			>
				<header >
					<span>{{item.name}}</span>
					{{item.description}}
				</header>
				<router-link
					v-for="(foodItem, index) in item.foods"
					:to="{path: 'shop/foodDetail', 
						query:{image_path:foodItem.image_path, description: foodItem.description, 
						month_sales: foodItem.month_sales, name: foodItem.name, rating: foodItem.rating, 
						rating_count: foodItem.rating_count, satisfy_rate: foodItem.satisfy_rate, foodItem, shopId}}"
					tag="section"
					:key="index"
				>
					<img class="food-img" :src="imgBaseUrl + foodItem.image_path"/>
					<div class="food-text">
						<h4>{{foodItem.name}}</h4>
						<p>{{foodItem.description}}</p>
						<p>月销{{foodItem.month_sales}} 好评率{{foodItem.satisfy_rate}}%</p>
						<p class="price">￥{{foodItem.specfoods[0].price}}起</p>
						<ul  
							class="buy-btn" 
							:price="foodItem.specfoods[0].price"
							:name="foodItem.name"
							:item_id="foodItem.item_id"
							:image-url="imgBaseUrl + foodItem.image_path"
							:category_id="item.id"
							:food_id="foodItem.specfoods[0].food_id"
							:specs="JSON.stringify(foodItem.specfoods[0].specs)"
							>
							<li @click.stop="jianBuy()" class="jian">-</li>
							<li class="shop-num">0</li>
							<li ref="buyBtn" @click.stop="jiaBuy()" class="jia">+</li>
						</ul>
					</div>
				</router-link>
			</li>
		</ul>


	</div>
</template>

<script>
import {foodMenu} from '@/service/getData2'
import {getImagePath, getStore, setStore, animate, log} from '@/config/mUtil'
import {mapState, mapMutations} from 'vuex'
export default {
	name: 'foodList',
	props: ['shopId'],
	data () {
		return {
			foodMenu: [],
			imgBaseUrl: '//elm.cangdu.org/img/',
			shopNum: 1, //
			menuActive: false,
			mIndex: 0, //左侧菜单选中项
		}
	},
	props: ['shopId'],
	computed: {
		...mapState([
			'latitude','longitude','cartList'		
		])
	},
	watch: {
		cartList () {
			setTimeout(()=>{
				if (Object.values(this.cartList).length) {
					Object.values(this.cartList).forEach(shop => {
						if(!shop) return
						
	                    Object.values(shop).forEach(categoryItem =>{
	                    	var num = 0
	                    	var menuLeftItem = document.getElementById(categoryItem['category_id'])
	                    	// log(menuLeftItem)
	                    	// return
	                    	Object.values(categoryItem).forEach(itemValue=> {
		                        Object.values(itemValue).forEach(item => {
		                        	if(!item || isNaN(item.num)) return
		                        	num += item.num
		                        })
		                        var category_num = menuLeftItem.getElementsByClassName('category_num')[0]
		                        if(num > 0){
		                        	category_num.style.opacity = 1
		                        	category_num.innerText = num
		                        } else {
		                        	category_num.style.opacity = 0
		                        }
		                    })
	                    })
	                })
				}
			}, 200)
		}
	},
	methods: {
		...mapMutations([
			'RECORD_ADDRESS',
			'ADD_CART',
			'REDUCE_CART',
			'INIT_BUYCART',
			'CLEAR_CART',
			'RECORD_SHOPDETAIL',
			'INIT_cartList'
		]),
		async initData () {
			this.foodMenu = await foodMenu(this.shopId)
			if(!this.foodMenu.length){
				this.foodMenu = 
		[{
		"name": "优惠",
		"description": "美味又实惠, 大家快来抢!",
		"id": 3210,
		"restaurant_id": 3269,
		"foods": [{
			"_id": "5bfd1f39d51a913e8655d962",
			"tips": "673评价 月售540份",
			"item_id": 1627,
			"category_id": 3210,
			"restaurant_id": 3269,
			"activity": {
				"image_text_color": "f1884f",
				"icon_color": "f07373",
				"image_text": "肯德基买一什么都不送！！！！"
			},
			"image_path": "16754c1ee2d22822.jpg",
			"name": "肯德基",
			"__v": 0,
			"specfoods": [{
				"specs_name": "默认",
				"name": "肯德基",
				"item_id": 1627,
				"sku_id": 5814,
				"food_id": 5814,
				"restaurant_id": 3269,
				"_id": "5bfd1f39d51a913e8655d963",
				"specs": [],
				"stock": 1000,
				"checkout_mode": 1,
				"is_essential": false,
				"recent_popularity": 251,
				"sold_out": false,
				"price": 20,
				"promotion_stock": -1,
				"recent_rating": 1,
				"packing_fee": 0,
				"pinyin_name": "",
				"original_price": 0
			}],
			"satisfy_rate": 19,
			"satisfy_count": 666,
			"attributes": [{
				"icon_color": "5ec452",
				"icon_name": "新"
			}, {
				"icon_color": "f07373",
				"icon_name": "招牌"
			}],
			"is_essential": false,
			"server_utc": "2018-11-26T14:59:19.853Z",
			"specifications": [],
			"rating_count": 673,
			"month_sales": 540,
			"description": "肯德基豪华套餐",
			"attrs": [],
			"display_times": [],
			"pinyin_name": "",
			"is_featured": 0,
			"rating": 4.6
			}],
		"type": 1,
		"icon_url": "4735c4342691749b8e1a531149a46117jpeg",
		"is_selected": true,
		"__v": 1
		}]


			}
		},
		//处理图片
		getImagePath (path) {
			let suffix;
			if (!path) {
				return '//elm.cangdu.org/img/default.jpg'
			}
			if (path.indexOf('jpeg') !== -1) {
				suffix = '.jpeg'
			} else {
				suffix = '.png'
			}
			let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
			return 'https://fuss10.elemecdn.com' + url
		},
		//加入购物车
		jiaBuy (_this, e) {
			let cartList = JSON.parse(getStore('cartList')) //获取本地购物车数据
			var e = arguments[0] || window.event
			let current =  _this || e.target
			let parent = current.parentNode
			let jian = parent.getElementsByClassName('jian')[0]
			let shopNum = parent.getElementsByClassName('shop-num')[0]
			let num = parseInt(shopNum.innerText)

			/*
			*本地存储购物车数据
			*/

			//获取存储在元素属性上的接口数据
			let price = parent.getAttribute('price')
			let name = parent.getAttribute('name')
			let item_id = parent.getAttribute('item_id')
			let imageUrl = parent.getAttribute('image-url')
			let category_id=parent.getAttribute('category_id')
			let food_id=parent.getAttribute('food_id')
			let specs=parent.getAttribute('specs')

			if (_this) {
				//初始化购物车数据
				let shop = cartList[this.shopId]
				if (shop) {

					let category = shop[category_id]
					if (category) {
						let item = category[item_id]
						if (item) {
							let food = item[food_id]
							if (food.num !== 0) {
								shopNum.innerText = food.num
								jian.classList.add('show-li')
								shopNum.classList.add('show-li')	
							}
						}
					}
				}
				return
			}

			jian.classList.add('show-li')
			shopNum.classList.add('show-li')
			shopNum.innerText = ++num

			//加入vuex中的购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
            this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
            //更新父组件购物车
            this.$emit('cartChange')
		},
		//从购物车减去
		jianBuy (e) {
			let cartList = JSON.parse(getStore('cartList'))
			e = window.event || e
			let current = e.target
			let parent = current.parentNode
			let shopNum = parent.getElementsByClassName('shop-num')[0]
			let item_id = parent.getAttribute('item_id')
			let num = parseInt(shopNum.innerText)
			let name=parent.getAttribute('name')
			let price=parent.getAttribute('price')
			let category_id=parent.getAttribute('category_id')
			let food_id=parent.getAttribute('food_id')
			let specs=parent.getAttribute('specs')

			if (num <= 1) {
				current.classList.remove('show-li')
				shopNum.classList.remove('show-li')
			}
			shopNum.innerText = --num;	
			
			//移出vuex中的购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
			this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs})
			//更新父组件购物车
            this.$emit('cartChange')
		},
		//滑动菜单
		scrollMenu (e) {
			var e = arguments[0] || window.event
			let index = e.target.getAttribute('data-index')
			this.mIndex = index
			let menuRight = document.getElementsByClassName('menu-right')[0]
			let menuRightItem = document.getElementsByClassName('menu-right-item')[index]
			animate(menuRight, {scrollTop: menuRightItem.offsetTop})
		}
	},
	mounted () {
		this.initData()
		this.INIT_cartList()
		var _this = this
		this.$nextTick( ()=>{
			setTimeout(()=>{
				if(!Array.isArray(this.$refs.buyBtn)) return
				this.$refs.buyBtn.forEach((item, index, array)=>{
					_this.jiaBuy(this.$refs.buyBtn[index])
				})	
			},200)
		})
	}
}
</script>

<style lang="scss" scoped>
@import '~@/style/mixin';
.menu-wrap {
	display: flex;

	.menu-left {
		flex: 1;
		width: 30%;
		background: #FFF;
		li{
			padding: .7rem .3rem;
			font-size: 13px;
			font-weight: bold;
			color: #666;
		    border-bottom: 0.025rem solid #ededed;
		    box-sizing: border-box;
		    border-left: 0.15rem solid #f8f8f8;
		    position: relative;
		    word-wrap: berak-word;
		    background: #f7f4f4;
		    img {
			    width: 0.5rem;
	    		height: 0.6rem;
		    }
		}
		li:hover {
			border-left: 0.15rem solid #3190e8;
    		background-color: #fff;
		}
		.activity_li {
			border-left: 0.15rem solid #3190e8;
    		background-color: #fff;
		}
		.category_num{
	        position: absolute;
	        opacity: 0;
	        top: .1rem;
	        right: .1rem;
	        background-color: #ff461d;
	        line-height: .6rem;
	        text-align: center;
	        border-radius: 50%;
	        border: 0.025rem solid #ff461d;
	        min-width: .6rem;
	        height: .6rem;
	        @include sc(.5rem, #fff);
	        font-family: Helvetica Neue,Tahoma,Arial;
        }
	}

	.menu-right {
		flex: 4;
		width: 70%;
		height: 72vh;
		overflow-x: hidden;
		overflow-y: auto;
		position: relative;
		header {
			padding: .5rem;
			color: #AAA;
			background: #f5f5f5;
			@include font(.4rem);
			span {
				color: #000;
				font-weight: 900;
				@include font(.8rem)
			}
		}
		section {
			display: flex;
			background: #FFF;
			padding: .3rem;
			@include font(.4rem,1rem)

			h4 {
				font-weight: 900;
				color: #000;
				font-family: '黑体';
				@include font(.7rem,1rem)
			}
			p:nth-of-type(2) {
				
				font-weight: bold;
			}
			.food-text {
				width: 100%;
			}
			img {
				width: 2rem;
    			height: 2rem;
    			margin-right: .5rem;
			}
			.price {
				font-size: 0.7rem;
			    color: #f60;
			    font-weight: bold;
			    margin-right: .3rem;
			}
			.buy-btn {
				display: flex;
				float: right;
				li {
					font-size: .8rem;
					opacity: 0;
					transition: margin 1s, opacity 1s;
				}
				li:last-child, li:first-child {
					width: .8rem;
					height: .8rem;
					text-align: center;
					line-height: .8rem;
					background: #318fe6;
					color: #FFF;
					cursor: pointer;
					border-radius: 50%;
				}
				li:last-child {
					opacity: 1;
				}
				.show-li {
					margin-right: .8rem;
					opacity: 1;
				}
			}
		}
	}
}
</style>