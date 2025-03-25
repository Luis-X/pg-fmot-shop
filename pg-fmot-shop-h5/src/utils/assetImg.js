export default {
  assetImgWithName
};

function assetImgWithName(imgName) {
  const url = 'https://b2cprdcne2yennefersa01.blob.core.chinacloudapi.cn/shenghuojiacontainer/static/newscenter/'
  const sign = '?sig=JmD0umBVx5lkaq1RyDw6oAHhFkEEKnwndr7yN%2F%2BWz5I%3D&st=2023-12-12T02%3A09%3A57Z&se=2123-12-12T02%3A09%3A57Z&sv=2019-02-02&sp=r&sr=c'
  const result = `${url}${imgName}${sign}`
  // console.log(result)
  return result
}