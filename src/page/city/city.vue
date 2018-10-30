<template>
	<div>
		<head-top go-back="true">
			<h5 @click.stop='back' class="back" slot="logo"><</h5>
			<router-link 
			slot="change-panel" 
			class="panel"
			to="/home" 
			>
				切换城市
			</router-link>
		</head-top>

		<form class="city-form" @submit.prevent>
            <div>
                <input type="search" name="city" placeholder="输入学校、商务楼、地址" class="city-input input-style" required v-model='inputVaule'>
            </div>
            <div>
                <input type="submit" name="submit" class="city-submit input-style" @click='submit' value="提交">
            </div>
        </form>

        <header v-if="searchHistory.length" class="pois-search-history">搜索历史</header>

        <ul class="getSearch-ul">
            <li v-for="(item, index) in searchList" @click='nextpage(index, item.geohash)' :key="index">
                <h4 class="pois-name ellipsis">{{item.name}}</h4>
                <p class="pois-address ellipsis">{{item.address}}</p>
            </li>
        </ul>

        <footer 
        	v-if="searchHistory&&searchList.length" 
        	class="clear-all-history" 
        	@click="clearAll">
	        清空所有
    	</footer>
        <div class="search-none-place" v-if="searchNone">很抱歉！无搜索结果</div>
	</div>
</template>

<script>
import HeadTop from '@/components/head/head'
import {getStore, setStore, removeStore} from '@/config/mUtil'
import axios from 'axios'
export default {
	name: 'City',
	components: {
		HeadTop
	},
	data () {
		return {
			inputVaule: '',//搜素值
			searchHistory: [], //搜素历史城市列表
			searchList: [], //搜索城市列表
			searchNone: false,
		}
	},
	methods: {
		back () {
			this.$router.go(-1)
		},
		async submit () {
			if (!this.inputVaule) return
			this.searchList = (await axios.get('http://elm.cangdu.org/v1/pois?type=search&city_id=45&keyword=' + this.inputVaule)).data
			this.searchNone = searchList.length ? false : true
		},
		/**
         * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
         * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
         */
        nextpage(index, geohash){
            let history = getStore('searchHistory');
            let city = this.searchList[index];
            if (history) {
                let checkrepeat = false;
                this.searchHistory = JSON.parse(history);
                this.searchHistory.forEach(item => {
                    if (item.geohash == geohash) {
                        checkrepeat = true;
                    }
                })
                if (!checkrepeat) {
                    this.searchHistory.push(city)
                }
            }else {
                this.searchHistory.push(city)
            }
            setStore('searchHistory',this.searchHistory)
            this.$router.push({path:'/msite', query:{geohash}})
        },
        clearAll(){
            removeStore('searchHistory');
            this.initData();
        }
	},
	mounted () {
		
	}
}
</script>

<style lang="scss" scoped>
@import '~@/style/mixin';
.back {
	color: #FFF;
	@include font(1rem, 1rem)
}
.city-container{
    padding-top: 2.35rem;
}
.change-city{
    right: 0.4rem;
    @include sc(0.6rem, #fff);
    @include ct;
}
.city-form{
    background-color: #fff;
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    padding-top: 3rem;
    div{
        width: 90%;
        margin: 0 auto;
        text-align: center;
        .input-style{
            border-radius: 0.1rem;
            margin-bottom: 0.4rem;
            @include wh(100%, 1.4rem);
        }
        .city-input{
            border: 1px solid $bc;
            padding: 0 0.3rem;
            @include sc(0.65rem, #333);
        }
        .city-submit{
            background-color: $blue;
            @include sc(0.65rem, #fff);
        }
    }
}
.pois-search-history{
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    padding-left: 0.5rem;
    @include font(0.475rem, 0.8rem);
}
.getSearch-ul{
    background-color: #fff;
    border-top: 1px solid $bc;
    li{
        margin: 0 auto;
        padding-top: 0.65rem;
        border-bottom: 1px solid $bc;
        .pois-name{
            margin: 0 auto 0.35rem;
            width: 90%;
           @include sc(0.65rem, #333);
        }
        .pois-address{
            width: 90%;
            margin: 0 auto 0.55rem;
            @include sc(0.45rem, #999);
        }
    }
}
.search-none-place{
    margin: 0 auto;
    @include font(0.65rem, 1.75rem);
    color: #333;
    background-color: #fff;
    text-indent: 0.5rem;
}
.clear-all-history{
    @include sc(0.7rem, #666);
    text-align: center;
    line-height: 2rem;
    background-color: #fff;
}
</style>