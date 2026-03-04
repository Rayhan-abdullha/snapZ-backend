import express, { Request, Response } from 'express';
import auth from '../api/auth';
import posts from '../api/post'
import video from '../api/video';

const router = express.Router();
router.get('/',(_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', code: 200, message: 'Welcome to the API' });
});

router.use('/auth', auth.routes);
router.use('/posts', posts.routes);
router.use('/posts', video.routes);

export const allRoutes = router;
