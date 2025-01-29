let game = {
    ctx:null,
    block:[],
    rows:4,
    cols:8,
    sprites:{
        background:null,
        ball:null,
        block:null,
        platform:null,
    },
    init:function(){
        this.ctx = document.getElementById("my-game").getContext("2d")
    },
    create:function(){
        for(let row = 0; row<this.rows; row++){
            for(let col =0; col<this.cols; col++ ){
                this.blocks.push({})
            }
        }
    },
    preload:function(callback){
        let loaded = 0;
        let reqired = Object.keys(this.sprites).length
        let onloadImage = ()=>{
            ++loaded

            if(loaded>=reqired)
            {
                callback()
            }
        }

        for(let key in this.sprites)
        {
            this.sprites[key] = new Image()
            this.sprites[key].src = 'img/'+key +'.png'
            this.sprites[key].addEventListener("load",onloadImage)
        }
    },
    run:function(){
        window.requestAnimationFrame(()=>{
            this.render()
        })
    },
    render:function(){
        this.ctx.drawImage(this.sprites.background,0,0)
            this.ctx.drawImage(this.sprites.ball,0,0)
            this.ctx.drawImage(this.sprites.block,0,0)
            this.ctx.drawImage(this.sprites.platform,0,0)
    },
    start:function(){
        this.init()
        this.preload(()=>{
            this.run()
        })    
    }
}

window.addEventListener("load",()=>{
    game.start()
})