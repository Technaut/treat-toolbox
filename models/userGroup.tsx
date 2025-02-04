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

export default interface UserGroup {
  id: string;
  name: string;
}

export namespace UserGroups {
  export const FB_COLLECTION_NAME = "userGroups";

  export const all = async (
    orderByField: string = "name",
    orderByDirection: OrderByDirection = "asc"
  ): Promise<Array<UserGroup>> => {
    const userGroupsQuery = query(
      collection(db, FB_COLLECTION_NAME),
      orderBy(orderByField, orderByDirection)
    );
    const querySnapshot = await getDocs(userGroupsQuery);

    const userGroups = querySnapshot.docs.map((userGroupDoc) => {
      const userGroup = userGroupDoc.data() as UserGroup;
      userGroup.id = userGroupDoc.id;
      return userGroup;
    });

    return userGroups;
  };

  export const withId = async (userGroupId: string): Promise<UserGroup> => {
    const userGroupDocRef = doc(db, FB_COLLECTION_NAME + "/" + userGroupId);

    const userGroupDoc = await getDoc(userGroupDocRef);
    const userGroup = userGroupDoc.data() as UserGroup;
    userGroup.id = userGroupDoc.id;
    return userGroup;
  };

  export const create = async (userGroup: UserGroup): Promise<UserGroup> => {
    const docQuery = collection(db, FB_COLLECTION_NAME);

    const docRef = await addDoc(docQuery, userGroup);

    userGroup.id = docRef.id;

    return {
      ...userGroup,
    } as UserGroup;
  };

  export const update = async (
    updates: { [x: string]: any },
    id: string
  ): Promise<void> => {
    const docRef = doc(db, FB_COLLECTION_NAME + "/" + id);
    return await updateDoc(docRef, updates);
  };

  export const remove = async (id: string) => {
    const docRef = doc(db, FB_COLLECTION_NAME + "/" + id);
    return await deleteDoc(docRef);
  };
}
