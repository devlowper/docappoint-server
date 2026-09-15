const Doctor = require('../models/Doctor.model');

const getAllDoctors = async (req, res) => {
  try {
    const { search, sort, specialty } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 60;
    const skip = (page - 1) * limit;
    
    let queryObj = {};
    if (search) {
      queryObj.name = { $regex: search, $options: 'i' };
    }
    if (specialty) {
      queryObj.specialty = { $regex: specialty, $options: 'i' };
    }

    let dbQuery = Doctor.find(queryObj);

    // Database-level sorting
    if (sort === 'rating') {
      dbQuery = dbQuery.sort({ rating: -1 }); // Descending
    } else if (sort === 'fee_low') {
      dbQuery = dbQuery.sort({ fee: 1 }); // Ascending
    } else if (sort === 'fee_high') {
      dbQuery = dbQuery.sort({ fee: -1 }); // Descending
    }

    const total = await Doctor.countDocuments(queryObj);
    let doctors;

    // If sorting by experience, we must fetch first and sort in memory 
    // because experience is a string (e.g. '5 years').
    if (sort === 'experience') {
      let allDoctors = await dbQuery;
      
      // Parse integers from strings like '5 Years' and sort descending
      allDoctors.sort((a, b) => {
        const expA = parseInt(a.experience) || 0;
        const expB = parseInt(b.experience) || 0;
        return expB - expA;
      });

      // Apply pagination in memory
      doctors = allDoctors.slice(skip, skip + limit);
    } else {
      // Normal DB pagination
      doctors = await dbQuery.skip(skip).limit(limit);
    }

    res.status(200).json({ 
      success: true, 
      count: doctors.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
      data: doctors 
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error('Error fetching doctor by id:', error);
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById
};
