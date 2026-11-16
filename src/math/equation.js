class Equation {
    constructor(unitSize, centerNodes, planeSize, ruleFn = (x) => x**2 + x**3 + 6) {
        this.points = [];
        this.unitSize = unitSize;
        this.centerNodes = centerNodes;
        this.planeSize = planeSize;
        this.rule = ruleFn;
        this.color = "red";
    }

    plot() {
        let listPoints = [];
        let c = -this.planeSize;
        while (c <= this.planeSize) {
            let x = c * 0.2;
            let y = this.rule(x);
            listPoints.push({
                x: this.centerNodes.x + x * this.unitSize,
                y: this.centerNodes.y - y * this.unitSize
            });
            c++;
        }
        this.points = listPoints;
    }

    draw(ctx) {
        ctx.save();
        for (let p = 0; p < this.points.length; p++) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.arc(this.points[p].x, this.points[p].y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let s = 0; s < this.points.length - 1; s++) {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.points[s].x, this.points[s].y);
            ctx.lineTo(this.points[s + 1].x, this.points[s + 1].y);
            ctx.stroke();
        }
        ctx.restore();
    }
}
