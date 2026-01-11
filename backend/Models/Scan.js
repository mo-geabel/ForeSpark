const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  // Link to the user
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Geographical Data
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    regionName: String // Useful for admin to see "Antalya" or "Muğla" at a glance
  },
  
  // AI Output - Now open-ended for evolution
  prediction: {
    riskLevel: { type: String, required: true }, // No enum, allows "High", "Critical", or "7.5/10"
    accuracy: Number,
    modelId: String, // Track which version of the AI (v1, v2) made the prediction
    timestamp: { type: Date, default: Date.now }
  },

  // Detailed Grid Analysis (New)
  gridData: [{
    label: String, // "NW", "CENTER"
    lat: Number,
    lng: Number,
    individual_prob: Number,
    weight_used: Number
  }],

  // FEEDBACK SYSTEM (For Reinforcement Learning)
  userFeedback: {
    isCorrect: { type: Boolean, default: null }, // Thumbs up/down
    userLabel: String, // User could manually set what they think the risk was
    notes: String
  },

  // Metadata
  isSavedToUserHistory: { type: Boolean, default: false }
});

module.exports = mongoose.model('Scan', ScanSchema);