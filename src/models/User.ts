import { Schema, model, type Document } from 'mongoose';

interface IUser extends Document {
    username: string,
    email: string,
    thoughts: Schema.Types.ObjectId[],
    friends: Schema.Types.ObjectId[],
   }

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
          },
          email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must match an email address!'],
          },
          thoughts: [
            {
              type: Schema.Types.ObjectId,
              ref: 'Thought',
            },
          ],
          friends: [
            {
              type: Schema.Types.ObjectId,
              ref: 'User',
            },
          ],
        },
        {
          toJSON: {
            virtuals: true,
          },
          id: false,
        }
       );

// const studentSchema = new Schema<IStudent>({
//     first: {
//         type: String,
//         required: true,
//         max_length: 50,
//     },
//     last: {
//         type: String,
//         required: true,
//         max_length: 50,
//     },
//     github: {
//         type: String,
//         required: true,
//         max_length: 50,
//     },
//     assignments: [assignmentSchema],
// },
//     {
//         toJSON: {
//             getters: true,
//         },
//         timestamps: true
//     }
// );

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
   });
   
   const User = model('User', userSchema);
   
   export default User;