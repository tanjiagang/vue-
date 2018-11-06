import fetch from '@/config/fetch'
axios.defaults.baseURL = 'http://localhost:1337'
axios.interceptors.response.use((res) => {
	return res.data //在这里统一拦截结果
})
import axios from 'axios'


/*
*获取当前城市
*/

export const getCurrentCity = () => {
	return axios.get('v1/cities/?type=current')
}


/*
*根据cityId获取城市
*/

export const getCity = (cityId) => {
	return axios.get('v1/cities/?type=getCity&cityId=' + cityId)
}

/*
*获取热门城市列表
*/

export const getHotCity = () => {
	return axios.get('v1/cities/?type=hot')
}


/*
*获取所有城市列表
*/

export const getAllCity = () => {
	return axios.get('v1/cities/?type=all')
}

 

