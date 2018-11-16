<template>
	<header id="head_top">
		<slot class="logo" name="logo">美团</slot>
		<slot name="head-title" class="head-title"></slot>
		<slot name="change-panel" class="panel">
            <router-link :to="userInfo? '/profile':'/login'">
                <svg class="user_avatar" v-if="userInfo">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
                </svg>
    			 登录|注册
            </router-link>
		</slot>
	</header>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    data(){
        return{

        }
    },
    mounted(){
        //获取用户信息
        this.getUserInfo();
    },
    // props: ['signinUp', 'headTitle', 'goBack'],
    computed: {
        ...mapState([
            'userInfo'
        ]),
    },
    methods: {
        ...mapActions([
            'getUserInfo'
        ]),
    },

}
</script>

<style lang="scss" scoped>
@import '~@/style/mixin';

#head_top{
    background-color: $blue;
    position: fixed;
  	display: flex;
    z-index: 100;
    left: 0;
    top: 0;
    padding: .4rem;
    color: #FFF;
    @include wh(100%, 1.95rem);
    @include font(.7rem, 1rem);
}
.head-title {
	flex: 4;
	color: #FFF;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 1rem;
}
.logo {
	color: #FFF;
    flex: 1;
}
.panel {
	color: #FFF;
    flex: 1;
}
.head_goback{
    left: 0.4rem;
    @include wh(0.6rem, 1rem);
    line-height: 2.2rem;
    margin-left: .4rem;
}
.head_login{
    right: 0.55rem;
    @include sc(0.65rem, #fff);
    @include ct;
    .login_span{
        color: #fff;
    }
    .user_avatar{
        fill: #fff;
        @include wh(.8rem, .8rem);
    }
}
.title_head{
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
    .title_text{
        @include sc(0.8rem, #fff);
        text-align: center;
        font-weight: bold;
    }
}
</style>