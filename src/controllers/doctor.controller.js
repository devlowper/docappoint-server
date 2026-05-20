const Doctor = require('../models/Doctor.model');

const getAllDoctors = async (req, res) => {
  try {
    const { search, sort, limit } = req.query;
    
    let queryObj = {};
    if (search) {
      queryObj.name = { $regex: search, $options: 'i' };
    }

    let dbQuery = Doctor.find(queryObj);

    // Database-level sorting
    if (sort === 'rating') {
      dbQuery = dbQuery.sort({ rating: -1 }); // Descending
    } else if (sort === 'fee') {
      dbQuery = dbQuery.sort({ fee: 1 }); // Ascending
    }

    // If sorting by experience, we must fetch first and sort in memory 
    // because experience is a string (e.g. '5 years') and we need to parse it.
    // Therefore, we can't apply the DB limit yet if we're sorting by experience.
    if (sort !== 'experience' && limit) {
      dbQuery = dbQuery.limit(parseInt(limit));
    }

    let doctors = await dbQuery;

    // In-memory sorting for experience
    if (sort === 'experience') {
      // Parse integers from strings like '5 Years' and sort descending
      doctors.sort((a, b) => {
        const expA = parseInt(a.experience) || 0;
        const expB = parseInt(b.experience) || 0;
        return expB - expA;
      });

      // Apply limit after in-memory sort
      if (limit) {
        doctors = doctors.slice(0, parseInt(limit));
      }
    }

    res.status(200).json({ success: true, count: doctors.length, data: doctors });
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
