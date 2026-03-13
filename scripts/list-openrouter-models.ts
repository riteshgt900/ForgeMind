import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  try {
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const geminiModels = response.data.data.filter((m: any) => m.id.toLowerCase().includes('gemini'));
    console.log('--- Gemini Models ---');
    geminiModels.forEach((m: any) => console.log(`${m.id} - ${m.pricing.prompt}/${m.pricing.completion}`));
    
    const freeModels = response.data.data.filter((m: any) => m.id.endsWith(':free'));
    console.log('\n--- Free Models ---');
    freeModels.forEach((m: any) => console.log(m.id));
    
    console.log('\n--- All Models (First 10) ---');
    response.data.data.slice(0, 10).forEach((m: any) => console.log(m.id));
    
  } catch (error: any) {
    console.error('Failed to list models:', error.message);
  }
}

listModels();
