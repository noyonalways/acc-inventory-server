const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a valid product name"],
        trim: true,
        unique: [true, "Name must be unique"],
        minLength: [3, "Name must be at least 3 character"],
        maxLength: [100, "Name is too large"]
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price can't be negetive"]
    },
    unit: {
        type: String,
        required: true,
        enum: {
            values: ["kg", "litre", "pcs"],
            message: "Unit value can't be {VALUE}, must be kg/litre/pcs"
        }
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "Qunatity can't be negetive"],
        validate: {
            validator: (value) => {
                const isInteger = Number.isInteger(value);
                if (isInteger) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        message: "Qunatity must be an integer"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['in-stock', 'out-of-stock', 'discontinued'],
            message: "Status can't be {VALUE}"
        }
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   detfault: Date.now
    // }
    // supplier: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Supplier"
    // },
    // categories: [{
    //   name: {
    //     type: String,
    //     required: true
    //   },
    //   _id: mongoose.Schema.Types.ObjectId
    // }]
}, {
    timestamps: true,
});


// moongoose middleware  for saving data: pre / post

productSchema.pre('save', function (next) {

    // this
    // console.log("Before saving data");
    if (this.quantity === 0) {
        this.status = 'out-of-stock';
    }
    else if (this.quantity >= 1) {
        this.status = 'in-stock';
    }

    next();
});



//  productSchema.post('save',function(doc,next){
//   console.log('After saving data');

//   next()
// })

productSchema.methods.logger = function () {
    console.log(`Data saved for ${this.name}`);
};


// SCHEMa -> MODEL -> QUERY
const Product = mongoose.model('Product', productSchema);

module.exports = Product;