import { db } from "../app-firebase";
import {
  query,
  collection,
  doc,
  orderBy,
  OrderByDirection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Projects } from "./project";
import { Collections } from "./collection";

export default interface Trait {
  id: string;
  name: string;
  zIndex: number;
  isMetadataOnly: boolean;
  excludeFromDuplicateDetection: boolean;
}

export namespace Traits {
  export const FB_COLLECTION_NAME = "traits";

  export const all = async (
    projectId: string,
    collectionId: string,
    orderByField: string = "zIndex",
    orderByDirection: OrderByDirection = "asc",
    excludeMetadataOnly: boolean = false
  ): Promise<Array<Trait>> => {
    const traitsQuery = query(
      collection(
        db,
        Projects.FB_COLLECTION_NAME +
          "/" +
          projectId +
          "/" +
          Collections.FB_COLLECTION_NAME +
          "/" +
          collectionId +
          "/" +
          FB_COLLECTION_NAME
      ),
      orderBy(orderByField, orderByDirection)
    );

    const querySnapshot = await getDocs(traitsQuery);

    const traits = querySnapshot.docs.map((traitDoc) => {
      const trait = traitDoc.data() as Trait;
      trait.id = traitDoc.id;
      return trait;
    });

    if (excludeMetadataOnly) {
      return traits.filter((trait) => {
        return trait.isMetadataOnly != true;
      });
    }

    return traits;
  };

  export const withId = async (
    projectId: string,
    collectionId: string,
    traitId: string
  ): Promise<Trait> => {
    const traitDocRef = doc(
      db,
      Projects.FB_COLLECTION_NAME +
        "/" +
        projectId +
        "/" +
        Collections.FB_COLLECTION_NAME +
        "/" +
        collectionId +
        "/" +
        Traits.FB_COLLECTION_NAME +
        "/" +
        traitId
    );

    const traitDoc = await getDoc(traitDocRef);

    let trait = traitDoc.data() as Trait;
    trait.id = traitDoc.id;
    return trait;
  };

  export const create = async (
    trait: Trait,
    projectId: string,
    collectionId: string
  ): Promise<Trait> => {
    const docQuery = collection(
      db,
      Projects.FB_COLLECTION_NAME +
        "/" +
        projectId +
        "/" +
        Collections.FB_COLLECTION_NAME +
        "/" +
        collectionId +
        "/" +
        FB_COLLECTION_NAME
    );

    const docRef = await addDoc(docQuery, trait);

    trait.id = docRef.id;

    return {
      ...trait,
    } as Trait;
  };

  export const update = async (
    updates: { [x: string]: any },
    id: String,
    projectId: string,
    collectionId: string
  ): Promise<void> => {
    const docRef = doc(
      db,
      Projects.FB_COLLECTION_NAME +
        "/" +
        projectId +
        "/" +
        Collections.FB_COLLECTION_NAME +
        "/" +
        collectionId +
        "/" +
        FB_COLLECTION_NAME +
        "/" +
        id
    );
    return await updateDoc(docRef, updates);
  };

  export const remove = async (
    id: string,
    projectId: string,
    collectionId: string
  ): Promise<void> => {
    const docRef = doc(
      db,
      Projects.FB_COLLECTION_NAME +
        "/" +
        projectId +
        "/" +
        Collections.FB_COLLECTION_NAME +
        "/" +
        collectionId +
        "/" +
        FB_COLLECTION_NAME +
        "/" +
        id
    );
    return await deleteDoc(docRef);
  };
}
