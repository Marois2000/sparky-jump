/**
 * @author Tyler Marois
 * @description The home page of the game
 */
import React from "react";
import logo from "../assets/sparky-jump.svg";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigator = useNavigate()

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-slate-700">
            <div className="flex flex-col h-1/2 justify-between items-center">
                <img src={logo} alt="" />
                <button onClick={() => navigator("/game")} className="bg-[#e7ff2e] text-5xl p-5 w-1/4 text-[#20ffe9] font-bold border-2 border-[#20ffe9]">Play!</button>
            </div>
        </div>
    )
}

export default Home;