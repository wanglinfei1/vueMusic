<template>
  <ul class="switches" v-if="switches.length">
    <li class="switch-item"
        v-for="(item,index) in switches"
        :class="{active: index===currentIndex}"
        @click="selectItem(item,index)"
        :key="item">
      <span>{{item}}</span>
    </li>
  </ul>
</template>

<script>
  export default{
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      selectItem(item, index) {
        this.$emit('select', item, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>
