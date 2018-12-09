<template>
	<div>
		<head-top>
			<h4 class="logo" slot="logo">elm</h4>
		</head-top>

		<div class="city-nav">
			<div class="city-tip">
				<span>当前定位城市:</span>
				<span>定位不准时，请在城市列表中选择</span>
			</div>
		</div>

		<router-link :to="'/city/45'" class="current-city">
			{{currentCity}}
			<span class="arrow_right">
                  >  
            </span>
		</router-link>

		<div class="hotCitys">
			<h5>热门城市</h5>
			<ul>
				<router-link
					v-for="(city, index) of hotCitys"
					:key="index"
					:to="'/city/' + city.id"
					tag="li"
					>
					{{city.name}}
				</router-link>
				<div class="clearfix"></div>
			</ul>
		</div>

		<section class="group_city_container">
            <ul class="letter_classify">
                <li 
                	v-for="(value, key, index) in sortgroupcity" 
                	:key="key"  
                	class="letter_classify_li">
                    <h4 class="city_title">{{key}}
                        <span v-if="index == 0">（按字母排序）</span>
                    </h4>
                    <ul class="groupcity_name_container citylistul clear">
                        <router-link
                          tag="li" 
                          v-for="item in value" 
                          :to="'/city/' + item.id" 
                          :key="item.id" 
                          class="ellipsis">
                            {{item.name}}
                        </router-link>  
                    </ul>
                </li>
            </ul>
        </section>
	</div>
</template>

<script>
import HeadTop from '@/components/head/head'
import * as Types from '@/store/mutation-types'
import {hotcity, groupcity, cityGuess} from '@/service/getData2'
export default {
	name: 'Home',
	components: {
		 HeadTop,
	},
	data () {
		return {
			currentCity: '',
			hotCitys: [],
			allCitys: []
		}
	},
	methods: {
		getHotCitys () {
			hotcity().then((data)=>{
				this.hotCitys = data;
			})

		},
		getAllCity () {
			groupcity().then((data) => {
				this.allCitys = data
			})	
		},
		getCurrentCity () {
			cityGuess().then((data) => {
				this.currentCity = data.name
			})
		}
	},
	computed:{
        //将获取的数据按照A-Z字母开头排序
        sortgroupcity(){
            let sortobj = {};
            for (let i = 65; i <= 90; i++) {
                if (this.allCitys[String.fromCharCode(i)]) {
                    sortobj[String.fromCharCode(i)] = this.allCitys[String.fromCharCode(i)];
                }
            }
            return sortobj
        }
    },
	created () {
		this.getHotCitys()
		this.getAllCity()
		this.getCurrentCity()
	},
	mounted () {
	
	}
}
</script>

<style lang="scss" scoped>
@import '~@/style/mixin';

.city-nav {
	padding-top: 2.35rem;
	padding-bottom: .2rem;
	border-bottom: 1px solid #ccc;
	font-size: .5rem;
	background: #FFF;
	color: #999;
	// margin-bottom: 0.4rem;
	.city-tip {
		padding: .2rem;
	}
	.city-tip span:last-child {
		float: right;
		color: #9F9F9F;
		@include font(.6rem, 1rem);
	}
}

.current-city{
    @include fj;
    align-items: center;
    height: 1.8rem;
    padding: 0 0.45rem;
    border-top: 1px solid $bc;
    background: #FFF;
    border-bottom: 2px solid $bc;
    @include font(0.75rem, 1.8rem);
    .arrow_right{
    	@include font(1rem, 1rem)
    	color: #999;
    }
}

.hotCitys {
	background-color: #fff;
    margin-bottom: 0.4rem;
	h5 {
		color: #666;
	    font-weight: 400;
	    text-indent: 0.45rem;
	    padding: .1rem;
	    border-top: 2px solid #e4e4e4;
	    border-bottom: 1px solid #e4e4e4;
	    @include font(.4rem)
	}
	ul li {
		float: left;
	    text-align: center;
	    color: #3190e8;
	    background: #FFF;
	    border-bottom: 0.025rem solid $bc;
	    border-right: 0.025rem solid $bc;
	    width: 25%;
	    height: 1.75rem;
	    font: 0.6rem/1.75rem "Microsoft YaHei";
	}
}

.citylistul{
    li{
        float: left;
        text-align: center;
        color: $blue;
        border-bottom: 0.025rem solid $bc;
        border-right: 0.025rem solid $bc;
        @include wh(25%, 1.75rem);
        @include font(0.6rem, 1.75rem);
    }
    li:nth-of-type(4n){
        border-right: none;
    }
}
.city_title{
    color: #666;
    font-weight: 400;
    text-indent: 0.45rem;
    border-top: 2px solid $bc;
    border-bottom: 1px solid $bc;
    @include font(0.55rem, 1.45rem, "Helvetica Neue");
    span{
        @include sc(0.475rem, #999);
    }
}

.letter_classify_li{
    margin-bottom: 0.4rem;
    background-color: #fff;
    border-bottom: 1px solid $bc;
    .groupcity_name_container{
        li{
            color: #666;
        }
    }
}

</style>