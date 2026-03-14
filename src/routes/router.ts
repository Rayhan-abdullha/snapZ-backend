import express, { Request, Response } from 'express';
import auth from '../api/auth';
import posts from '../api/post'
import video from '../api/video';
import course from '../api/course';
import conversation from '../api/conversation';

const router = express.Router();
router.get('/',(_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', code: 200, message: 'Welcome to the API' });
});

router.use('/auth', auth.routes);
router.use('/posts', posts.routes);
router.use('/posts', video.routes);
router.use('/courses', course.routes);
router.use('/chat', conversation.routes);

export const allRoutes = router;
