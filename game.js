document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.body.addEventListener('wheel', function(e) {
    e.preventDefault();
}, { passive: false });

const KEYS = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
}

let game = {
    ctx: null,
    platform: null, 
    ball: null,
    blocks: [],
    rows: 8,
    cols: 10,
    totalScore:0,
    width:1920,
    height:1100,
    running:true,
    sprites: {
        background: null,
        ball: null,
        block: null,
        platform: null
    },

    create: function () 
    {
        for(let row = 0; row < this.rows; row++) 
        {
            for(let col = 0; col < this.cols; col++) 
            {
                this.blocks.push({
                    active: true,
                    width: 122,
                    height: 42,
                    x: 124 * col + 350,
                    y: 44 * row + 50
                })
            }
        }
    },

    init: function () 
    {
        this.ctx = document.getElementById("my-game").getContext("2d")
        this.setEvents()
        this.totalScore = this.rows * this.cols
    },

    setEvents: function () 
    {
        window.addEventListener("keydown", (event) => {
            if(event.keyCode == KEYS.SPACE) 
            {
                event.preventDefault()
                this.platform.fire()
            } else if(event.keyCode == KEYS.LEFT || event.keyCode == KEYS.RIGHT) 
            {
                this.platform.start(event.keyCode)
            }
        }),
            window.addEventListener("keyup", (event) => {
                if(event.keyCode == KEYS.LEFT || event.keyCode == KEYS.RIGHT) 
                {
                    this.platform.stop()
                }
            })
    },

    preload: function (callback) 
    {
        let loaded = 0;
        let requied = Object.keys(this.sprites).length
        let onloadImage = () => {
            ++loaded

            if(loaded >= requied) 
            {
                callback()
            }
        }

        for(let key in this.sprites) 
        {
            this.sprites[key] = new Image()
            this.sprites[key].src = "img/" + key + '.png'
            this.sprites[key].addEventListener("load", onloadImage)
        }
    },

    renderblocks: function () 
    {
        for(let block of this.blocks) 
        {
            if(block.active) 
            {
                this.ctx.drawImage(this.sprites.block, block.x, block.y)
            }
        }
    },
    render: function () 
    {
        this.ctx.clearRect(0, 0, 1920, 1100)
        this.ctx.drawImage(this.sprites.background, 0, 0)
        this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y)
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y)
        this.renderblocks()

    },
    update: function () 
    {
        this.collideBlock()
        this.collidePlatform()
        this.platform.collideWindow()
        this.ball.collideWindow()
        this.ball.move()
        this.platform.move()
    },
    collideBlock() 
    {
        for(let block of this.blocks) 
            {
            if(block.active && this.ball.collide(block)) 
                {
                this.ball.bumpBlock(block)
            }

        }
    },
    collidePlatform() 
    {
        if(this.ball.collide(this.platform)) 
            {
            this.ball.bumpPlatform(this.platform)
        }
    },
    run: function () 
    {
        window.requestAnimationFrame(() => {
            this.update()
            this.render()
            this.run()
        })
    },
    start: function () 
    {
        this.reset()
        this.init();
        this.preload(() => {
            this.create()
            this.run()
        });
        this.run();
    },
    random: function (min, max) 
    {
        return Math.floor(Math.random() * (max - min) + min)
    },
    reset: function () 
    {
        this.blocks = []
        this.totalScore = this.rows * this.cols

        this.platform.x = 700
        this.platform.y = 700
        this.platform.dx = 0

        this.ball.x = this.platform.x + (this.platform.width / 2) - (this.ball.width / 2)
        this.ball.y = this.platform.y - this.ball.height;

        this.ball.dx = 0
        this.ball.dy = 0

        this.platform.ball = this.ball;
    
        this.create();
        this.running = true;
    }
}

game.ball = {
    x: 850,
    y: 660,
    dy: 0,
    dx: 0,
    velocity: 3,
    width: 40,
    height: 40,
    start: function () 
    {
        this.dy = -this.velocity
        this.dx = game.random(-this.velocity, this.velocity)
    },
    move: function ()
    {
        if(this.dy) 
            {
            this.y = this.y + this.dy
        }

        if(this.dx) 
            {
            this.x = this.x + this.dx
        }

    },
    collideWindow() 
    {
        let x = this.x + this.dx
        let y = this.y + this.dy

        let ballLeft = x
        let ballRight = x + this.width
        let ballTop = y
        let ballBottom = y + this.height

        let windowLeft = 0
        let windowRight = 1920
        let windowTop = 0
        let windowBottom = 1200

        if(ballLeft < windowLeft) 
        {
            this.x = 0
            this.dx = this.velocity
        } else if(ballRight > windowRight) 
        {
            this.x = windowRight - this.width
            this.dx = -this.velocity
        } else if(ballTop < windowTop) 
        {
            this.y = 0
            this.dy = this.velocity
        } else if(ballBottom > windowBottom) 
        {
            game.running = false
            alert("GAME OVER")
            game.reset()
        }
    },
    collide(block) 
    {
        let x = this.x + this.dx
        let y = this.y + this.dy

        if(x + this.width > block.x &&
            x < block.x + block.width &&
            y + this.height > block.y &&
            y < block.y + block.height
        ) 
        {
            return true
        }

        return false
    },
    bumpBlock(block) 
    {
        this.dy *= -1
        block.active = false
        game.totalScore -=1
        if(game.totalScore == 0)
            {
            alert("win")
            window.location.reload()
        }
    },
    bumpPlatform(platform) 
    {
        this.dy = -this.velocity
        let touchX = this.x + this.width / 2;
        this.dx = this.velocity * platform.getTouchOffSet(touchX)
    }
},
    game.platform = {
        x: 700,
        y: 700,
        velocity: 6,
        dx: 0,
        width: 352,
        height: 42,
        ball: game.ball,
        fire: function () 
        {
            if(this.ball) 
            {
                this.ball.start();
                this.ball = null;
            }
        },
        getTouchOffSet(x) 
        {
            let diff = (this.x + this.width) - x;
            let offset = this.width - diff
            let result = 2 * offset / this.width
            return result - 1;
        },
        move: function () 
        {
            if(this.dx) 
                {
                this.x = this.x + this.dx
                
                if(this.ball) 
                    {
                    this.ball.x = this.ball.x + this.dx
                }

            }
        },
        start: function (direction) {
            if (direction == KEYS.LEFT) {
                this.dx = -this.velocity
            } else if (direction == KEYS.RIGHT) {
                this.dx = this.velocity
            }
        },
        stop: function () 
        {
            this.dx = 0
        },
        collideWindow() 
        {
            let x = this.x + this.dx

            let platformLeft = x
            let platformRight = platformLeft + this.width

            let windowLeft = 0
            let windowRight = 1920

            if(platformLeft < windowLeft || platformRight > windowRight) 
            {
                this.dx = 0
            }
        }
    }

window.addEventListener("load", () => {
    game.start()
})