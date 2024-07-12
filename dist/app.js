"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("./db/connection"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
app.get('/users', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let users = [];
    try {
        users = yield connection_1.default.select('*').from('users');
    }
    catch (e) {
        response.status(500).json({
            error: 'Internal server error'
        });
        return;
    }
    response.status(200).json(users);
}));
app.get('/users/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = +request.params.id;
    if (!userId) {
        response.status(400).json({
            error: 'Invalid user id parameter'
        });
        return;
    }
    const user = yield connection_1.default.select('*').from('users').where('id', userId).first();
    if (!user) {
        response.status(404).json({
            error: 'User not found'
        });
        return;
    }
    response.status(200).json(user);
}));
app.delete('/users/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = +request.params.id;
    if (!userId) {
        response.status(400).json({
            error: 'Invalid user id parameter'
        });
        return;
    }
    const result = yield connection_1.default.delete().from('users').where('id', userId);
    if (!result) {
        response.status(404).json({
            error: 'User not found'
        });
        return;
    }
    response.status(204).send();
}));
app.post('/users', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        first_name: request.body.first_name || '',
        last_name: request.body.last_name || '',
        email: request.body.email || '',
        phone: request.body.phone || '',
        password: request.body.password || ''
    };
    let id = null;
    try {
        id = (yield (0, connection_1.default)('users').insert(userData)).pop();
    }
    catch (e) {
        response.status(400).json({
            error: 'Invalid user data'
        });
        return;
    }
    response.status(201).json(Object.assign({ id: id }, userData));
}));
app.put('/users/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = +request.params.id;
    if (!userId) {
        response.status(400).json({
            error: 'Invalid user id parameter'
        });
        return;
    }
    const user = yield connection_1.default.select('*').from('users').where('id', userId).first();
    if (!user) {
        response.status(404).json({
            error: 'User not found'
        });
        return;
    }
    user.first_name = request.body.first_name || '';
    user.last_name = request.body.last_name || '';
    user.email = request.body.email || '';
    user.phone = request.body.phone || '';
    user.password = request.body.password || '';
    try {
        yield (0, connection_1.default)('users').where('id', userId).update(user);
    }
    catch (e) {
        response.status(422).json({
            error: 'Unable to update a user'
        });
        return;
    }
    response.status(200).json(user);
}));
app.listen(port, () => {
    console.log(`Node backend app listening on port ${port}`);
});
