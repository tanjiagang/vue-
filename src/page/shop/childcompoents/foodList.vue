<template>
	<div class="menu-wrap" ref="test">
		<ul class="menu-left">
			<li 
				v-for="(item, index) in foodMenu"
				:key="index"
				>
				<img v-if="item.icon_url" :src="getImagePath(item.icon_url)"/>
				{{item.name}}
			</li>
		</ul>

		<ul class="menu-right">
			<li
				v-for="(item, index) in foodMenu"
			>
				<header >
					<span>{{item.name}}</span>
					{{item.description}}
				</header>
				<router-link
					v-for="(foodItem, index) in item.foods"
					to="/"
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
							:food-name="foodItem.name"
							:item-id="foodItem.item_id"
							:image-url="imgBaseUrl + foodItem.image_path"
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
import {getImagePath} from '@/config/mUtil'
export default {
	name: 'foodList',
	data () {
		return {
			foodMenu: [],
			imgBaseUrl: 'http://localhost:8000/img/',
			shopNum: 1, //
		}
	},
	props: ['shopId'],
	methods: {
		async initData () {
			this.foodMenu = await foodMenu(this.shopId)
			
		},
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
			let cartList = JSON.parse(window.localStorage.getItem('cartList')) || {}
			if (!cartList[this.shopId]) {
				cartList[this.shopId] = []	
			}
			
			let current =  _this || window.event.target
			let parent = current.parentNode
			let jian = parent.getElementsByClassName('jian')[0]
			let shopNum = parent.getElementsByClassName('shop-num')[0]
			let num = parseInt(shopNum.innerText)

			//本地存储购物车
			let price = parent.getAttribute('price')
			let foodName = parent.getAttribute('food-name')
			let itemId = parent.getAttribute('item-id')
			let imageUrl = parent.getAttribute('image-url')

			if (_this) {
				//初始化购物车数据
				cartList[this.shopId].forEach(item => {
					if(item.itemId == itemId){
						shopNum.innerText = item.num
						jian.classList.add('show-li')
						shopNum.classList.add('show-li')
					}
				})
				return
			}

			jian.classList.add('show-li')
			shopNum.classList.add('show-li')
			shopNum.innerText = ++num


			if (num > 1)  {
				//购买数量增加
				cartList[this.shopId].forEach(item => {
					if(item.itemId == itemId){
						item.num = num
					}
				})
			} else {
				//新增加食物
				let food = {
					"itemId": itemId,
					"foodName": foodName,
					"price": price,
					"num": num,
					"image_url": imageUrl
				}
				cartList[this.shopId].push(food)
			}
			window.localStorage.setItem('cartList', JSON.stringify(cartList))

			//更新父组件的购物车
			this.$emit('cartChange')
		},
		//从购物车减去
		jianBuy (e) {
			let cartList = JSON.parse(window.localStorage.getItem('cartList'))
			e = window.event || e
			let current = e.target
			let parent = current.parentNode
			let shopNum = parent.getElementsByClassName('shop-num')[0]
			let itemId = parent.getAttribute('item-id')
			let num = parseInt(shopNum.innerText)
			if (num <= 1) {
				current.classList.remove('show-li')
				shopNum.classList.remove('show-li')
			}
			shopNum.innerText = --num;	
			

			if (num < 1)  {
				//在购物车中移除食品
				cartList[this.shopId].forEach((item, index, array) => {
					if(item.itemId == itemId)
						cartList[this.shopId].splice(index, 1)
				})
			} else {
				//减少数量
				cartList[this.shopId].forEach((item, index, array) => {
					if(item.itemId == itemId)
						item.num = num						
				})
			}
			//本地存储
			window.localStorage.setItem('cartList', JSON.stringify(cartList))
			//更新父组件的购物车
			this.$emit('cartChange')
		}
	},
	mounted () {
		this.initData()
		var _this = this
		setTimeout( () =>{
			this.$refs.buyBtn.forEach((item, index, array)=>{
				_this.jiaBuy(this.$refs.buyBtn[index])
			})
			// console.log(Array.isArray(this.$refs.buyBtn))
		}, 200)
	}
}
</script>

<style lang="scss" scoped>
@import '~@/style/mixin';
.menu-wrap {
	display: flex;
	.menu-left {
		background: #FFF;
		li{
			padding: .7rem .3rem;
			color: #333;
		    border-bottom: 0.025rem solid #ededed;
		    box-sizing: border-box;
		    border-left: 0.15rem solid #f8f8f8;
		    position: relative;
		    @include font(.8rem, 1rem)
		    img {
			    width: 0.5rem;
	    		height: 0.6rem;
		    }
		}
		.activity_li {
			border-left: 0.15rem solid #3190e8;
    		background-color: #fff;
		}
	}

	.menu-right {
		flex: 4;
		header {
			padding: .8rem;
			color: #AAA;
			@include font(.6rem);
			span {
				color: #666;
				@include font(.8rem)
			}
		}
		section {
			display: flex;
			background: #FFF;
			padding: .3rem;
			@include font(.6rem,1rem)
			h4 {
				@include font(.8rem,1rem)
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
					background: #00F;
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