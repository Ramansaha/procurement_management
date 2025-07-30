const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLList
} = require('graphql');

// Example: Import your model/controller functions
const { getOrderById, getAllOrders ,getOrders} = require('../controllers/order/order');
const { getChecklistById } = require('../controllers/checklist/checklist');

// Checklist Type
const ChecklistType = new GraphQLObjectType({
    name: 'Checklist',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    })
});

// Order Type
const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        name: { type: GraphQLString },
        checklist: {
            type: ChecklistType,
            resolve(parent, args) {
                return getChecklistById(parent.checklistId); // link checklist by ID
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        order: {
            type: OrderType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return getOrderById(args.id);
            }
        },
        orders: {
            type: new GraphQLList(OrderType),
            resolve(parent, args) {
                return getOrders();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});

