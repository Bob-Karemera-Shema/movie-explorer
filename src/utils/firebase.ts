import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore, orderBy, query, QuerySnapshot, serverTimestamp } from "firebase/firestore";

import type { QueryDocumentSnapshot } from "firebase/firestore";
import type { Review } from "./types";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialise Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Constant database path slugs
const root = "reviews";
const review_subcollection = "items";



// Function to fetch all reviews for a given movie once
export const fetchReviews = async (movieId: string): Promise<Review[]> => {
  const reviewsRef = collection(db, root, movieId, review_subcollection);
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const snapshot: QuerySnapshot = await getDocs(q);

  return snapshot.docs.map((docSnap: QueryDocumentSnapshot) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name as string,
      rating: data.rating as number,
      comment: data.comment as string,
      createdAt: data.createdAt.toDate() as Date,
    }
  });
}

// Function to add a review document to the reviews database
export const addReview = async (movieId: string, review: Omit<Review, "id" | "createdAt">): Promise<void> => {
  const reviewsRef = collection(db, root, movieId, review_subcollection);

  try {
    await addDoc(reviewsRef, {
      ...review,
      createdAt: serverTimestamp()
    })
  } catch (err) {
    console.error("Error adding document: ", err);
  }
};