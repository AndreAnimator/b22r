const mongoose = require("mongoose");

const EventDetailsSchema = new mongoose.Schema(
    {
        nome: {type:String, unique:true},
        modalidade: String,
        cidade: String,
        dataLargada: String,
        horario: String,
        organizacao: String,
        informacoes: String,
        patrocinio: [String],
        inscricoes: [String],
        programacao: String,
        regulamento: String,
    },
    {
        collections: "EventInfo",
    }
);

mongoose.model("EventInfo", EventDetailsSchema);