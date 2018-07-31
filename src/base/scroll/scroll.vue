<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  export default{
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullUp: {
        type: Boolean,
        default: false
      },
      pullDown: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted () {
      let _this = this
      setTimeout(function () {
        _this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {
          let _this = this
          this.scroll.on('scroll', function (pos) {
            _this.$emit('scroll', pos)
          })
        }
        if (this.pullUp) {
          let _this = this
          this.scroll.on('scrollEnd', function () {
            if (_this.scroll.y <= (_this.scroll.maxScrollY + 50)) {
              _this.$emit('scrollToEnd')
            }
          })
        }
        if (this.pullDown) {
          let _this = this
          this.scroll.on('scrollEnd', function () {
            if (_this.scroll.y >= 0) {
              _this.$emit('scrollDownEnd', _this.scroll.y)
            }
          })
        }
        if (this.beforeScroll) {
          let _this = this
          this.scroll.on('beforeScrollStart', function () {
            _this.$emit('beforeScroll', _this.scroll.y)
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {
        let _this = this
        setTimeout(function () {
          _this.refresh()
        }, _this.refreshDelay)
      }
    }
  }
</script>
<style>

</style>
