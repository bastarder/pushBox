(function(){
  const ROADTYPE  = 0   // 道路
  const WALLTYPE  = 1   // 障碍
  const BOXTYPE   = 2   // 箱子
  const ENDTYPE   = 3   // 终点
  const HEROTYPE  = 4   // 人物
  const FINISHTYPE = 5  // 完成
  const MOVEMENT  = [[-1,0], [1,0], [0,-1], [0,1]] // 上下左右

  let Block = function(opt = {}){
    this.$x = opt.x
    this.$y = opt.y
    this.$originType = opt.type
    this.$currentType = opt.type
    this.$set = function(type){
      this.$currentType = type
      if(this.$originType === ENDTYPE && type === ROADTYPE){
        this.$currentType = this.$originType
      }
    }
    this.$getHTML = function(){
      let type = this.$currentType
      if(this.$currentType === BOXTYPE && this.$originType === ENDTYPE){
        type = FINISHTYPE
      }
      return `<div class="block type-${type}"></div>`
    }
  }

  let Game = function(opt = {}){
    this.$stage = document.getElementById('game')
    this.$endList = []
    this.$map = []
    this.$opt = opt
    this.init()
  }

  Game.prototype = {
    init: function(){
      this.reset()
      for(let x = 0; x < this.$map.length; x++){
        for(let y = 0; y < this.$map[x].length; y++){
          let type = this.$map[x][y]
          this.$map[x][y] = new Block({type, x, y})
          type === ENDTYPE && this.$endList.push(this.$map[x][y])
          type === HEROTYPE && (this.$hero = this.$map[x][y])
        }
      }
      this.render()
      document.addEventListener('keydown', (event) => {
        let direction = [38,40,37,39].indexOf(event.keyCode)
        direction >= 0 && this.move(direction)
      })
    },

    render: function(){
      let mapHtml = ""
      for(let x = 0; x < this.$map.length; x++){
        for(let y = 0; y < this.$map[x].length; y++){
          mapHtml += this.$map[x][y].$getHTML()
        }
        mapHtml += "<br>"
      }
      this.$stage.innerHTML = mapHtml
      let isFinish = this.$endList.filter(
        (block) => !(block.$currentType === BOXTYPE && block.$originType === ENDTYPE)
      )
      if(!isFinish.length){
        setTimeout(() => alert('You win!'), 100)
        setTimeout(() => this.init(), 3000)
      }
    },

    move: function(direction){
      let $direction = MOVEMENT[direction]
      let next = this.nextBlock(this.$hero, $direction)
      if(!next || next.$currentType == WALLTYPE){
        return ;
      }
      if(next.$currentType === ROADTYPE || next.$currentType === ENDTYPE){
        this.$hero.$set(ROADTYPE)
        next.$set(HEROTYPE)
        this.$hero = next
        this.render()
        return ;
      }
      let afterNext = this.nextBlock(next, $direction)
      if(!afterNext || afterNext.$currentType == WALLTYPE || afterNext.$currentType == BOXTYPE){
        return ;
      }
      if(afterNext.$currentType === ROADTYPE || afterNext.$currentType === ENDTYPE){
        this.$hero.$set(ROADTYPE)
        next.$set(HEROTYPE)
        this.$hero = next
        afterNext.$set(BOXTYPE)
        this.render()
        return ;
      }
    },

    nextBlock: function(block, direction){
      let x = block.$x + direction[0]
      let y = block.$y + direction[1]
      return this.$map[x] && this.$map[x][y]
    },

    reset: function(){
      this.$map = this.$opt.data || [
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,3,1,1,1,1,1],
        [1,1,1,1,0,1,1,1,1,1],
        [1,1,1,1,2,0,2,3,1,1],
        [1,1,3,0,2,4,1,1,1,1],
        [1,1,1,1,1,2,1,1,1,1],
        [1,1,1,1,1,0,1,1,1,1],
        [1,1,1,1,1,3,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
      ]
    }
  }

  let game = new Game();

})();



