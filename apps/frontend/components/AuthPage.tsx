"use client"

import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "@/config";


function signInHandler(
    {
        email,
        password
    }:{
        email: string;
        password: string;
    }
) : void{
    if(!email || !password){
        alert("Please fill in all fields");
        return;
    }

    const res = axios.post(`${BACKEND_URL}/signin`, {
        email, password
    });

    console.log(res);
}   

function signUpHandler({
    email,
    name,
    password
} : {
    email: string;
    name: string;
    password: string;
}) : void {
    if(!email || !name || !password){
        alert("Please fill in all fields");
        return;
    }

    const res = axios.post(`${BACKEND_URL}/signup`, {
        email, name, password
    });

    console.log(res);
}

export function AuthPage({ isSignin }: { isSignin: boolean }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    return (
        <>
            <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-900">
                <div className="p-1 m-2 rounded ">
                    <div className="text-7xl font-bold text-center m-4">
                        {isSignin ? "Sign In" : "Sign Up"}
                    </div>
                </div>
                    <div className="w-1/2">
                        <Input 
                            type="text"
                            placeholder="Enter your email"
                            className="m-2 ml-0 p-2 w-full font-semibold text-gray-100"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {
                        !isSignin &&
                        <div className="w-1/2">
                            <Input 
                                type="text"
                                placeholder="Enter your name"
                                className="m-2 ml-0 p-2 w-full font-semibold text-gray-100"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    }

                    <div className="w-1/2">
                        <Input 
                            type="password"
                            placeholder="Enter your password"
                            className="m-2 ml-0 p-2 w-full font-semibold text-gray-100"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    
                    
                    <div className="pt-2 w-1/2">
                        <Button 
                            children={isSignin ? "Sign In" : "Sign Up"}
                            onClick={
                                isSignin ? () => signInHandler({email, password}) : () => signUpHandler({email, name, password})
                            }
                            className="m-2 ml-0 w-full cursor-pointer font-3xl bg-blue-600 hover:bg-blue-700 text-gray-100 p-2 rounded-lg font-semibold"
                        />
                    </div>

                    <div>
                        {
                            isSignin ?
                            <div className="text-gray-50">
                                Does not have account? Register here! 
                            </div> :
                            <div>
                                Already have an account? Sign in here!
                            </div>
                        }

                    </div>
            </div>
        </>
    )
}