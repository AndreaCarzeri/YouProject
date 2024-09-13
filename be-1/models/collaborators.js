const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
});

module.exports = mongoose.model('Collaborator', collaboratorSchema);