const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  title: { 
    type: String, 
    default: 'Terms of Service & Privacy Policy' 
  },
  content: { 
    type: String, 
    default: `Welcome to ForeSpark. By using our services, registering an account, or continuing with Google Sign-In, you agree to comply with and be bound by the following terms and policies:

1. Acceptance of Terms
By creating an account or using ForeSpark services, you acknowledge that you have read, understood, and agreed to be bound by these policies.

2. Privacy & Data Collection
We collect basic profile information (such as name and email address) and scan history to provide fire prediction, satellite analysis, and reporting services. We prioritize your privacy and do not sell your personal data to third parties.

3. Google Authentication
When signing in or registering with Google, you authorize ForeSpark to authenticate your identity using your verified Google profile information (name, email, and Google profile ID) in accordance with Google API Services User Data Policy.

4. Acceptable Use
You agree to use ForeSpark exclusively for lawful fire safety, monitoring, and educational evaluation purposes. Any attempt to abuse, reverse-engineer, or disrupt platform infrastructure is strictly prohibited.

5. AI Prediction Disclaimer
ForeSpark provides risk assessments using satellite imagery and machine learning models. These predictions are designed for situational awareness and decision support. They do not replace authoritative directives from civil defense or emergency services.

6. Account Management & Termination
Administrators reserve the right to suspend or terminate accounts that violate platform policies or compromise system security.

7. Policy Updates
These policies may be revised periodically by administrators. Continued use of ForeSpark following any updates constitutes acceptance of the modified policies.` 
  },
  requireAcceptance: { 
    type: Boolean, 
    default: true 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  updatedBy: { 
    type: String, 
    default: 'System Administrator' 
  }
});

module.exports = mongoose.model('Policy', PolicySchema);
