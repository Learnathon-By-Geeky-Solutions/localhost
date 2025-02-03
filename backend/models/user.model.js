import mongoose from "mongoose";

/**
 * schema: just a defined data sturcture
 * think of it as a class, where member data are defined
 * meaning, fixing a stucture for a document
 * even though mongodb is schema less, we try to enforce some schema
 * because a fixed data structure helps us think of the document as a class
 * but we also have the flexibility to add extra keys besides the schema if needed
 */

const userSchema = new mongoose.Schema(
    {
        email : {
            type: String,
            required: true,
            unique: true,
        },
        fullName : {
            type: String,
            required: true,

        },
        password : {
            type: String,
            required : true,
            minlength : 6,
        },
        profilePic:{
            type: String,
            default: "",

        }
    },
    {
        timestamps:true
    }
);
/**
 * new Schema(definitionObject, optionsObject), taking two parameter
 * so Schema({define all field}, {timestamps:True});
 * this is the structrue
 * To clarify the role of the second parameter, think of it like this:
 * The first object defines the "what" (fields in the document), 
 * the second object modifies the "how" (schema behavior, like timestamps or versioning).
 */



const User = mongoose.model("User", userSchema);
//syntax, .model(name, schema)
//keep the name singuler, conventional, firstCharacter uppercase

export default User;