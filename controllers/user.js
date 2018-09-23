const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");
module.exports = {
    async login(req, res) {
        const { email, password } = req.body;
		const error = {};

		try {
			const user = await User.login(email, password);
			if (!user) {
				error.message = "El email ingresado no existe";
				return res.status(401).send(error);
			} 	
			
			if (!user.logged) {
				error.message = "La contraseña es incorrecta";
				return res.status(401).send(error);
			}
			
			user.token = jwt.sign(user, config.secret);
			return res.status(200).send(user);			
		} catch (error) {
			error.message = "Ocurrio un error, revisar los detalles";
			error.details = err;
			return res.status(503).send(error);
		}
	},
	async validToken(req, res) {
		const { token } = req.body;
		try {
			const decoded = jwt.verify(token, config.secret);
			console.log(decoded)
			return res.json(decoded);
		} catch (error) {
			return res.sendStatus(401);
		}
	},
	async updateFirebaseToken(req, res) {
		const { user: {_id} } = req.headers;
		try {
			const user = await User.findById(_id).exec();
			user.firebaseToken = req.body.firebaseToken;
			await user.save();
			res.sendStatus(200);				
		} catch (error) {
			res.sendStatus(500);
		}
	},
    async create(req,res) {
		try {
			const data = req.body;
	
			if (!Object.keys(data).length) {
				const error = {};
				error.message = "Debe indicar los nombres, apellidos y email del usuario. Intentelo de nuevo";
				return res.status(503).send(error);
			}
			delete data.isVerified;
	
			await User.create(data);
			delete data.password;
			data.token = jwt.sign(data, config.secret);
			return res.json(data);			
		} catch (error) {
			error.message = "No se pudo crear el usuario, intentelo de nuevo"
			return res.status(503).send(error);
		}
	}
}