import dotenv from 'dotenv';
import { ArchitectAgent } from '../src/agents/ArchitectAgent';
import { logger } from '../src/utils/logger';

dotenv.config();

async function testOpenRouter() {
  logger.info('Test', 'Starting OpenRouter connectivity test...');
  
  const agent = new ArchitectAgent();
  const input = {
    task: {
      id: 'test-task',
      title: 'Health Check',
      description: 'Create a simple ping endpoint',
      acceptanceCriteria: ['Should return 200 OK'],
      estimatedComplexity: 'S',
      affectedDomains: ['backend'],
      riskLevel: 'LOW',
      requestedBy: 'test',
      rawRequirement: 'Add /ping',
      createdAt: new Date().toISOString()
    }
  };

  try {
    logger.info('Test', `Using provider: ${process.env.AI_PROVIDER}`);
    logger.info('Test', `Using model: ${process.env.FORGEMIND_MODEL_DEFAULT_OPENROUTER}`);
    
    const result = await agent.execute(input as any);
    
    logger.success('Test', 'Successfully received response from OpenRouter!');
    console.log('--- Message ---');
    console.log(result.message);
    console.log('--- Scope Affected Files ---');
    console.log(result.scope?.affectedFiles);
    console.log('--- Usage ---');
    console.log(result.usage);
    
  } catch (error: any) {
    logger.fail('Test', `OpenRouter test failed: ${error.message}`);
    process.exit(1);
  }
}

testOpenRouter();
