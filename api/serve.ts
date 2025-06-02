import {VercelRequest, VercelResponse} from '@Vercel/node';
export default function handler(req: VercelRequest, res: VercelResponse){
  res.status(200).json({message: 'Hello from vercel API!'});
}
