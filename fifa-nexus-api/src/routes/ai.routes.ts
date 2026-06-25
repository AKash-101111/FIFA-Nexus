import { Router } from 'express';
import { GeminiService } from '../services/GeminiService';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/insight', verifyToken, async (req, res) => {
  try {
    const { prompt, cacheKey } = req.body;
    if (!prompt || !cacheKey) {
      return res.status(400).json({ error: 'prompt and cacheKey are required' });
    }
    const insight = await GeminiService.generateInsight(prompt, cacheKey);
    res.json({ insight });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/insight/stream', verifyToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Important for flush to work if proxy is involved
    res.setHeader('X-Accel-Buffering', 'no');

    const stream = await GeminiService.generateInsightStream(prompt);
    
    for await (const chunk of stream) {
      // Send the chunk in SSE format
      // Replace newlines to ensure valid SSE format, or just stringify the chunk
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    // Indicate end of stream
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error: any) {
    console.error('Stream error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

export default router;
