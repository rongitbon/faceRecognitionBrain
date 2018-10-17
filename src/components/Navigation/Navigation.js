import React from 'react';

const Navigation = ({ onRouteChange, isSignendIn }) => {
	if (isSignendIn) {
		return (
			<nav style = {{display : 'flex' , justifyContent : 'flex-end'}}>
				<p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'> Sign out </p>
			</nav>
		);
	} else {
		return (
			<nav style = {{display : 'flex' , justifyContent : 'flex-end'}}>
				<p onClick={() => onRouteChange('home')} className='f3 link dim black underline pa3 pointer'> Sign in </p>
				<p onClick={() => onRouteChange('Register')} className='f3 link dim black underline pa3 pointer'> Register </p>
			</nav>
		);
	}
}

export default Navigation;