import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserSchema from "../models/User.js";

export const register = async (request, response) => {
  try {
    const password = request.body.password;
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserSchema({
      email: request.body.email,
      fullName: request.body.fullName,
      avatarUrl: request.body.avatarUrl,
      passwordHash,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    response.json({ ...user._doc, token });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      message: "Не удалось добавить пользователя",
    });
  }
};

export const login = async (request, response) => {
  try {
    const user = await UserSchema.findOne({ email: request.body.email });
    if (!user) {
      response.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      request.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return response.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    response.json({ ...user._doc, token });
  } catch (err) {
    response.status(500).json({ message: "Не удалось авторизоваться" });
  }
};

export const getMe = async (request, response) => {
  try {
    const user = await UserSchema.findById(request.userId);

    if (!user) {
      return response.status(404).json({
        message: "Пользователь не найден",
      });
    }

    response.json({ ...user._doc });
  } catch (err) {
    response.status(500).json({
      message: "Нет доступа",
    });
  }
};
