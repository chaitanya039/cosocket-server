import { Schema, model } from "mongoose";

const manufacturerSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    industry: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    contact: {
      email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        trim: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      }
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    operations: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        materials: {
          type: [String], // Array of strings
          required: true,
          validate: {
            validator: function(v) {
              return v.length > 0;
            },
            message: 'There must be at least one material.'
          }
        },
        tools: {
          type: [String], // Array of tools
          required: true,
          validate: {
            validator: function(v) {
              return v.length > 0;
            },
            message: 'There must be at least one tool.'
          }
        }
      }
    ]
  }, { timestamps: true });
  
const Manufacturer = model('Manufacturer', manufacturerSchema);
export default Manufacturer;