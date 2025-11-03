const User = require("../models/user");
const Rol = require("../models/rol");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await User.getAll();
      console.log(`USERS: ${data}`);
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al obtener los usuarios......",
      });
    }
  },

  async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const user = await User.findUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "El email no existe",
        });
      }

      if (User.passwordMatch(password, user.password)) {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          keys.secretOrKey,
          {
            expiresIn: 3600, // 1 hora
          }
        );

        const data = {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          image: user.image,
          session_token: `JWT ${token}`,
          roles: user.roles
        };
        console.log('usuario enviado', `${data}`);

        return res.status(201).json({
          success: true,
          data: data,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Password incorrecto",
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al iniciar sesion...",
      });
    }
  },

  async createUser(req, res, next) {
    try {
      const user = req.body;
      const data = await User.createUser(user);

      await Rol.create(data.id,1); // Asignar rol por defecto "1" al usuario creado 

      return res.status(201).json({
        success: true,
        message: "El usuario se almaceno correctamente, ahora inicie sesión",
        data: data.id,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al crear el usuario......",
      });
    }
  },
};
