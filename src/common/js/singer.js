/**
 * Created by wanglinfei on 2017/8/9.
 */
export default class Singer {
  constructor({name, id}) {
    this.name = name
    this.id = id
    this.imgUrl = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
  }
}
