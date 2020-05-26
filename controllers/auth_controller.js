/**
 * Auth Controller
 */


const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {matchedData, validationResult} = require('express-validator')


/**
 * Get access-token and a refresh-token from username and password
 */
const login = async (req, res) => {

    const user = await User.login(req.body.username, req.body.password)

    if(!user) {
        res.status(401).send({
            status: 'fail',
            data: 'Authentication required'
        })
        return
    }

    // construct jwt payload
	const payload = {
		data: {
			id: user.get('id'),
			username: user.get('username'),
		},
	};

    // sign payload and get access tooken
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h'})

    // sign payload and get refresh-token
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w'})

    res.send({
        status: 'success',
        data: {
            access_token,
            refresh_token
        }
    })
}


/**
 * Get a new access-token using a refresh token
 */
const refresh = (req, res) => {
    const token = getTokenFromHeaders(req)
    if(!token) {
        res.status(401).send({
            status: 'fail',
            data: 'No token found in request headers'
        })
        return;
    }

    try{
        // verify token using the refresh token secret
        const {data} = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        // contruct new payload
        const payload = {
            data
        }

        // issue a new token using the access token secret
        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: proccess.env.ACCESS_TOKEN_LIFETIME || '1h'})

        // sign payload and get refresh-token
	    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w' });

        // send the access-token to the client
        res.send({
            status: 'success',
            data: {
                access_token,
                refresh_token
            }
        })
    } catch(error) {
        res.status(403).send({
            status: 'fail',
            data: 'Invalid token'
        })
        return;
    }
}

/**
 * Register an account
 * 
 * POST /register
 */

const register = async (req, res) => {
    const errors = validationResult(req)
	if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
		})
		return;
	}
    
	const validData = matchedData(req)

	// Generate a hash of 'validData.password'
	try {
		validData.password = await bcrypt.hash(validData.password, User.hashSaltRounds);
	}
	catch(error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when trying to hash'
		})
		throw error
	}


	try{
		await User.forge(validData).save();
		res.status(201).send({
			status: 'success',
			data: null
		});
	}
	catch(error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user'
		})
		throw error
	}

}






/**
 * Get token from http headers
 */

const getTokenFromHeaders = (req, ) => {
    		// Check that we have authorization header
		if(!req.headers.authorization) {
			return false;
		}
	
		// Split auth header in to it's pieces
		const [authType, token] = req.headers.authorization.split(' ')
		
		// check that auth type is bearer
		if(authType.toLowerCase() !== 'bearer') {
			return false;
        }
        
        return token;
} 

module.exports = {
    getTokenFromHeaders,
    login,
    refresh,
    register
}