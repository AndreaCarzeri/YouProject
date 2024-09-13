const request = require("supertest");
const app = require("../main"); // Imposta il percorso corretto
const User = require("../models/users");
const Manager = require("../models/managers");
const News = require("../models/news");
const Project = require("../models/projects");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let token = jwt.sign({ username: "prova123" }, "ABFC", { expiresIn: "1h" }); // Inserisci il tuo token valido qui

describe("API Testing", () => {
  let news_id;
  let username;
  let project_id;
  let user_id;
  let manager_id;
  prepareThings = async () => {
    const project = new Project({
      name: "Sample Project",
      description: "A brief description of the project",
      category: "Web Development",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      opensource: true,
    });
    const newUser = new User({
      username: "prova123",
      password: "prova123",
      email: "provaprovaprova@prova.com",
      name: "prova",
      surname: "prova",
      age: 25,
      phone: "123456789",
    });
    const manager = new Manager({
      project_id: project._id,
      user_id: newUser._id,
    });
    const news = new News({
      project_id: project._id,
      project_name: project.name,
      title: "Exciting News",
      description: "This is an exciting news article.",
      publish_date: "2024-01-27",
      author: newUser.username,
    });
    await newUser.save();
    await project.save();
    await manager.save();
    await news.save();
    news_id = news._id;
    username = newUser.username;
    project_id = project._id;
    user_id = newUser._id;
    manager_id = manager._id;
  };
 
  test("should add a like successfully", async () => {
    await prepareThings();
    const response = await request(app)
      .post("/api/add_or_remove_like")
      .set("token", token) // Modifica il nome dell'header qui
      .send({
        news_id: news_id,
        username: username,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Like added successfully");
  });

  test("should remove a like successfully", async () => {
    const response = await request(app)
      .post("/api/add_or_remove_like")
      .set("token", token) // Modifica il nome dell'header qui
      .send({
        news_id: news_id,
        username: username,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Like removed successfully"
    );
  });

  test("should add a comment successfully", async () => {
    const response = await request(app)
      .post("/api/add_comment_news")
      .set("token", token) // Modifica il nome dell'header qui
      .send({
        news_id: news_id,
        username: username,
        comment: "Great article!",
      });
    expect(response.statusCode).toBe(201);
  });

  test("should not able to add a comment successfully", async () => {
    const response = await request(app)
      .post("/api/add_comment_news")
      .set("token", token) // Modifica il nome dell'header qui
      .send({
        news_id: new mongoose.Types.ObjectId(),
        username: username,
        comment: "Great article!",
      });
    expect(response.statusCode).toBe(404);
  });

  test("should get all the news by a project successfully", async () => {
    const response = await request(app)
      .post("/api/get_news_by_proj")
      .set("token", token) // Modifica il nome dell'header qui
      .send({
        project_id: project_id,
      });
    expect(response.statusCode).toBe(200);
  });

  test("should delete a news successfully", async () => {
    // Definisci una nuova news

    // Effettua una richiesta POST per aggiungere la news
    const response = await request(app)
      .delete("/api/delete_news")
      .set("token", token) // Modifica il nome dell'header qui
      .send({
        news_id: news_id,
      });

    // Assert
    expect(response.statusCode).toBe(201);
    await Project.findByIdAndDelete(project_id);
    await User.findByIdAndDelete(user_id);
    await Manager.findByIdAndDelete(manager_id);
  });

  test("should not to delete a news", async () => {
    const response = await request(app)
      .delete("/api/delete_news")
      .set("token", token) // Modifica il nome dell'header qui
      .send({
        news_id: news_id,
      });

    // Assert
    expect(response.statusCode).toBe(404);
  });
});
