// src/users/restful/addPaymentMethod.endpoint.ts
import { Request, Response } from 'express'
import { Post } from 'firebase-backend' // Get, Post, Put, Update, Delete available
import { log } from 'firebase-functions/lib/logger';
import { isAuthenticated } from '../../auth/authenticated';
import { firestoreDatabase } from '../../config/firebase';

// Use the `Post` class which is extended from the `Endpoint` class.
export default new Post(async (request: Request, response: Response) => {
  // Read the values out of the body
  const cardNumber = request.body['card_number'];
  const cardHolder = request.body['card_holder'];


  try {
    const orderDoc = firestoreDatabase.collection('orders').doc();
    const order = {
      cardNumber: cardNumber,
      cardHolder: cardHolder,
    }

    log(orderDoc.id)

    const result = await orderDoc.set(order);

    log(result.writeTime)



    // Send your response. 201 to indicate the creation of a new resource
    return response.status(201).send({
      order: {
        id: orderDoc.id,
        ...order
      }
    });
  } catch (error) {
    return response.status(500).json(error)
  }
},
  //Validate first if authenticated before executing the handler function.
  [isAuthenticated]
);