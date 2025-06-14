import * as  express from 'express'
const router = express.Router();
import * as  bodyParser from 'body-parser'
router.use(express.json());

router.post('/cone', (req, res) => {
    try {
        let data = {
            radius: req.body.radius,
            height: req.body.height,
            segments: req.body.segments,
            segments_height: 1
        };

        if (req.body.smooth) {
            data.segments_height = 1000;
            data.segments = 1000;
        }

        res.send(data);
    }
    catch (er) {
        console.log(er);
        res.status(401).send(er);
    };
});

export { router };

