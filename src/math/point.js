
class Point{
    constructor(x,y , color = ' red'){;
        this.x = x;
        this.y = y;
        this.color = color;
    }
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y,  6, 0 , Math.Pi * 2);
        ctx.fill();
    }
}