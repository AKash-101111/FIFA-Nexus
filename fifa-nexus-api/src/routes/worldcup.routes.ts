import { Router } from 'express';
import { worldCupService } from '../services/WorldCupService';

const router = Router();

router.get('/live', async (req, res) => {
  try {
    const matches = await worldCupService.getLiveScores();
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const matches = await worldCupService.getUpcomingMatches();
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/finished', async (req, res) => {
  try {
    const matches = await worldCupService.getFinishedMatches();
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
