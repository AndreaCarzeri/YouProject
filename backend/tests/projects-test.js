const request = require('supertest');
const app = require('../main'); // Assicurati di impostare il percorso corretto per il tuo file principale dell'API
const Project = require('../models/projects');
const Manager = require('../models/managers');
const User = require('../models/users');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
let newProjectId;  // Inserisci l'ID del progetto creato qui
describe('API Testing', () => {
  let userID;

  test('should get project by ID successfully', async () => {
    // Crea un progetto per il test
    const newProject = new Project({
      name: 'Sample Project',
      description: 'A brief description of the project',
      category: 'Web Development',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      opensource: true,
    });
    newProjectId = newProject._id;  // Salva l'ID del progetto per i test successivi
    const newUser = new User({
      username: "TestUserToRemove",
      name: "John",
      surname: "Doe",
      age: 25,
      phone: "123456789",
      email: "testuser@example.com",
      password: "SecurePwd123!",
    });
    userID = newUser._id;
    const newManager = new Manager({
        project_id: newProjectId,
        user_id: newUser._id,
      });

    // Salva il progetto nel database
    await newProject.save();
    await newManager.save();
    await newUser.save();


    // Effettua una richiesta POST per ottenere il progetto per ID
    const response = await request(app)
      .post('/api/get_proj_by_id')
      .send({ project_id: newProject._id });

    // Assicurati che la risposta abbia uno stato 200 (successo)
    expect(response.status).toBe(200);

    // Verifica che la risposta contenga un messaggio di successo
    expect(response.body).toHaveProperty('message', 'Project found!');
    
    // Verifica che la risposta contenga i dettagli del progetto
    expect(response.body).toHaveProperty('project');
    expect(response.body.project).toHaveProperty('_id', newProject._id.toString());
    expect(response.body.project).toHaveProperty('name', 'Sample Project');
    expect(response.body.project).toHaveProperty('description', 'A brief description of the project');
    expect(response.body.project).toHaveProperty('category', 'Web Development');
    expect(response.body.project).toHaveProperty('start_date', '2024-01-01T00:00:00.000Z');
    expect(response.body.project).toHaveProperty('end_date', '2024-12-31T00:00:00.000Z');
    expect(response.body.project).toHaveProperty('opensource', true);
  });

  test('should handle non-existent project during retrieval', async () => {
    // Crea un ID non esistente per il test
    const nonExistingProjectId = 'nonexistentid';

    // Effettua una richiesta POST per ottenere un progetto inesistente
    const response = await request(app)
      .post('/api/get_proj_by_id')
      .send({ project_id: nonExistingProjectId });

    // Assicurati che la risposta abbia uno stato 404 (non trovato)
    expect(response.status).toBe(400);

    // Verifica che la risposta contenga un messaggio di errore appropriato
    expect(response.body).toHaveProperty('message', 'Invalid project_id');
    expect(response.body).toHaveProperty('type', 'danger');
  });

  test('should delete project by ID successfully', async () => {

    // Genera un token valido per l'autenticazione
    const token = jwt.sign({ username:"prova123" }, 'ABFC', { expiresIn: '1h' });

    // Effettua una richiesta DELETE per eliminare il progetto e il manager associato
    const response = await request(app)
      .delete('/api/delete_project')
      .set('token',token)
      .send({ project_id: newProjectId });

    // Assicurati che la risposta abbia uno stato 201 (creato con successo)
    expect(response.status).toBe(201);

    // Verifica che la risposta contenga un messaggio di successo
    expect(response.body).toHaveProperty('message', 'Project Removed Successfully');
    await User.findByIdAndDelete(userID);
  });
  // Aggiungi altri test a seconda delle tue esigenze
});
