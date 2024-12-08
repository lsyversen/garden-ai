import React from "react";
import {Link} from "react-router-dom"
import{ Auth } from "../firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"
import { signOut } from 'firebase/auth'
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const [user] = useAuthState(Auth)
    const navigator = useNavigate()

    const logOut = async () => {
        await signOut(Auth)
        navigator("/")
    }
    return (
        <header>
            <div className="header flex items-center mb-4">
            <img src="/images/icon.png" alt="Plant Logo" className="w-12 h-12 object-cover rounded-full mr-4" />
            <h3>Better MI Gardens</h3>
            </div>
            <div className="menu">
            <Link className='link' to="/">Home</Link>
            <Link className='link' to="/history">History</Link>
            <Link className='link' to="/favorites">Favorites</Link>
            <Link className='link' to="/learn">Learn</Link>
            {user? <div className='link'><div className='d-flex'><img className='logo' src={user.photoURL} alt={user.displayName} />
            <button onClick={logOut}>Sign Out</button>
            </div>
            </div>
            : <Link className='link' to={"/login"}>Login</Link>
            }
            </div>
        </header>
    )
}

export default NavBar