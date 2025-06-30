"use client"

import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "@/config";
import Link from "next/link";
import { toast } from "sonner";
import { SigninSchmema, CreateUserSchema } from "@repo/common/types";
import { useRouter } from "next/navigation";

export function AuthPage({ isSignin }: { isSignin: boolean }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const router = useRouter();

    async function signInHandler(
        {
            email,
            password
        }: {
            email: string;
            password: string;
    }): Promise<void> {
        try {
            const parsedData = SigninSchmema.safeParse({ email, password });
            if (!parsedData.success) {
                toast.error("Invalid input format");
                return;
            }
        
            const res = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                email,
                password,
            });
        
            const token = res.data.token;
            if (!token) {
                toast.error("Internal server error, please try again");
                return;
            }
        
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
            toast.success("Sign in successful");

            router.push("/");
        
        } catch (error: any) {
            const message = error?.response?.data?.message || "An error occurred while signing in.";
            toast.error(message);
        }
    }  

    async function signUpHandler({
        email,
        name,
        password
    } : {
        email: string;
        name: string;
        password: string;
    }) : Promise<void> {
        try {
            const parsedData = CreateUserSchema.safeParse({ email, name, password });
            if(!parsedData.success) {
                toast.error("Invalid input format");
                return;
            }

            const res = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                name, email, password
            })
            
            const token = res.data.token;
            if(!token) {
                toast.error("Internal server error, please try again");
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
            toast.success("User created successfully");

            router.push("/");

        } catch (error: any) {
            const message = error?.response?.data?.message || "An error occurred while signing up.";
            toast.error(message);
        }
    }

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
                            className="m-2 ml-0 p-2 w-full text-gray-100"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {
                        !isSignin &&
                        <div className="w-1/2">
                            <Input 
                                type="text"
                                placeholder="Enter your name"
                                className="m-2 ml-0 p-2 w-full text-gray-100"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    }

                    <div className="w-1/2">
                        <Input 
                            type="password"
                            placeholder="Enter your password"
                            className="m-2 ml-0 p-2 w-full text-gray-100"
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
                                Does not have account? <Link className="text-blue-600" href={"/signup"}>Register here! </Link> 
                            </div> :
                            <div>
                                Already have an account? <Link className="text-blue-600" href={"/signin"}>Sign in here!</Link>
                            </div>
                        }

                    </div>
            </div>
        </>
    )
}