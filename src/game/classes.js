class Obstacle {
    constructor ({ positionX, height }) {
        this.positionX = positionX;
        this.centerY = Math.floor(200 + Math.random() * ((height-200) - 200));
        this.width = 75;
        this.speed = 150;
        this.gap = 200;
        this.scored = false;
        this.height = height;
    };

    draw(context) {
        context.fillStyle = 'green'; 
        context.fillRect(this.positionX, 0, this.width, this.centerY - this.gap/2);
        context.fillRect(this.positionX, this.centerY + this.gap/2, this.width, this.height - (this.centerY + this.gap/2));
    }

    update(context, deltaTime) {
        this.positionX -= this.speed * deltaTime;

        this.draw(context);
    }

    collision({ positionX, positionY, radius }) {
        const topRect = {
            x: this.positionX,
            y: 0,
            width: this.width,
            height: this.centerY - this.gap / 2
        };
    
        const bottomRect = {
            x: this.positionX,
            y: this.centerY + this.gap / 2,
            width: this.width,
            height: this.height - (this.centerY + this.gap / 2) 
        };
    
        const collidesWithTop = this.checkCircleRectCollision(positionX, positionY, radius, topRect);
        const collidesWithBottom = this.checkCircleRectCollision(positionX, positionY, radius, bottomRect);
    
        return collidesWithTop || collidesWithBottom;
    }
    
    checkCircleRectCollision(circleX, circleY, radius, rect) {
        const closestX = this.clamp(rect.x, rect.x + rect.width, circleX);
        const closestY = this.clamp(rect.y, rect.y + rect.height, circleY);
    
        const distanceX = circleX - closestX;
        const distanceY = circleY - closestY;
    
        return (distanceX * distanceX + distanceY * distanceY) < (radius * radius);
    }
    
    clamp(min, max, value) {
        return Math.max(min, Math.min(max, value));
    }
}

class Player {
    constructor({}) {
        this.velocityY = 0;
        this.radius = 25;
        this.positionX = 100;
        this.positionY = 200;
    }

    draw(context) {
        context.beginPath(); // Start a new path
        context.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2); // Draw a circle
        context.fillStyle = 'yellow'; // Set the fill color
        context.fill(); 
    }

    jump() {
        this.velocityY = -450
    }
    
    update(context, deltaTime) {
        this.velocityY += 1000 * deltaTime; 
    
        this.positionY += this.velocityY * deltaTime;
    
        if (this.velocityY > 2000) { 
            this.velocityY = 2000;
        }
    
        this.draw(context);
    }
}

export { Obstacle, Player };