import WireTop from "../assets/wireTop.png";
import WireBottom from "../assets/wireBottom.png";
import BackgroundImage from "../assets/background.jpg";
import Character from "../assets/character_sheet.png";
import Sparks from "../assets/sparks.png";

class Obstacle {
    constructor ({ positionX, height }) {
        this.positionX = positionX;
        this.centerY = Math.floor(200 + Math.random() * ((height-200) - 200));
        this.width = 75;
        this.speed = 150;
        this.gap = 200;
        this.scored = false;
        this.height = height;

        this.top = new Image();
        this.top.src = WireTop;

        this.bottom = new Image();
        this.bottom.src = WireBottom;

    };

    draw(context) {
        context.drawImage(this.top, this.positionX, 0, this.width, this.centerY - this.gap/2);
        context.drawImage(this.bottom, this.positionX, this.centerY + this.gap/2, this.width, this.height - (this.centerY + this.gap/2));
    }

    update(context, deltaTime) {
        this.positionX -= this.speed * deltaTime;

        this.draw(context);
    }

    collision({ positionX, positionY, radius }) {
        const topRect = {
            x: this.positionX+12,
            y: 0,
            width: this.width,
            height: this.centerY - this.gap / 2
        };
    
        const bottomRect = {
            x: this.positionX,
            y: this.centerY + this.gap / 2,
            width: this.width-12,
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
        this.radius = 32;
        this.positionX = 100;
        this.positionY = 200;

        this.character = new Image();
        this.character.src = Character;

        this.character.onload = () => {
            this.height = 512;
            this.width = 4096 / 8
        }

        this.sparks = new Image();
        this.sparks.src = Sparks;

        this.sparks.onload = () => {
            this.height = 1028;
            this.width = 4112 / 4
        }

        this.frame = 0;
        this.framesElapsed = 0;

        this.angle = Math.PI / 4;
    }

    draw(context) {
        const minTilt = -Math.PI / 4; 
        const maxTilt = Math.PI / 4;  

        const minSpeed = -1000; 
        const maxSpeed = 1000;  

        const ang = ((this.velocityY - minSpeed) / (maxSpeed - minSpeed)) * (maxTilt - minTilt) + minTilt;

        this.angle = Math.max(minTilt, Math.min(maxTilt, ang));

        const rotationX = this.positionX; 
        const rotationY = this.positionY; 

        context.save();
        context.translate(rotationX, rotationY);
        context.rotate(this.angle);

        context.drawImage(
            this.character,                      
            (this.frame % 8) * 512, 0, 512, 512, 
            -this.radius, -this.radius,          
            this.radius * 2, this.radius * 2     
        );

        context.drawImage(
            this.sparks,                      
            (this.frame % 4) * 1028, 0, 1028, 1028, 
            -this.radius*2, -this.radius*2,          
            this.radius * 4, this.radius * 4    
        );

        context.restore()
    }

    jump() {
        this.velocityY = -450
    }
    
    update(context, deltaTime) {
        this.framesElapsed++;

        if(this.framesElapsed % 24 === 0) {
            this.frame++;
            

        }

        this.velocityY += 1000 * deltaTime; 
    
        this.positionY += this.velocityY * deltaTime;
    
        if (this.velocityY > 2000) { 
            this.velocityY = 2000;
        }
    
        this.draw(context);
    }
}

class Background {
    constructor({ positionX, width, height }) {
        this.positionX = positionX;
        this.width = width;
        this.height = height;
        this.speed = 25;

        this.image = new Image();
        this.image.src = BackgroundImage;
    }

    update(context, deltaTime) {
        this.positionX -= this.speed * deltaTime;

        if(this.positionX <= 0 - this.width + 1) {
            this.positionX = this.width - 1;
        }

        this.draw(context)
    }

    draw(context) {
        context.drawImage(this.image, this.positionX, 0, this.width, this.height);
    }
}

export { Obstacle, Player, Background };