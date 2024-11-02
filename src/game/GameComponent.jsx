/**
 * @author Tyler Marois
 * @description The component that holds the game itself
 */
import React, { useState, useEffect, useRef } from 'react';
import { Obstacle, Player } from './classes';

function GameComponent() {
    const [gameTime, setGameTime] = useState(0);
    const [deltaTime, setDeltaTime] = useState(0);
    const previousTimeRef = useRef(0); 
    const animationRef = useRef(null);
    const canvasRef = useRef(null);
    const [obstacles, setObstacles] = useState([]);
    const [player, setPlayer] = useState(new Player({}));
    const [isRunning, setIsRunning] = useState(true);

    const[score, setScore] = useState(0);

    const [width, setWidth] = useState(window.innerWidth * 7/8);
    const [height, setHeight] = useState(window.innerHeight * 7/8);


    const gameInit = () => {

        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;

        //generate obstacles
        let previousObstacleX = 400;
        let initObstacles = []
        let spacing = 300;

        for (let index = 0; index < 100; index++) {
            initObstacles.push(new Obstacle({ positionX: previousObstacleX, height: height }));
            previousObstacleX += spacing;
        }
    
        setObstacles(initObstacles);
    }

    useEffect(() => {
        gameInit();

        const animate = (timestamp) => {
            if(!isRunning) {
                return;
            }

            if (previousTimeRef.current) {
                const delta = timestamp - previousTimeRef.current;
                setDeltaTime(delta/1000);
                setGameTime(prevTime => prevTime + delta);
            }
            
            previousTimeRef.current = timestamp;
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);

        const jump = (event) => {
            if(event.key === " ") {
                player.jump();
            }
        }
        
        window.addEventListener('keydown', jump);

        return () => {
            window.removeEventListener('keydown', jump);
            cancelAnimationFrame(animationRef.current);
        };

    }, []);

    useEffect(() => {
        if(isRunning) {
            tick();
        }
    }, [gameTime]);
    
    const tick = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        addPoint();
        checkHit();
        cullObjects();
        obstacles.forEach((obstacle) => obstacle.update(context, deltaTime));
        player.update(context, deltaTime);
    }

    const cullObjects = () => {
        if (obstacles.length > 0 && obstacles[0].positionX < -75) {
            const updatedObstacles = obstacles.filter(obstacle => obstacle.positionX >= 0 - obstacle.width/2);
            
            setObstacles(updatedObstacles);
        }
    }

    const addPoint = () => {
        let checkAhead = 10;
        if(obstacles.length < checkAhead) {
            checkAhead = obstacles.length;
        }

        for (let index = 0; index < checkAhead; index++) {
            const obstacle = obstacles[index];
            if(obstacle.positionX < 100 - obstacle.width/2 && !obstacle.scored) {
                obstacle.scored = true;
                setScore(score + 1);
            }
        }
    }

    const checkHit = () => {
        const closest = obstacles.filter((obstacle) => obstacle.positionX > 25 && obstacle.positionX <= 250);

        closest.forEach((obstacle) => {
            if (obstacle.collision(player)) {
                setIsRunning(false);
            }
        })
    }

    return (
        <>
            <div className='w-full h-[100vh] flex justify-center items-center bg-slate-700'>
                <h1 className='text-white text-5xl absolute top-20 right-1/2'>{score}</h1>

                <canvas ref={canvasRef} style={{ border: '1px solid black', background: "#2582c3" }}></canvas>
            </div>
        </>
    );
}

export default GameComponent;