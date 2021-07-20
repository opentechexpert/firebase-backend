import { describe, beforeAll, test } from '@jest/globals';

import pactum from "pactum";
import { getAuth, signInWithEmailAndPassword, useAuthEmulator } from "firebase/auth";
import { firebaseApp } from "../config/firebase";

//Init firebase app

firebaseApp;

const auth = getAuth();

useAuthEmulator(auth, "http://localhost:9092");


describe('Test Authenticated endpoints', () => {


    test('Test authenticated post endpoint', async () => {

        try {
            const userCredential = await signInWithEmailAndPassword(auth, "admin@example.com", "secretPassword");
            // Signed in 
            const user = userCredential.user;
            const token = await user.getIdToken();
            pactum.request.setDefaultHeaders('authorization', `Bearer ${token}`);
            pactum.request.setBaseUrl('http://localhost:5002/firabase-backend-api/us-central1/users-api');
            await pactum.spec()
                .post('/addPaymentMethod')
                .withBody({
                    "card_number": "5418754514815181",
                    "card_holder": "FilledStacks"
                })
                // .expectBodyContains({ "cardNumber": "5418754514815181", "cardHolder": "FilledStacks" })
                .expectStatus(201);

        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }, 30000);

});


