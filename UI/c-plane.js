// UI settings
// the most important line of code  in this project; 
//{  x: centerNodes.x + i * unitSize, y: centerNodes.y - j *unitSize }

// this c-plane UI only needs some tweeks but it will get there.

class Cplane{
    constructor(centerNodes, planeSize, unitSize, zIndex){

        this.centerNodes = centerNodes;
        this.planeSize = planeSize;
        this.unitSize = unitSize;
        this.zIndex = zIndex;

        //console.log( centerNodes + '** ' + planeSize + ' **' + unitSize)
    }

    Zratio(){
        return 1;
    }
    draw(ctx){

        ctx.save()
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(this.centerNodes.x ,this.centerNodes.y * 0);
        ctx.lineTo(this.centerNodes.x , this.centerNodes.y * 5)
        ctx.stroke()
    
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(this.centerNodes.x * 0 ,this.centerNodes.y);
        ctx.lineTo(this.centerNodes.x * 5,this.centerNodes.y);
        ctx.stroke()
    
        ctx.restore();
    
    
        for(let i = -this.planeSize ; i <= this.planeSize ; i++){
    
            ctx.save();
            ctx.beginPath()
            ctx.lineWidth = 5;
            ctx.moveTo(this.centerNodes.x+3, this.centerNodes.y - i * this.unitSize)
            ctx.lineTo(this.centerNodes.x-3, this.centerNodes.y - i * this.unitSize)
            ctx.stroke()
            ctx.restore();
    
            if(i % 5 == 0){
                ctx.save()
                ctx.beginPath()
                ctx.lineWidth = 1;
                ctx.moveTo(this.centerNodes.x+1000, this.centerNodes.y - i * this.unitSize)
                ctx.lineTo(this.centerNodes.x-1000, this.centerNodes.y - i * this.unitSize)
                ctx.stroke();
                ctx.restore()
            }

    
            //plane[i] = [];
            for(let j = -this.planeSize ; j <= this.planeSize ; j++){
    
                ctx.save()
                ctx.beginPath()
                ctx.lineWidth = 5;
                ctx.moveTo(this.centerNodes.x - j * this.unitSize, this.centerNodes.y+3)
                ctx.lineTo(this.centerNodes.x - j * this.unitSize, this.centerNodes.y-3)
                ctx.stroke();
                ctx.restore()
                
                if(j % 5 == 0 ){
                ctx.save()
                ctx.beginPath()
                ctx.lineWidth = 1 * 0.01; /// intepretation problem solved.
                ctx.moveTo(this.centerNodes.x - j * this.unitSize, this.centerNodes.y +1000);
                ctx.lineTo(this.centerNodes.x - j * this.unitSize, this.centerNodes.y -1000);
                ctx.stroke();
                ctx.restore()
                }
                //ctx.stroke();
                
                //plane[i][j] = { x: centerNodes.x + i * unitSize, y: centerNodes.y - j *unitSize }
            }
    
    
        }
    }
}