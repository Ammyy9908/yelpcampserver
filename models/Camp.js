const {model, Schema} = require('mongoose');


const campSchema = new Schema({
    location:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
});


const Camp = model('camp', campSchema);

module.exports = Camp;