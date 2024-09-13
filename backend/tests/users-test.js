const request = require("supertest");
const app = require("../main"); // Imposta il percorso corretto
const User = require("../models/users");
const Follower = require("../models/follower");
const Project = require("../models/projects");
const mongoose = require("mongoose");
let token; // Inserisci il tuo token valido qui

describe("API Testing", () => {
  test("should respond with a JWT token on successful login", async () => {
    const response = await request(app).post("/api/login_user").send({
      username: "UtenteProva2",
      password: "Password123!",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    token = response.body.token; // Salva il token per i test successivi
    console.log(token);
    // Puoi aggiungere ulteriori asserzioni in base alle tue esigenze
  });

  test("should handle invalid credentials", async () => {
    const response = await request(app).post("/api/login_user").send({
      username: "nonexistentuser",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Nome utente non trovato");
    // Puoi aggiungere ulteriori asserzioni in base alle tue esigenze
  });

  test("should handle invalid password during user addition", async () => {
    // Definisci un nuovo utente con una password non valida
    const userWithInvalidPassword = {
      username: "InvalidUser",
      name: "Jane",
      surname: "Doe",
      age: 30,
      phone: "987654321",
      email: "invaliduser@example.com",
      password: "WeakPwd", // Password non valida
    };

    // Effettua una richiesta POST con la password non valida
    const response = await request(app)
      .post("/api/add_user")
      .send(userWithInvalidPassword);

    // Assicurati che la risposta abbia uno stato 500 (errore interno del server)
    // poiché la password non è valida
    expect(response.status).toBe(400);

    // Verifica che la risposta contenga un messaggio di errore appropriato
    expect(response.body).toHaveProperty("message", "password is not valid");
    expect(response.body).toHaveProperty("type", "danger");
  });

  test("should remove a user successfully", async () => {
    // Crea un utente per il test
    const newUser = new User({
      username: "TestUserToRemove",
      name: "John",
      surname: "Doe",
      age: 25,
      phone: "123456789",
      email: "testuser@example.com",
      password: "SecurePwd123!",
    });

    // Salva l'utente nel database
    await newUser.save();

    // Effettua una richiesta DELETE per rimuovere l'utente appena creato
    const response = await request(app)
      .delete("/api/remove_user")
      .set("token", token) // Modifica il nome dell'header qui
      .send({ id: newUser._id });

    // Assicurati che la risposta abbia uno stato 201 (creato con successo)
    expect(response.status).toBe(201);

    // Verifica che la risposta contenga un messaggio di successo
    expect(response.body).toHaveProperty(
      "message",
      "User Removed Successfully"
    );
  });

  test("should handle user not found during removal", async () => {
    // Crea un ID non esistente per il test
    const nonExistingUserId = "nonexistentid";

    // Effettua una richiesta DELETE per rimuovere un utente inesistente
    const response = await request(app)
      .delete("/api/remove_user")
      .set("token", token) // Modifica il nome dell'header qui
      .send({ id: nonExistingUserId });

    // Assicurati che la risposta abbia uno stato 404 (non trovato)
    expect(response.status).toBe(400);

    // Verifica che la risposta contenga un messaggio di errore appropriato
    expect(response.body).toHaveProperty("message", "Invalid ID");
  });

  test("should get all users successfully", async () => {
    // Effettua una richiesta GET per ottenere tutti gli utenti
    const response = await request(app).get("/api/get_all_users");

    // Assicurati che la risposta abbia uno stato 200 (successo)
    expect(response.status).toBe(200);

    // Verifica che la risposta contenga un array di utenti
    expect(response.body).toBeInstanceOf(Array);
  });

  let u_id;
  let p_id;

  test("should follow a project successfully", async () => {
    const user = new User({
      username: "TestUserToRemove",
      name: "John",
      surname: "Doe",
      age: 25,
      phone: "123456789",
      email: "prova123provaprova@gmail.com",
      password: "SecurePwd123!",
    });
    const newProject = new Project({
      name: "Sample Project",
      description: "A brief description of the project",
      category: "Web Development",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      opensource: true,
    });
    u_id = user._id;
    p_id = newProject._id;
    await user.save();
    await newProject.save();
    const response = await request(app)
      .post("/api/follow_project")
      .set("token", token) // Modifica il nome dell'header qui
      .send({ user_id: u_id, project_id: p_id });

    // Assicurati che la risposta abbia uno stato 200 (successo)
    expect(response.status).toBe(201);
  });

  test("should unfollow a project successfully", async () => {
    const response = await request(app)
      .delete("/api/unfollow_project")
      .set("token", token) // Modifica il nome dell'header qui
      .send({ user_id: u_id, project_id: p_id });

    // Assicurati che la risposta abbia uno stato 200 (successo)
    expect(response.status).toBe(201);
    await Follower.deleteOne({ user_id: u_id, project_id: p_id });
    await User.deleteOne({ username: "TestUserToRemove" });
    await Project.deleteOne({ name: "Sample Project" });
  });

  test("should fail to follow a project", async () => {
    const response = await request(app)
      .post("/api/follow_project")
      .set("token", token) // Modifica il nome dell'header qui
      .send({ user_id: new mongoose.Types.ObjectId(), project_id: p_id });

    // Assicurati che la risposta abbia uno stato 200 (successo)
    expect(response.status).toBe(401);
  });

  test("should fail to unfollow a project", async () => {
    const response = await request(app)
      .delete("/api/unfollow_project")
      .set("token", token) // Modifica il nome dell'header qui
      .send({ user_id: new mongoose.Types.ObjectId(), project_id: p_id });

    // Assicurati che la risposta abbia uno stato 200 (successo)
    expect(response.status).toBe(404);
  });

  test("should get all followed projects successfully", async () => {
    const response = await request(app)
      .post("/api/get_followed_projects")
      .set("token", token) // Modifica il nome dell'header qui
      .send({ user_id: u_id });

    // Assicurati che la risposta abbia uno stato 200 (successo)
    expect(response.status).toBe(200);
  });

  

});
