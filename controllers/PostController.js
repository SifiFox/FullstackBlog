import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const update = async (req, res) => {
  const postId = req.params.id;

  const findOnePostFilter = {
    _id: postId,
  };
  try {
    await PostModel.updateOne(findOnePostFilter, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось изменить статью",
    });
  }
};

export const remove = async (req, res) => {
  const postId = req.params.id;
  const findOnePostFilter = {
    _id: postId,
  };

  try {
    PostModel.findOneAndDelete(findOnePostFilter)
      .then((doc) => {
        if (doc === null) {
          return res.status(404).json({
            message: "Не удалось найти статью",
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        return res.json({
          message: "Не удалось удалить статью",
        });
      });
  } catch (error) {
    return res.json({
      message: "Что-то пошло не так",
    });
  }
};

export const getOne = async (req, res) => {
  const postId = req.params.id;

  const findOnePostFilter = {
    _id: postId,
  };

  const findOnePostUpdate = {
    $inc: { viewsCount: 1 },
  };

  const findOnePostCondition = {
    returnDocument: "after",
  };

  try {
    PostModel.findOneAndUpdate(
      findOnePostFilter,
      findOnePostUpdate,
      findOnePostCondition
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).json({
          message: "Статья не найдена",
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const create = async (req, res) => {
  try {
    console.log(req.body);

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка добавления статьи",
    });
  }
};
