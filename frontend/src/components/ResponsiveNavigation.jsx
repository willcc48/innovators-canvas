import React, { useState } from 'react';
import { Link } from "@reach/router";
import Logo from '../logo.svg';

const ResponsiveNavigation = (props) => {
    const [ navOpen, setNavOpen ] = useState(0);
    const [ hoverIndex, setHoverIndex ] = useState(-1);
    const logo = Logo;
    const hoverBackground = '#ddd';
    const background = '#fff';
    const linkColor = '#777';

    var navLinks = [
        {
            text: 'Home',
            path: '/home',
            icon: 'ion-ios-home'
        },
        {
            text: 'My Canvas',
            path: '/canvas',
            icon: 'ion-ios-create'
        },
        {
            text: props.loggedIn ? 'Logout' : 'Login',
            path: props.loggedIn ? '/logout' : '/login',
            icon: props.loggedIn ? 'ion-ios-log-out' : 'ion-ios-log-in'
        }
    ]
    return (
        <nav
            className="responsive-toolbar"
            style={{ background: background, zIndex: 500}}>
            <ul
                style={{ background: background }}
                className={ navOpen ? 'active' : '' }
            >
                <figure className="image-logo" onClick={ () => { setNavOpen(!navOpen) } }>
                    <img src={ logo } height="40px" width="40px" alt="toolbar-logo" />
                </figure>
                { navLinks.map((link, index) => 
                    <li
                        key={ index }
                        onMouseEnter={ () => { setHoverIndex(index) } }
                        onMouseLeave={ () => { setHoverIndex(-1) } }
                        style={{ background: hoverIndex === index ? (hoverBackground || '#999') : '' }}
                    >
                        <Link
                            to={link.path}
                            style={{ color: linkColor }}
                        >   { link.text }
                            <i className={ link.icon } />
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default ResponsiveNavigation