const { ObjectId } = require('mongodb');
const { create, getMany , getOne,findWithPegination} = require('../../helper/mongo');
const collection_name = 'checklists';

module.exports.createChecklist = async (data) => {
  try {
    return await create(data, collection_name);
  } catch (error) {
    console.log('Error while creating checklist');
    throw error;
  }
};

module.exports.getAllChecklists = async (query) => {
  try {
    let filter = {}
    if(query.checklistId) filter._id = new ObjectId(query.checklistId)
    if(query.title) filter.title = query.title
    if(query.createdBy) filter.createdBy = query.createdBy

    return await findWithPegination(filter,{},query,collection_name);
  } catch (error) {
    console.log('Error while fetching checklists');
    throw error;
  }
};

module.exports.getChecklistById = async (id) => {
    try {
        const query = { _id : new ObjectId(id) };
        return await getOne(query, collection_name);
    } catch (error) {
        console.log('Error in getChecklistById:', error);
        throw error;
    }
};
