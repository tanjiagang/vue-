/*
用百度地图API获取当前城市
*/
const getCurrentCity = function () {
  return new Promise(function (resolve, reject) {
    let myCity = new BMap.LocalCity()
    myCity.get(function (result) {
      resolve(result.name)
    })
  })
}

export default getCurrentCity