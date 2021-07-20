import * as admin from 'firebase-admin'
import * as serviceAccount from "./firabase-backend-api-firebase-adminsdk-yj18z-5df6873c66.json";

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
    }),
    databaseURL: "https://firabase-backend-api.firebaseio.com",
});
// admin.initializeApp()


//Create admin user for test
let adminUser: admin.auth.UserRecord | undefined;

getAdminUser();

export { adminUser }
export { admin }

const firestoreDatabase = admin.firestore()
export { firestoreDatabase }

async function getAdminUser() {
    await admin.auth().getUserByEmail("admin@example.com")
        .then((userRecord) => {
            adminUser = userRecord;
        })
        .catch((error) => {
            console.log('Error creating new user:', error);
            createUser();
        });
}

async function createUser() {
    await admin.auth().createUser({
        email: 'admin@example.com',
        emailVerified: false,
        phoneNumber: '+11234567890',
        password: 'secretPassword',
        displayName: 'Admin John Doe',
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false,
    })
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            adminUser = userRecord;
            console.log('Successfully created new user:', userRecord.uid);
        })
        .catch((error) => {
            console.log('Error creating new user:', error);
        });
}
