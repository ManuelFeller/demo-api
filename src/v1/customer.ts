import * as express from 'express';
import { Authenticator } from '../utils/authenticator';
export const customerRouter = express.Router();


customerRouter.get("/all", Authenticator.getTokenCheck(), async (req: any, res: any) => {
	res.setHeader('content-type', 'application/json');
  res.status(200).send(JSON.stringify({status: 'OK'}));
}
);