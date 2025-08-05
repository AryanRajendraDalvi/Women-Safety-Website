const express = require('express');
const Incident = require('../models/Incident');
const { auth } = require('../middleware/auth');
const { validateAIAssistant, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Generate POSH complaint
router.post('/generate-complaint', auth, validateAIAssistant, handleValidationErrors, async (req, res) => {
  try {
    const { incidentId, language = 'english' } = req.body;
    
    const incident = await Incident.findOne({
      _id: incidentId,
      userId: req.user._id
    });
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    // Generate POSH complaint based on incident data
    const complaint = generatePOSHComplaint(incident, language);
    
    res.json({
      complaint,
      incident: incident.getSummary()
    });
  } catch (error) {
    console.error('Generate complaint error:', error);
    res.status(500).json({ error: 'Server error while generating complaint' });
  }
});

// Generate incident summary
router.post('/generate-summary', auth, validateAIAssistant, handleValidationErrors, async (req, res) => {
  try {
    const { incidentId, language = 'english' } = req.body;
    
    const incident = await Incident.findOne({
      _id: incidentId,
      userId: req.user._id
    });
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    // Generate summary based on incident data
    const summary = generateIncidentSummary(incident, language);
    
    res.json({
      summary,
      incident: incident.getSummary()
    });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({ error: 'Server error while generating summary' });
  }
});

// Get legal advice
router.post('/legal-advice', auth, validateAIAssistant, handleValidationErrors, async (req, res) => {
  try {
    const { incidentId, language = 'english' } = req.body;
    
    const incident = await Incident.findOne({
      _id: incidentId,
      userId: req.user._id
    });
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    // Generate legal advice based on incident data
    const advice = generateLegalAdvice(incident, language);
    
    res.json({
      advice,
      incident: incident.getSummary()
    });
  } catch (error) {
    console.error('Generate legal advice error:', error);
    res.status(500).json({ error: 'Server error while generating legal advice' });
  }
});

// Helper function to generate POSH complaint
function generatePOSHComplaint(incident, language) {
  const severityMap = {
    low: 'minor',
    medium: 'moderate',
    high: 'serious',
    critical: 'severe'
  };
  
  const categoryMap = {
    verbal_harassment: 'verbal harassment',
    physical_harassment: 'physical harassment',
    sexual_harassment: 'sexual harassment',
    discrimination: 'discrimination',
    bullying: 'bullying',
    retaliation: 'retaliation',
    other: 'inappropriate behavior'
  };
  
  const templates = {
    english: {
      title: 'Formal Complaint Under POSH Act, 2013',
      intro: `I am writing to formally lodge a complaint under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act) regarding an incident of ${categoryMap[incident.category]} that occurred on ${new Date(incident.createdAt).toLocaleDateString()}.`,
      details: `The incident involved ${severityMap[incident.severity]} ${categoryMap[incident.category]} at ${incident.location || 'the workplace'}. ${incident.description}`,
      witnesses: incident.witnesses ? `Witnesses to this incident include: ${incident.witnesses}` : 'No witnesses were present during this incident.',
      request: 'I request that this matter be investigated thoroughly and appropriate action be taken as per the provisions of the POSH Act.',
      closing: 'I look forward to your prompt response and appropriate action in this matter.'
    },
    hindi: {
      title: 'पॉश अधिनियम, 2013 के तहत औपचारिक शिकायत',
      intro: `मैं कार्यस्थल पर महिलाओं का यौन उत्पीड़न (निवारण, निषेध और निवारण) अधिनियम, 2013 (पॉश अधिनियम) के तहत ${new Date(incident.createdAt).toLocaleDateString()} को हुई ${categoryMap[incident.category]} की घटना के संबंध में औपचारिक शिकायत दर्ज कर रही हूं।`,
      details: `इस घटना में ${incident.location || 'कार्यस्थल'} पर ${severityMap[incident.severity]} ${categoryMap[incident.category]} शामिल था। ${incident.description}`,
      witnesses: incident.witnesses ? `इस घटना के गवाह हैं: ${incident.witnesses}` : 'इस घटना के दौरान कोई गवाह मौजूद नहीं था।',
      request: 'मैं अनुरोध करती हूं कि इस मामले की पूरी जांच की जाए और पॉश अधिनियम के प्रावधानों के अनुसार उचित कार्रवाई की जाए।',
      closing: 'मैं इस मामले में आपकी तत्काल प्रतिक्रिया और उचित कार्रवाई की प्रतीक्षा कर रही हूं।'
    }
  };
  
  const template = templates[language] || templates.english;
  
  return {
    title: template.title,
    content: `${template.intro}\n\n${template.details}\n\n${template.witnesses}\n\n${template.request}\n\n${template.closing}`,
    generatedAt: new Date().toISOString(),
    language
  };
}

// Helper function to generate incident summary
function generateIncidentSummary(incident, language) {
  const templates = {
    english: {
      title: 'Incident Summary Report',
      content: `**Incident Title:** ${incident.title}\n\n**Date:** ${new Date(incident.createdAt).toLocaleDateString()}\n**Location:** ${incident.location || 'Not specified'}\n**Severity:** ${incident.severity}\n**Category:** ${incident.category}\n\n**Description:**\n${incident.description}\n\n**Witnesses:** ${incident.witnesses || 'None reported'}\n\n**Status:** ${incident.status}\n**Tags:** ${incident.tags.join(', ') || 'None'}`
    },
    hindi: {
      title: 'घटना सारांश रिपोर्ट',
      content: `**घटना का शीर्षक:** ${incident.title}\n\n**तिथि:** ${new Date(incident.createdAt).toLocaleDateString()}\n**स्थान:** ${incident.location || 'निर्दिष्ट नहीं'}\n**गंभीरता:** ${incident.severity}\n**श्रेणी:** ${incident.category}\n\n**विवरण:**\n${incident.description}\n\n**गवाह:** ${incident.witnesses || 'कोई नहीं'}\n\n**स्थिति:** ${incident.status}\n**टैग:** ${incident.tags.join(', ') || 'कोई नहीं'}`
    }
  };
  
  const template = templates[language] || templates.english;
  
  return {
    title: template.title,
    content: template.content,
    generatedAt: new Date().toISOString(),
    language
  };
}

// Helper function to generate legal advice
function generateLegalAdvice(incident, language) {
  const adviceTemplates = {
    english: {
      title: 'Legal Advice and Next Steps',
      content: `Based on your incident report, here are the recommended legal steps:\n\n1. **Document Everything:** Keep detailed records of all incidents, including dates, times, locations, and witnesses.\n\n2. **Report to Internal Committee:** If your organization has an Internal Complaints Committee (ICC), file a formal complaint.\n\n3. **External Complaint:** If internal mechanisms fail, you can approach the Local Complaints Committee (LCC).\n\n4. **Legal Counsel:** Consider consulting with a lawyer specializing in workplace harassment cases.\n\n5. **Evidence Preservation:** Maintain all evidence including emails, messages, photos, and witness statements.\n\n6. **Time Limits:** Be aware that complaints under POSH Act should be filed within 3 months of the incident.\n\n**Your Rights:**\n- Right to a safe workplace\n- Right to file complaints without retaliation\n- Right to confidentiality\n- Right to appropriate redressal`
    },
    hindi: {
      title: 'कानूनी सलाह और अगले कदम',
      content: `आपकी घटना रिपोर्ट के आधार पर, यहां अनुशंसित कानूनी कदम हैं:\n\n1. **सब कुछ दर्ज करें:** सभी घटनाओं का विस्तृत रिकॉर्ड रखें, जिसमें तिथियां, समय, स्थान और गवाह शामिल हैं।\n\n2. **आंतरिक समिति को रिपोर्ट करें:** यदि आपके संगठन में आंतरिक शिकायत समिति (ICC) है, तो औपचारिक शिकायत दर्ज करें।\n\n3. **बाहरी शिकायत:** यदि आंतरिक तंत्र विफल होते हैं, तो आप स्थानीय शिकायत समिति (LCC) से संपर्क कर सकते हैं।\n\n4. **कानूनी सलाह:** कार्यस्थल उत्पीड़न मामलों में विशेषज्ञता रखने वाले वकील से परामर्श करने पर विचार करें।\n\n5. **साक्ष्य संरक्षण:** ईमेल, संदेश, तस्वीरें और गवाह बयान सहित सभी साक्ष्य बनाए रखें।\n\n6. **समय सीमा:** ध्यान रखें कि पॉश अधिनियम के तहत शिकायतें घटना के 3 महीने के भीतर दर्ज की जानी चाहिए।\n\n**आपके अधिकार:**\n- सुरक्षित कार्यस्थल का अधिकार\n- प्रतिशोध के बिना शिकायत दर्ज करने का अधिकार\n- गोपनीयता का अधिकार\n- उचित निवारण का अधिकार`
    }
  };
  
  const template = adviceTemplates[language] || adviceTemplates.english;
  
  return {
    title: template.title,
    content: template.content,
    generatedAt: new Date().toISOString(),
    language
  };
}

module.exports = router; 