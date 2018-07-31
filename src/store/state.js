/**
 * Created by wanglinfei on 2017/8/10.
 */
import {palyMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {},
  play: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: palyMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchesHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}
export default state
