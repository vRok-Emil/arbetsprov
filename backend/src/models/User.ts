import mongoose, { Document, Schema } from "mongoose";


//definerar användarmodellen så att vi kan spara användare i databasen. 
export interface IUser extends Document {
    email: string;
    password:string; 
}

//detta är schemat för anvandarmodellen. Gjort så att email är unikt, dvs ingen kan registrera sig med samma email.

const UserSchema = new Schema<IUser>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;