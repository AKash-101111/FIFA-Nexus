import { Router } from 'express';
import { YouTubeService } from '../services/YouTubeService';

const router = Router();

router.get('/highlights', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const highlights = await YouTubeService.getHighlights(query);
    res.json(highlights);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
