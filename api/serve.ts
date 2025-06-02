import {VercelRequest, VercelResponse} from '@Vercel/node';
export default function handler(req: VercelRequest, res: VercelResponse){
if(req.method !== 'POST'){
  return res.status(405).json({message:'only POST requests are allowed'})
}

  const {customerName, productID, quantity}=req.body

  if(!customerName || !productID|| !quantity){
    return res.status(400).json({message:'Missing required fields'})
  }
  const fakeOrderID= Math.floor(Math.random() *1000000)

  return res.status(200).json({
    message:'Order created successfully',
    order:{
      id: fakeOrderID,
      customerName,
      productID,
      quantity
    }
  })
  
}
