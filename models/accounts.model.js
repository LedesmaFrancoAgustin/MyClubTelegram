import mongoose from 'mongoose';

const accountsSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const accountsModel = mongoose.model('accounts', accountsSchema);

export default accountsModel;
