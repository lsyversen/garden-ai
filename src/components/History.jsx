import React from "react";
import {Link} from "react-router-dom"
import{ Auth } from "../firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"
import { signOut } from 'firebase/auth'
import { useNavigate } from "react-router-dom";

const History = () => {
    const [user] = useAuthState(Auth)
    const navigator = useNavigate()

    return (
        <header>
            <div className="header flex items-center mb-4">
            <img src="/images/icon.png" alt="Plant Logo" className="w-12 h-12 object-cover rounded-full mr-4" />
            <h3>AI Garden</h3>
            </div>
        </header>
    )
}

export default History