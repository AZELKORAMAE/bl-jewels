import mongoose, { Schema, Model, models } from 'mongoose';

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    price: number;
}

export interface IOrder {
    _id: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: IOrderItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'paid' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        customerName: {
            type: String,
            required: [true, 'Le nom du client est requis'],
            trim: true,
        },
        customerPhone: {
            type: String,
            required: [true, 'Le numéro de téléphone est requis'],
            trim: true,
        },
        customerAddress: {
            type: String,
            required: [true, "L'adresse est requise"],
            trim: true,
        },
        items: {
            type: [OrderItemSchema],
            required: true,
            validate: {
                validator: (items: IOrderItem[]) => items.length > 0,
                message: 'La commande doit contenir au moins un produit',
            },
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'paid', 'cancelled'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Order: Model<IOrder> =
    models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
