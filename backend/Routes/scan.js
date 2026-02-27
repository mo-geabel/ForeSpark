const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../Middleware/auth');
const Scan = require('../Models/Scan');
const dotenv = require('dotenv');
dotenv.config();

// @route    POST api/scans/analyze
// @desc     Get AI prediction from Flask and save to DB
// @access   Private
router.post('/analyze', auth, async (req, res) => {
    console.log("hello");
    const { lat, lng, name } = req.body;
    console.log(lat, lng, name);
    console.log(process.env.API_LOCAL);

    try {
        // 1. Call Flask AI
        const flaskResponse = await axios.post(process.env.API_LOCAL, {
            lat: Number(lat),
            lng: Number(lng)
        });

        if (flaskResponse.status === 502 || flaskResponse.status === 504) {
            console.log("AI Service is currently waking up. Please try again in 10 seconds.") 
        }

        // Flask returns: { result: "High Risk", total_probability: 0.85, grid_data: [...] }
        const { result, total_probability, grid_data } = flaskResponse.data;

        // 2. Map data to your exact ScanSchema and reconstruct coordinates
        // Python order: NW, N, NE, W, CENTER, E, SW, S, SE
        const COORD_OFFSET = 0.0031;
        const mappedGridData = grid_data.map((point, index) => {
            const lat_s = 1 - Math.floor(index / 3);
            const lng_s = (index % 3) - 1;
            
            return {
                ...point,
                lat: Number(lat) + (lat_s * COORD_OFFSET),
                lng: Number(lng) + (lng_s * COORD_OFFSET)
            };
        });

        // Version for MongoDB (Strip the base64 images)
        const gridDataForDB = mappedGridData.map(p => {
            const { original_img, explanation_img, ...rest } = p;
            return {
                ...rest,
                weight_used: p.weighted_contribution
            };
        });

        const newScan = new Scan({
            userId: req.user.id,
            coordinates: {
                lat: Number(lat),
                lng: Number(lng),
                regionName: name || 'Unknown Forest Area'
            },
            prediction: {
                riskLevel: result,        
                accuracy: total_probability,    
                modelId: 'MobileNetV2-v2',
                timestamp: new Date()
            },
            gridData: gridDataForDB, 
            isSavedToUserHistory: false 
        });

        // 3. Save to MongoDB
        const savedScan = await newScan.save();

        // 4. Send back to React (Including transient base64 images and coords)
        res.status(201).json({
            _id: savedScan._id,
            result: result,
            total_probability: total_probability,
            grid_data: mappedGridData, 
            timestamp: savedScan.prediction.timestamp
        });

    } catch (err) {
        console.error('Bridge Error:', err.message);
        res.status(500).json({ 
            message: 'Analysis alignment failed', 
            error: err.message 
        });
    }
});

router.patch('/feedback/:scanId', async (req, res) => {
  const { isCorrect, notes } = req.body;
  console.log(isCorrect);
  try {
    const updatedScan = await Scan.findByIdAndUpdate(
      req.params.scanId,
      { 
        $set: { 
          'userFeedback.isCorrect': isCorrect,
          'userFeedback.notes': notes,
          'isSavedToUserHistory': true
        } 
      },
      { new: true }
    );
    console.log(updatedScan);
    res.json(updatedScan);
  } catch (err) {
    res.status(500).json({ message: "Failed to save feedback" });
  }
});

router.get('/my-history', auth, async (req, res) => {
  try {
    // Find scans belonging to the user that they chose to save
    const userHistory = await Scan.find({ 
      userId: req.user.id, 
      isSavedToUserHistory: true 
    }).sort({ 'prediction.timestamp': -1 });

    res.json(userHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching history');
  }
});
module.exports = router;